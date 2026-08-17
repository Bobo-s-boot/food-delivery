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
  activeDeliveries,
  dashboardMetrics,
  issueCenterItems,
  liveOrders,
  orderOverviewData,
  peakHoursData,
  revenueSnapshotData,
  topRestaurantsToday,
  topSellingDishes,
} from "./dashboard.data";
import "./DashboardPage.scss";

export function AdminDashboardPage() {
  return (
    <>
      <AdminIntro />
      <KpiGrid cards={dashboardMetrics} />

      <div className="admin-layout__analytics-grid">
        <OrderAnalytics data={orderOverviewData} title="Orders Overview" />
        <RevenueBreakdown data={revenueSnapshotData} title="Revenue Snapshot" />
        <PeakHours data={peakHoursData} />
        <TopRestaurantsToday restaurants={topRestaurantsToday} />
      </div>

      <LiveOrdersTable orders={liveOrders} compact maxRows={6} />
      <div className="admin-layout__operational-row">
        <CourierActivity couriers={activeDeliveries} />
        <IssueCenter issues={issueCenterItems} />
      </div>
      <TopSellingDishes dishes={topSellingDishes} />
    </>
  );
}
