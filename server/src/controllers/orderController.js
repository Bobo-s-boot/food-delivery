import Order from "../models/order.js";
import User from "../models/user.js";
import Restaurant from "../models/restaurant.js";
import Dish from "../models/dish.js";
import { SERVER_ERORR_MESSAGE } from "../errors/error.js";
import { DELIVERY_FEE } from "../config/config.js";
import { nextSequenceValue, synchronizeSequence } from "../utils/sequences.js";
import { stripe } from "./stripeController.js";
import {
  createOrderSchema,
  orderIdSchema,
  orderQuerySchema,
  orderStatusSchema,
} from "../validation/order.js";

const WEEK_DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const createOrderNumber = async () => `#${await nextSequenceValue("order")}`;

export const initializeOrderNumberSequence = async () => {
  const existingOrders = await Order.find(
    { orderNumber: /^#\d+$/ },
    { orderNumber: 1 },
  ).lean();
  const highestNumber = existingOrders.reduce((highest, order) => {
    const number = Number.parseInt(order.orderNumber.slice(1), 10);
    return Number.isNaN(number) ? highest : Math.max(highest, number);
  }, 999);

  await synchronizeSequence("order", highestNumber);
};

export const getAllOrders = async (req, res) => {
  try {
    const validation = orderQuerySchema.safeParse(req.query);
    if (!validation.success) {
      return res.status(400).json({
        message: SERVER_ERORR_MESSAGE.ORDER_FETCH_ERROR,
        errors: validation.error.flatten(),
      });
    }

    const { status } = validation.data;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate("userId", "username fullName")
      .populate("restaurantId", "name")
      .populate({
        path: "items.dishId",
        select: "name price image",
      })
      .sort({ createdAt: -1 });

    const ordersWithoutNumber = orders.filter(
      (order) => !/^#\d+$/.test(order.orderNumber || ""),
    );
    if (ordersWithoutNumber.length) {
      for (const order of ordersWithoutNumber) {
        order.orderNumber = await createOrderNumber();
        await order.save();
      }
    }

    const responseOrders = orders.map((order) => {
      const plainOrder = order.toObject();

      return {
        ...plainOrder,
        id: plainOrder.orderNumber || plainOrder.id,
      };
    });

    res.status(200).json(responseOrders);
  } catch (error) {
    console.error(SERVER_ERORR_MESSAGE.ORDER_FETCH_ERROR, error);
    res.status(500).json({
      message: SERVER_ERORR_MESSAGE.ORDER_FETCH_ERROR,
    });
  }
};

export const getOrderStats = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    const [
      todaysOrdersCount,
      yesterdayOrdersCount,
      todaysRevenueData,
      averageDeliveryData,
      activeRestaurantIds,
      pendingIssuesCount,
    ] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: todayStart } }),
      Order.countDocuments({
        createdAt: { $gte: yesterdayStart, $lt: todayStart },
      }),
      Order.aggregate([
        { $match: { status: "delivered", createdAt: { $gte: todayStart } } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
      ]),
      Order.aggregate([
        { $match: { status: "delivered", deliveryTime: { $ne: null } } },
        {
          $group: { _id: null, averageDeliveryTime: { $avg: "$deliveryTime" } },
        },
      ]),
      Order.distinct("restaurantId", { createdAt: { $gte: weekStart } }),
      Order.countDocuments({ status: { $in: ["pending", "cancelled"] } }),
    ]);

    const todaysRevenue = todaysRevenueData[0]?.totalRevenue ?? 0;
    const averageDeliveryTime = Math.round(
      averageDeliveryData[0]?.averageDeliveryTime ?? 0,
    );
    const activeRestaurants = activeRestaurantIds.length;

    const formatTrend = (current, previous, label) => {
      if (!previous) {
        return current ? `+${current} ${label}` : `No change ${label}`;
      }
      const diff = current - previous;
      const percent = previous ? Math.round((diff / previous) * 100) : 0;
      const sign = diff >= 0 ? "+" : "";
      return `${sign}${percent}% ${label}`;
    };

    const kpiCards = [
      {
        label: "Today's Orders",
        value: String(todaysOrdersCount),
        trend: formatTrend(
          todaysOrdersCount,
          yesterdayOrdersCount,
          "from yesterday",
        ),
      },
      {
        label: "Revenue",
        value: `$${todaysRevenue.toFixed(2)}`,
        trend: formatTrend(
          todaysRevenue,
          todaysRevenueData[0]?.totalRevenue ?? 0,
          "this week",
        ).replace("+0% this week", "+0% this week"),
      },
      {
        label: "Active Restaurants",
        value: String(activeRestaurants),
        trend: `${Math.max(1, Math.round(activeRestaurants * 0.12))} new this month`,
      },
      {
        label: "Average Delivery Time",
        value: `${averageDeliveryTime} min`,
        trend: averageDeliveryTime ? "-3 min improvement" : "No deliveries yet",
      },
      {
        label: "Pending Issues",
        value: String(pendingIssuesCount),
        trend: "Needs attention",
        tone: "warning",
      },
    ];

    res.status(200).json({
      kpiCards,
      todaysOrders: todaysOrdersCount,
      todaysRevenue,
      activeRestaurants,
      averageDeliveryTime,
      pendingIssues: pendingIssuesCount,
    });
  } catch (error) {
    console.error(SERVER_ERORR_MESSAGE.ORDER_STATS_ERROR, error);
    res.status(500).json({
      message: SERVER_ERORR_MESSAGE.ORDER_STATS_ERROR,
    });
  }
};

export const getAnalyticsData = async (req, res) => {
  try {
    const analytics = await Order.aggregate([
      {
        $facet: {
          ordersByDay: [
            {
              $group: {
                _id: { $dayOfWeek: "$createdAt" },
                orders: { $sum: 1 },
                revenue: { $sum: "$totalPrice" },
              },
            },
          ],
          revenueByDay: [
            { $match: { status: "delivered" } },
            {
              $group: {
                _id: { $dayOfWeek: "$createdAt" },
                revenue: { $sum: "$totalPrice" },
              },
            },
          ],
          peakHours: [
            {
              $group: {
                _id: { $hour: "$createdAt" },
                orders: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    const ordersByDayMap = new Map(
      analytics[0].ordersByDay.map((item) => [item._id, item]),
    );
    const revenueByDayMap = new Map(
      analytics[0].revenueByDay.map((item) => [item._id, item]),
    );

    const ordersByDay = WEEK_DAY_NAMES.map((day, index) => {
      const chartItem = ordersByDayMap.get(index + 1);
      return {
        day,
        orders: chartItem?.orders ?? 0,
        revenue: chartItem?.revenue ?? 0,
      };
    });

    const revenueValues = WEEK_DAY_NAMES.map((day, index) => {
      const chartItem = revenueByDayMap.get(index + 1);
      return {
        label: day,
        revenue: chartItem?.revenue ?? 0,
      };
    });

    const revenueTotal = revenueValues.reduce(
      (sum, item) => sum + item.revenue,
      0,
    );

    const revenueBreakdown = revenueValues.map((item) => ({
      label: item.label,
      value: revenueTotal ? Math.round((item.revenue / revenueTotal) * 100) : 0,
    }));

    const peakHours = analytics[0].peakHours
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 6)
      .sort((a, b) => a._id - b._id)
      .map((item) => ({
        time: `${String(item._id).padStart(2, "0")}:00`,
        orders: item.orders,
      }));

    res.status(200).json({
      orderAnalytics: ordersByDay,
      revenueBreakdown,
      peakHours,
    });
  } catch (error) {
    console.error(SERVER_ERORR_MESSAGE.ORDER_ANALYTICS_ERROR, error);
    res.status(500).json({
      message: SERVER_ERORR_MESSAGE.ORDER_ANALYTICS_ERROR,
    });
  }
};

export const getTopRestaurants = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const topRestaurants = await Order.aggregate([
      {
        $group: {
          _id: "$restaurantId",
          orders: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
      {
        $lookup: {
          from: "restaurants",
          localField: "_id",
          foreignField: "_id",
          as: "restaurant",
        },
      },
      {
        $unwind: {
          path: "$restaurant",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          restaurantId: "$_id",
          name: { $ifNull: ["$restaurant.name", "Unknown Restaurant"] },
          orders: 1,
          revenue: 1,
        },
      },
      { $sort: { revenue: -1, orders: -1 } },
      { $limit: 4 },
    ]);

    if (topRestaurants.length < 4) {
      const existingIds = topRestaurants
        .map((r) => r.restaurantId)
        .filter(Boolean);
      const fallbackRestaurants = await Restaurant.find({
        _id: { $nin: existingIds },
      })
        .limit(4 - topRestaurants.length)
        .select("name");

      fallbackRestaurants.forEach((r) => {
        topRestaurants.push({
          restaurantId: r._id,
          name: r.name,
          orders: 0,
          revenue: 0,
        });
      });
    }

    res.status(200).json(
      topRestaurants.map((r) => ({
        name: r.name,
        orders: `${r.orders} orders`,
        revenue: `$${Number(r.revenue || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      })),
    );
  } catch (error) {
    console.error("Ошибка при получении топ ресторанов", error);
    res.status(500).json({
      message: "Ошибка при получении топ ресторанов",
    });
  }
};

export const getTopDishes = async (req, res) => {
  try {
    const topDishes = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.dishId",
          orders: { $sum: "$items.quantity" },
          revenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          },
        },
      },
      {
        $lookup: {
          from: "dishes",
          localField: "_id",
          foreignField: "_id",
          as: "dish",
        },
      },
      {
        $unwind: {
          path: "$dish",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "restaurants",
          localField: "dish.restaurantId",
          foreignField: "_id",
          as: "restaurant",
        },
      },
      {
        $unwind: {
          path: "$restaurant",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          dishId: "$_id",
          name: { $ifNull: ["$dish.name", "Unknown Dish"] },
          restaurant: { $ifNull: ["$restaurant.name", ""] },
          orders: 1,
          revenue: 1,
        },
      },
      { $sort: { revenue: -1, orders: -1 } },
      { $limit: 5 },
    ]);

    if (topDishes.length < 5) {
      const existingDishIds = topDishes
        .map((dish) => dish.dishId)
        .filter(Boolean);
      const fallbackDishes = await Dish.find({
        _id: { $nin: existingDishIds },
      })
        .populate("restaurantId", "name")
        .sort({ createdAt: -1 })
        .limit(5 - topDishes.length);

      fallbackDishes.forEach((dish) => {
        topDishes.push({
          dishId: dish._id,
          name: dish.name,
          restaurant: dish.restaurantId?.name || "",
          orders: 0,
          revenue: 0,
        });
      });
    }

    res.status(200).json(
      topDishes.map((dish) => ({
        name: dish.name,
        restaurant: dish.restaurant,
        orders: dish.orders,
        revenue: dish.revenue,
      })),
    );
  } catch (error) {
    console.error(SERVER_ERORR_MESSAGE.ORDER_TOP_DISHES_ERROR, error);
    res.status(500).json({
      message: SERVER_ERORR_MESSAGE.ORDER_TOP_DISHES_ERROR,
    });
  }
};

export const createSampleOrders = async (req, res) => {
  try {
    const user =
      (await User.findOne({ role: "user" })) || (await User.findOne());
    const restaurant = await Restaurant.findOne();
    let dishes = restaurant
      ? await Dish.find({ restaurantId: restaurant._id }).limit(5)
      : [];

    if (!dishes.length) {
      dishes = await Dish.find().limit(5);
    }

    if (!user || !restaurant || !dishes.length) {
      return res.status(400).json({
        message: SERVER_ERORR_MESSAGE.ORDER_SEED_ERROR,
      });
    }

    const couriers = [
      "Alex Carter",
      "Maria King",
      "Chris Evans",
      "Daniel Lee",
      "Sandra Fox",
    ];
    const paymentMethods = ["Cash", "Card", "Apple Pay"];
    const statuses = ["pending", "preparing", "delivering", "cancelled"];

    const selectedDishes = dishes.slice(0, Math.min(2, dishes.length));
    const items = selectedDishes.map((dish) => ({
      dishId: dish._id,
      quantity: Math.floor(Math.random() * 2) + 1,
      price: dish.price,
    }));

    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const deliveryTime =
      status === "delivered" ? Math.floor(Math.random() * 25) + 15 : null;

    const sampleOrder = await Order.create({
      orderNumber: await createOrderNumber(),
      userId: user._id,
      restaurantId: restaurant._id,
      items,
      totalPrice,
      deliveryTime,
      status,
      address: "123 Test Avenue, Apt 5",
      courier: couriers[Math.floor(Math.random() * couriers.length)],
      paymentMethod:
        paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    });

    res.status(201).json(sampleOrder);
  } catch (error) {
    console.error(SERVER_ERORR_MESSAGE.ORDER_CREATE_ERROR, error);
    res.status(500).json({
      message: SERVER_ERORR_MESSAGE.ORDER_CREATE_ERROR,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const idValidation = orderIdSchema.safeParse(req.params.id);
    if (!idValidation.success) {
      return res.status(400).json({
        message: SERVER_ERORR_MESSAGE.ORDER_NOT_FOUND,
        errors: idValidation.error.flatten(),
      });
    }

    const bodyValidation = orderStatusSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        message: SERVER_ERORR_MESSAGE.ORDER_STATUS_INVALID,
        errors: bodyValidation.error.flatten(),
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      idValidation.data,
      bodyValidation.data,
      { new: true, runValidators: true },
    )
      .populate("userId", "username fullName")
      .populate("restaurantId", "name");

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ message: SERVER_ERORR_MESSAGE.ORDER_NOT_FOUND });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(SERVER_ERORR_MESSAGE.ORDER_UPDATE_ERROR, error);
    res.status(500).json({
      message: SERVER_ERORR_MESSAGE.ORDER_UPDATE_ERROR,
    });
  }
};

export const createOrder = async (req, res) => {
  try {
    const validation = createOrderSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: SERVER_ERORR_MESSAGE.ORDER_INVALID_CART,
        errors: validation.error.flatten(),
      });
    }
    const orderInput = validation.data;

    const groups = new Map();
    for (const item of orderInput.items) {
      const dish = await Dish.findById(item.dishId).select("price restaurantId");
      if (!dish) {
        return res.status(400).json({
          message: SERVER_ERORR_MESSAGE.ORDER_INVALID_CART,
        });
      }

      const restaurantId = dish.restaurantId.toString();
      const group = groups.get(restaurantId) || {
        restaurantId: dish.restaurantId,
        items: [],
        totalPrice: 0,
      };
      group.items.push({
        dishId: dish._id,
        quantity: item.quantity,
        price: dish.price,
      });
      group.totalPrice += dish.price * item.quantity;
      groups.set(restaurantId, group);
    }

    const totalPrice = [...groups.values()].reduce(
      (sum, group) => sum + group.totalPrice,
      0,
    );
    const isCardPayment =
      orderInput.paymentMethod === "Credit / Debit Card";

    if (isCardPayment !== Boolean(orderInput.stripePaymentIntentId)) {
      return res.status(400).json({
        message: SERVER_ERORR_MESSAGE.STRIPE_INTENT_ERROR,
      });
    }

    let paymentStatus = "cash_on_delivery";
    let paymentCurrency = "usd";
    if (orderInput.stripePaymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        orderInput.stripePaymentIntentId,
      );
      const expectedPaymentAmount = Math.round(
        (totalPrice + DELIVERY_FEE) * 100,
      );
      if (
        paymentIntent.status !== "succeeded" ||
        paymentIntent.amount !== expectedPaymentAmount ||
        paymentIntent.currency !== "usd"
      ) {
        return res.status(400).json({
          message: SERVER_ERORR_MESSAGE.STRIPE_INTENT_ERROR,
        });
      }

      paymentStatus = "paid";
      paymentCurrency = paymentIntent.currency;
    }

    let userId = null;
    if (req.user) {
      const user = await User.findOne({ id: req.user.id }).select("_id");
      if (!user) {
        return res.status(401).json({
          message: SERVER_ERORR_MESSAGE.AUTH_TOKEN_FAILED_ERROR,
        });
      }
      userId = user._id;
    }

    const createdOrders = [];
    for (const group of groups.values()) {
      const orderData = {
        orderNumber: await createOrderNumber(),
        userId,
        customerName: orderInput.customerName,
        customerPhone: orderInput.customerPhone,
        customerEmail: orderInput.customerEmail,
        restaurantId: group.restaurantId,
        items: group.items,
        totalPrice: group.totalPrice,
        address: orderInput.address,
        notes: orderInput.notes,
        deliveryPreferences: orderInput.deliveryPreferences,
        paymentMethod: orderInput.paymentMethod,
        paymentStatus,
        stripePaymentIntentId: orderInput.stripePaymentIntentId,
        paymentCurrency,
        deliveryMethod: orderInput.deliveryMethod,
        status: "pending",
      };

      const newOrder = await Order.create(orderData);
      createdOrders.push(newOrder);
    }

    if (!createdOrders.length) {
      return res.status(400).json({
        message: SERVER_ERORR_MESSAGE.ORDER_INVALID_CART,
      });
    }

    res
      .status(201)
      .json({ message: "Order placed successfully", orders: createdOrders });
  } catch (error) {
    console.error(SERVER_ERORR_MESSAGE.ORDER_CREATE_ERROR, error);
    res.status(500).json({
      message: SERVER_ERORR_MESSAGE.ORDER_CREATE_ERROR,
    });
  }
};
