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
  activeSpecials,
  adminNavItems,
  courierActivity,
  createActions,
  issues,
  kpiCards,
  liveOrders,
  menuAvailability,
  orderAnalytics,
  orderFilters,
  peakHours,
  restaurantStatus,
  revenueBreakdown,
  topDishes,
} from "./const";

export function Admin() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F4F7FB] px-4 py-4 font-['Inter'] text-[#0D1A2D] md:px-6">
      <div className="mx-auto flex w-full max-w-[1760px] flex-col gap-4">
        <AdminHeader navItems={adminNavItems} createActions={createActions} />

        <main className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[1.12fr_0.88fr]">
          <AdminIntro />
          <KpiGrid cards={kpiCards} />
          <OrderAnalytics data={orderAnalytics} />

          <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-1">
            <RevenueBreakdown data={revenueBreakdown} />
            <PeakHours labels={peakHours} />
          </div>

          <LiveOrdersTable orders={liveOrders} filters={orderFilters} />
          <CourierActivity couriers={courierActivity} />
          <RestaurantStatus restaurants={restaurantStatus} />
          <IssueCenter issues={issues} />
          <MenuAvailabilityTable items={menuAvailability} />
          <ActiveSpecialsTable specials={activeSpecials} />
          <TopSellingDishes dishes={topDishes} />
        </main>
      </div>
    </div>
  );
}
