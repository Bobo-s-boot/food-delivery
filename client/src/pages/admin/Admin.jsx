import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AdminHeader } from "./components/AdminHeader";
import { AdminIntro } from "./components/AdminIntro";
import { CourierActivity } from "./components/CourierActivity";
import { IssueCenter } from "./components/IssueCenter";
import { KpiGrid } from "./components/KpiGrid";
import { LiveOrdersTable } from "./components/LiveOrdersTable";
import { MenuAvailabilityTable } from "./components/MenuAvailabilityTable";
import { OrderAnalytics } from "./components/OrderAnalytics";
import { PeakHours } from "./components/PeakHours";
import { RestaurantStatus } from "./components/RestaurantStatus";
import { RevenueBreakdown } from "./components/RevenueBreakdown";
import { TopSellingDishes } from "./components/TopSellingDishes";
import { adminGetDishes, deleteDish } from "../../api/dishService";
import {
  adminGetRestaurants,
  adminDeleteRestaurant,
} from "../../api/restaurantService";
import { isTokenActive } from "../../api/authService";
import {
  adminGetOrders,
  adminGetOrderStats,
  adminGetOrderAnalytics,
  adminGetTopDishes,
  adminSeedOrders,
} from "../../api/orderService";
import { adminNavItems, createActions, kpiCards, orderFilters } from "./const";
import "./Admin.scss";

const ANALYTICS_PERIODS = ["Today", "7 Days", "30 Days", "Month"];

const startOfLocalDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addLocalDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const toDateKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

const formatDayLabel = (date, period) => {
  if (period === "Today") {
    return `${String(date.getHours()).padStart(2, "0")}:00`;
  }

  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const monthDay = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  if (period === "7 Days") {
    return `${weekday} ${monthDay}`;
  }

  return monthDay;
};

const buildAnalyticsSeries = (ordersData, period) => {
  const now = new Date();
  const todayStart = startOfLocalDay(now);
  let rangeStart = todayStart;

  if (period === "7 Days") {
    rangeStart = addLocalDays(todayStart, -6);
  } else if (period === "30 Days") {
    rangeStart = addLocalDays(todayStart, -29);
  } else if (period === "Month") {
    rangeStart = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  const buckets = [];

  if (period === "Today") {
    for (let hour = 0; hour < 24; hour += 1) {
      buckets.push({
        key: hour,
        label: `${String(hour).padStart(2, "0")}:00`,
        orders: 0,
        revenue: 0,
        cancelled: 0,
      });
    }
  } else {
    for (
      let currentDate = new Date(rangeStart);
      currentDate <= now;
      currentDate = addLocalDays(currentDate, 1)
    ) {
      buckets.push({
        key: toDateKey(currentDate),
        label: formatDayLabel(currentDate, period),
        orders: 0,
        revenue: 0,
        cancelled: 0,
      });
    }
  }

  const bucketMap = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  ordersData.forEach((order) => {
    const createdAt = new Date(order.createdAt);
    if (Number.isNaN(createdAt.getTime())) {
      return;
    }

    if (createdAt < rangeStart || createdAt > now) {
      return;
    }

    const key =
      period === "Today"
        ? createdAt.getHours()
        : toDateKey(startOfLocalDay(createdAt));
    const bucket = bucketMap.get(key);

    if (!bucket) {
      return;
    }

    bucket.orders += 1;
    bucket.revenue += Number(order.totalPrice || 0);
    if (order.status === "cancelled") {
      bucket.cancelled += 1;
    }
  });

  const totalRevenue = buckets.reduce((sum, bucket) => sum + bucket.revenue, 0);

  return {
    orderAnalytics: buckets.map((bucket) => ({
      label: bucket.label,
      orders: bucket.orders,
      revenue: bucket.revenue,
      cancelled: bucket.cancelled,
    })),
    revenueBreakdown: buckets.map((bucket) => ({
      label: bucket.label,
      value: totalRevenue
        ? Math.round((bucket.revenue / totalRevenue) * 100)
        : 0,
      revenue: bucket.revenue,
    })),
  };
};

const formatOrderTime = (createdAt) => {
  const createdTime = new Date(createdAt).getTime();
  const diffMinutes = Math.floor((Date.now() - createdTime) / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  const hours = Math.floor(diffMinutes / 60);
  return `${hours}h ago`;
};

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

const buildRestaurantStatus = (restaurantsData, ordersData) => {
  const orderGroups = ordersData.reduce((groups, order) => {
    const restaurantKey = order.restaurantId?._id || order.restaurantId;
    if (!restaurantKey) {
      return groups;
    }

    const current = groups.get(restaurantKey) || {
      orders: 0,
      deliveredCount: 0,
      totalDeliveryTime: 0,
    };

    current.orders += 1;
    if (order.status === "delivered" && Number.isFinite(order.deliveryTime)) {
      current.deliveredCount += 1;
      current.totalDeliveryTime += order.deliveryTime;
    }

    groups.set(restaurantKey, current);
    return groups;
  }, new Map());

  return restaurantsData.map((restaurant) => {
    const metrics = orderGroups.get(restaurant._id) || {
      orders: 0,
      deliveredCount: 0,
      totalDeliveryTime: 0,
    };
    const averageDeliveryTime = metrics.deliveredCount
      ? Math.round(metrics.totalDeliveryTime / metrics.deliveredCount)
      : null;
    const status =
      metrics.orders >= 10 ? "Busy" : metrics.orders > 0 ? "Open" : "Paused";

    return {
      id: restaurant._id,
      name: restaurant.name,
      status,
      orders: `${metrics.orders} orders today`,
      prep: averageDeliveryTime
        ? `Avg prep time: ${averageDeliveryTime} min`
        : "Avg prep time: not enough delivery data",
      rating: restaurant.rating || "No rating",
      action: "Delete",
    };
  });
};

const buildMenuAvailability = (dishesData) =>
  dishesData.map((dish) => ({
    id: dish._id,
    item: dish.name,
    restaurant: dish.restaurantId?.name || "Unknown restaurant",
    category: dish.category || "Unspecified",
    price: formatCurrency(dish.price),
    status: "Available",
    action: "Delete",
  }));

const buildCourierActivity = (ordersData) => {
  const courierGroups = new Map();

  ordersData.forEach((order) => {
    const courier = order.courier || "Not assigned";
    const current = courierGroups.get(courier) || [];
    current.push(order);
    courierGroups.set(courier, current);
  });

  return Array.from(courierGroups.entries())
    .sort(
      ([, leftOrders], [, rightOrders]) =>
        rightOrders.length - leftOrders.length,
    )
    .slice(0, 5)
    .map(([courier, courierOrders]) => {
      const latestOrder = courierOrders[0];
      const orderId = latestOrder?._id
        ? `#${String(latestOrder._id).slice(-6).toUpperCase()}`
        : "-";
      const area =
        latestOrder?.address?.split(",")[0] ||
        latestOrder?.restaurantId?.name ||
        "-";
      const statusMap = {
        pending: "Waiting pickup",
        preparing: "Waiting pickup",
        delivering: "On delivery",
        delivered: "Available",
        cancelled: "Offline",
      };
      const status =
        statusMap[latestOrder?.status] ||
        (courier === "Not assigned" ? "Available" : "On delivery");
      const eta = latestOrder?.deliveryTime
        ? `${latestOrder.deliveryTime} min`
        : "-";

      return {
        courier,
        status,
        order: orderId,
        area,
        eta,
        action: courier === "Not assigned" ? "Assign" : "Track",
      };
    });
};

const buildIssues = (statsData, restaurantStatusData, courierDataSet) => {
  const issuesList = [];

  if ((statsData.pendingIssues || 0) > 0) {
    issuesList.push({
      title: "Pending orders",
      text: `${statsData.pendingIssues} orders still need review or dispatch.`,
      action: "Review orders",
    });
  }

  const pausedRestaurants = restaurantStatusData.filter(
    (restaurant) => restaurant.status === "Paused",
  );
  if (pausedRestaurants.length > 0) {
    issuesList.push({
      title: "Inactive restaurants",
      text: `${pausedRestaurants.length} restaurants have no recent orders and may need attention.`,
      action: "Check restaurants",
    });
  }

  const unassignedCourier = courierDataSet.find(
    (courier) => courier.courier === "Not assigned",
  );
  if (unassignedCourier) {
    issuesList.push({
      title: "Unassigned delivery",
      text: `${unassignedCourier.order} is still waiting for courier assignment.`,
      action: "Assign courier",
    });
  }

  return issuesList;
};

export function Admin() {
  const [orders, setOrders] = useState([]);
  const [kpiData, setKpiData] = useState([]);
  const [selectedAnalyticsPeriod, setSelectedAnalyticsPeriod] =
    useState("7 Days");
  const [analyticsData, setAnalyticsData] = useState({
    orderAnalytics: [],
    revenueBreakdown: [],
    peakHours: [],
  });
  const [topDishes, setTopDishes] = useState([]);
  const [restaurantStatus, setRestaurantStatus] = useState([]);
  const [menuAvailability, setMenuAvailability] = useState([]);
  const [courierData, setCourierData] = useState([]);
  const [issuesData, setIssuesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const analyticsViewData = useMemo(
    () => buildAnalyticsSeries(orders, selectedAnalyticsPeriod),
    [orders, selectedAnalyticsPeriod],
  );

  const loadAdminData = useCallback(async () => {
    try {
      const [
        restaurantsData,
        ordersData,
        statsData,
        analytics,
        topDishesData,
        dishesData,
      ] = await Promise.all([
        adminGetRestaurants(),
        adminGetOrders(),
        adminGetOrderStats(),
        adminGetOrderAnalytics(),
        adminGetTopDishes(),
        adminGetDishes(),
      ]);

      setOrders(ordersData);
      setKpiData(
        statsData.kpiCards || [
          {
            label: "Today's Orders",
            value: String(statsData.totalOrders || 0),
            trend: "+0% from yesterday",
          },
          {
            label: "Revenue",
            value: `$${(statsData.totalRevenue ?? 0).toFixed(2)}`,
            trend: "+0% this week",
          },
          {
            label: "Active Restaurants",
            value: String(statsData.activeRestaurants || 0),
            trend: "0 new this month",
          },
          {
            label: "Average Delivery Time",
            value: `${statsData.averageDeliveryTime ?? 0} min`,
            trend: "-0 min improvement",
          },
          {
            label: "Pending Issues",
            value: String(statsData.pendingIssues || 0),
            trend: "Needs attention",
            tone: "warning",
          },
        ],
      );

      setAnalyticsData(analytics);
      setTopDishes(topDishesData || []);
      const restaurantStatusData = buildRestaurantStatus(
        restaurantsData,
        ordersData,
      );
      const menuAvailabilityData = buildMenuAvailability(dishesData);
      const courierActivityData = buildCourierActivity(ordersData);

      setRestaurantStatus(restaurantStatusData);
      setMenuAvailability(menuAvailabilityData);
      setCourierData(courierActivityData);
      setIssuesData(
        buildIssues(statsData, restaurantStatusData, courierActivityData),
      );
    } catch (error) {
      console.error("Error loading admin data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isTokenActive()) {
      localStorage.removeItem("user");
      navigate("/auth", { replace: true });
      return;
    }

    loadAdminData();
  }, [navigate, loadAdminData]);

  const liveOrdersData = orders.map((order) => ({
    id: order._id || order.id,
    customer:
      order.userId?.fullName || order.userId?.username || "Unknown customer",
    restaurant: order.restaurantId?.name || "Unknown restaurant",
    status: order.status,
    payment: order.paymentMethod || "Paid",
    courier: order.courier || "Not assigned",
    total: `$${order.totalPrice?.toFixed(2) || "0.00"}`,
    time: formatOrderTime(order.createdAt),
  }));

  const handleGenerateOrders = async () => {
    try {
      setIsLoading(true);
      await adminSeedOrders();
      await loadAdminData();
    } catch (error) {
      const serverMessage =
        error.response?.data?.message || error.message || "Неизвестная ошибка";
      console.error("Error creating sample orders", error);
      alert(`Не удалось создать тестовый заказ: ${serverMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить этот ресторан и всё его меню?")) return;
    try {
      await adminDeleteRestaurant(id);
      await loadAdminData();
    } catch (error) {
      alert("Ошибка при удалении. Проверьте права доступа.", error);
    }
  };

  const handleDeleteDish = async (id) => {
    if (!window.confirm("Удалить это блюдо из меню?")) return;
    try {
      await deleteDish(id);
      await loadAdminData();
    } catch (error) {
      alert("Ошибка при удалении блюда. Проверьте права доступа.", error);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-layout__loading">Загрузка панели управления...</div>
    );
  }

  return (
    <div className="admin-layout">
      <div className="admin-layout__container">
        <div className="admin-layout__header-group">
          <AdminHeader navItems={adminNavItems} createActions={createActions} />
          <div className="admin-layout__actions">
            <button
              onClick={handleGenerateOrders}
              className="admin-layout__btn-generate"
            >
              Создать тестовый заказ
            </button>
          </div>
        </div>

        <main className="admin-layout__main-grid">
          <AdminIntro />
          <KpiGrid cards={kpiData.length ? kpiData : kpiCards} />
          <OrderAnalytics
            data={analyticsViewData.orderAnalytics}
            activePeriod={selectedAnalyticsPeriod}
            onPeriodChange={setSelectedAnalyticsPeriod}
            periods={ANALYTICS_PERIODS}
          />

          <div className="admin-layout__sub-grid">
            <RevenueBreakdown
              data={analyticsViewData.revenueBreakdown}
              activePeriod={selectedAnalyticsPeriod}
              onPeriodChange={setSelectedAnalyticsPeriod}
              periods={ANALYTICS_PERIODS}
            />
            <PeakHours data={analyticsData.peakHours} />
          </div>

          <LiveOrdersTable orders={liveOrdersData} filters={orderFilters} />
          <CourierActivity couriers={courierData} />

          <RestaurantStatus
            restaurants={restaurantStatus}
            onDelete={handleDelete}
          />

          <MenuAvailabilityTable
            items={menuAvailability.length ? menuAvailability : []}
            onDelete={handleDeleteDish}
          />

          <IssueCenter issues={issuesData} />
          <TopSellingDishes dishes={topDishes} />
        </main>
      </div>
    </div>
  );
}
