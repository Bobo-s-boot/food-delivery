import { useEffect, useState } from "react";
import { LiveOrdersTable } from "../components/LiveOrdersTable";
import { AdminIntro } from "./components/AdminIntro";
import { CourierActivity } from "./components/CourierActivity";
import { IssueCenter } from "./components/IssueCenter";
import { KpiGrid } from "./components/KpiGrid";
import { OrderAnalytics } from "./components/OrderAnalytics";
import { PeakHours } from "./components/PeakHours";
import { RevenueBreakdown } from "./components/RevenueBreakdown";
import { TopRestaurantsToday } from "./components/TopRestaurantsToday";
import { TopSellingDishes } from "./components/TopSellingDishes";
import {
  adminGetOrderAnalytics,
  adminGetOrders,
  adminGetOrderStats,
  adminGetTopDishes,
  adminGetTopRestaurants,
} from "../../../api/orderService";
import {
  activeDeliveries,
  dashboardMetrics,
  issueCenterItems,
  liveOrders as mockLiveOrders,
  orderOverviewData,
  peakHoursData,
  revenueSnapshotData,
  topRestaurantsToday as mockTopRestaurants,
  topSellingDishes as mockTopDishes,
} from "./dashboard.data";
import "./DashboardPage.scss";

export function AdminDashboardPage() {
  const [topRestaurants, setTopRestaurants] = useState(mockTopRestaurants);
  const [topDishes, setTopDishes] = useState(mockTopDishes);
  const [kpiCards, setKpiCards] = useState(dashboardMetrics);
  const [analytics, setAnalytics] = useState({
    orderAnalytics: orderOverviewData,
    revenueBreakdown: revenueSnapshotData,
    peakHours: peakHoursData,
  });
  const [orders, setOrders] = useState(mockLiveOrders);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const [
          topRestaurantsData,
          topDishesData,
          statsData,
          analyticsData,
          ordersData,
        ] = await Promise.allSettled([
          adminGetTopRestaurants(),
          adminGetTopDishes(),
          adminGetOrderStats(),
          adminGetOrderAnalytics(),
          adminGetOrders(),
        ]);

        if (!isMounted) return;

        if (
          topRestaurantsData.status === "fulfilled" &&
          Array.isArray(topRestaurantsData.value) &&
          topRestaurantsData.value.length > 0
        ) {
          setTopRestaurants(topRestaurantsData.value);
        }

        if (
          topDishesData.status === "fulfilled" &&
          Array.isArray(topDishesData.value) &&
          topDishesData.value.length > 0
        ) {
          setTopDishes(topDishesData.value);
        }

        if (
          statsData.status === "fulfilled" &&
          statsData.value?.kpiCards?.length
        ) {
          setKpiCards(statsData.value.kpiCards);
        }

        if (analyticsData.status === "fulfilled" && analyticsData.value) {
          setAnalytics((prev) => ({
            orderAnalytics:
              analyticsData.value.orderAnalytics || prev.orderAnalytics,
            revenueBreakdown:
              analyticsData.value.revenueBreakdown || prev.revenueBreakdown,
            peakHours: analyticsData.value.peakHours || prev.peakHours,
          }));
        }

        if (
          ordersData.status === "fulfilled" &&
          Array.isArray(ordersData.value) &&
          ordersData.value.length > 0
        ) {
          setOrders(ordersData.value);
        }
      } catch (error) {
        console.error("Error loading dashboard data from DB:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <AdminIntro />
      <KpiGrid cards={kpiCards} />

      <div className="admin-layout__analytics-grid">
        <OrderAnalytics
          data={analytics.orderAnalytics}
          title="Orders Overview"
        />
        <RevenueBreakdown
          data={analytics.revenueBreakdown}
          title="Revenue Snapshot"
        />
        <PeakHours data={analytics.peakHours} />
        <TopRestaurantsToday restaurants={topRestaurants} />
      </div>

      <LiveOrdersTable orders={orders} compact maxRows={6} />
      <div className="admin-layout__operational-row">
        <CourierActivity couriers={activeDeliveries} />
        <IssueCenter issues={issueCenterItems} />
      </div>
      <TopSellingDishes dishes={topDishes} />
    </>
  );
}
