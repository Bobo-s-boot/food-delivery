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
  liveOrders as fallbackLiveOrders,
  orderOverviewData as fallbackOrderOverview,
  peakHoursData as fallbackPeakHours,
  revenueSnapshotData as fallbackRevenueSnapshot,
  topRestaurantsToday as fallbackTopRestaurants,
  topSellingDishes as fallbackTopDishes,
} from "./dashboard.data";
import "./DashboardPage.scss";

export function AdminDashboardPage() {
  const [topRestaurants, setTopRestaurants] = useState(fallbackTopRestaurants);
  const [topDishes, setTopDishes] = useState(fallbackTopDishes);
  const [kpiCards, setKpiCards] = useState(dashboardMetrics);
  const [orderOverview, setOrderOverview] = useState(fallbackOrderOverview);
  const [revenueSnapshot, setRevenueSnapshot] = useState(
    fallbackRevenueSnapshot,
  );
  const [peakHours, setPeakHours] = useState(fallbackPeakHours);
  const [liveOrders, setLiveOrders] = useState(fallbackLiveOrders);

  useEffect(() => {
    let isActive = true;

    Promise.allSettled([
      adminGetTopRestaurants(),
      adminGetTopDishes(),
      adminGetOrderStats(),
      adminGetOrderAnalytics(),
      adminGetOrders(),
    ]).then(([resRestaurants, resDishes, resStats, resAnalytics, resOrders]) => {
      if (!isActive) return;

      if (
        resRestaurants.status === "fulfilled" &&
        Array.isArray(resRestaurants.value) &&
        resRestaurants.value.length > 0
      ) {
        setTopRestaurants(resRestaurants.value);
      }

      if (
        resDishes.status === "fulfilled" &&
        Array.isArray(resDishes.value) &&
        resDishes.value.length > 0
      ) {
        setTopDishes(resDishes.value);
      }

      if (
        resStats.status === "fulfilled" &&
        resStats.value?.kpiCards?.length
      ) {
        setKpiCards(resStats.value.kpiCards);
      }

      if (resAnalytics.status === "fulfilled" && resAnalytics.value) {
        if (resAnalytics.value.orderAnalytics?.length) {
          setOrderOverview(resAnalytics.value.orderAnalytics);
        }
        if (resAnalytics.value.revenueBreakdown?.length) {
          setRevenueSnapshot(resAnalytics.value.revenueBreakdown);
        }
        if (resAnalytics.value.peakHours?.length) {
          setPeakHours(resAnalytics.value.peakHours);
        }
      }

      if (
        resOrders.status === "fulfilled" &&
        Array.isArray(resOrders.value) &&
        resOrders.value.length > 0
      ) {
        setLiveOrders(resOrders.value);
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <>
      <AdminIntro />
      <KpiGrid cards={kpiCards} />

      <div className="admin-layout__analytics-grid">
        <OrderAnalytics data={orderOverview} title="Orders Overview" />
        <RevenueBreakdown data={revenueSnapshot} title="Revenue Snapshot" />
        <PeakHours data={peakHours} />
        <TopRestaurantsToday restaurants={topRestaurants} />
      </div>

      <LiveOrdersTable orders={liveOrders} compact maxRows={6} />
      <div className="admin-layout__operational-row">
        <CourierActivity couriers={activeDeliveries} />
        <IssueCenter issues={issueCenterItems} />
      </div>
      <TopSellingDishes dishes={topDishes} />
    </>
  );
}

