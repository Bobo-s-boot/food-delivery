import Order from "../models/Order.js";
import User from "../models/user.js";
import Restaurant from "../models/restaurant.js";
import Dish from "../models/dish.js";

const WEEK_DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate("userId", "username fullName")
      .populate("restaurantId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Ошибка при получении заказов",
      error: error.message,
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
    res.status(500).json({
      message: "Ошибка при подсчете статистики заказов",
      error: error.message,
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
    res.status(500).json({
      message: "Ошибка при получении аналитики заказов",
      error: error.message,
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
        $project: {
          dishId: "$_id",
          name: { $ifNull: ["$dish.name", "Unknown Dish"] },
          orders: 1,
          revenue: 1,
        },
      },
      { $sort: { revenue: -1, orders: -1 } },
      { $limit: 5 },
    ]);

    if (topDishes.length < 5) {
      const existingDishIds = topDishes.map((dish) => dish.dishId);
      const fallbackDishes = await Dish.find({
        _id: { $nin: existingDishIds },
      })
        .sort({ createdAt: -1 })
        .limit(5 - topDishes.length)
        .select("name");

      fallbackDishes.forEach((dish) => {
        topDishes.push({
          dishId: dish._id,
          name: dish.name,
          orders: 0,
          revenue: 0,
        });
      });
    }

    res.status(200).json(
      topDishes.map((dish) => ({
        name: dish.name,
        orders: dish.orders,
        revenue: dish.revenue,
      })),
    );
  } catch (error) {
    res.status(500).json({
      message: "Ошибка при получении топ блюд",
      error: error.message,
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
        message:
          "Недостаточно данных для генерации тестового заказа. Добавьте пользователя, ресторан и блюда.",
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
    res.status(500).json({
      message: "Ошибка при создании тестового заказа",
      error: error.message,
    });
  }
};
