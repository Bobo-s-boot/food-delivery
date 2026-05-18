import { useState, useEffect } from "react";
import { ActiveSpecialsTable } from "./components/ActiveSpecialsTable";
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
import {
  adminGetRestaurants,
  adminDeleteRestaurant,
} from "../../api/restaurantService";
import {
  adminGetOrders,
  adminGetOrderStats,
  adminGetOrderAnalytics,
  adminGetTopDishes,
  adminSeedOrders,
} from "../../api/orderService";
import {
  adminNavItems,
  courierActivity,
  createActions,
  issues,
  kpiCards,
  orderFilters,
  topDishes as topDishesFallback,
} from "./const";

export function Admin() {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [kpiData, setKpiData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    orderAnalytics: [],
    revenueBreakdown: [],
    peakHours: [],
  });
  const [topDishes, setTopDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatOrderTime = (createdAt) => {
    const createdTime = new Date(createdAt).getTime();
    const diffMinutes = Math.floor((Date.now() - createdTime) / 60000);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    const hours = Math.floor(diffMinutes / 60);
    return `${hours}h ago`;
  };

  const loadAdminData = async () => {
    try {
      const [restaurantsData, ordersData, statsData, analytics, topDishesData] =
        await Promise.all([
          adminGetRestaurants(),
          adminGetOrders(),
          adminGetOrderStats(),
          adminGetOrderAnalytics(),
          adminGetTopDishes(),
        ]);

      setRestaurants(restaurantsData);
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
    } catch (error) {
      console.error("Error loading admin data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

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

      setRestaurants((prev) => prev.filter((rest) => rest._id !== id));
    } catch (error) {
      alert("Ошибка при удалении. Проверьте права доступа.", error);
    }
  };

  if (isLoading)
    return <div className="p-6 text-center">Загрузка панели управления...</div>;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F4F7FB] px-4 py-4 font-['Inter'] text-[#0D1A2D] md:px-6">
      <div className="mx-auto flex w-full max-w-440 flex-col gap-4">
        <div className="space-y-4">
          <AdminHeader navItems={adminNavItems} createActions={createActions} />
          <div className="flex justify-end">
            <button
              onClick={handleGenerateOrders}
              className="inline-flex items-center justify-center rounded-full bg-[#0D1A2D] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#162635]"
            >
              Создать тестовый заказ
            </button>
          </div>
        </div>

        <main className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[1.12fr_0.88fr]">
          <AdminIntro />
          <KpiGrid cards={kpiData.length ? kpiData : kpiCards} />
          <OrderAnalytics data={analyticsData.orderAnalytics} />

          <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-1">
            <RevenueBreakdown data={analyticsData.revenueBreakdown} />
            <PeakHours data={analyticsData.peakHours} />
          </div>

          <LiveOrdersTable orders={liveOrdersData} filters={orderFilters} />
          <CourierActivity couriers={courierActivity} />

          <RestaurantStatus restaurants={restaurants} onDelete={handleDelete} />

          <IssueCenter issues={issues} />
          <TopSellingDishes
            dishes={topDishes.length ? topDishes : topDishesFallback}
          />
          {/* ... остальные компоненты ... */}
        </main>
      </div>
    </div>
  );
}
