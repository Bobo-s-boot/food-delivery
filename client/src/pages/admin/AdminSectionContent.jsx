import { lazy, Suspense } from "react";
import { AdminDashboardPage } from "./dashboard/AdminDashboardPage";
import { AdminFinancePage } from "./finance/AdminFinancePage";
import { LegacyDishesSection } from "./live/LegacyDishesSection";
import { AdminOrdersPage } from "./orders/AdminOrdersPage";
import { AdminRestaurantsPage } from "./restaurants/AdminRestaurantsPage";
import { AdminSupportPage } from "./support/AdminSupportPage";
import { AdminUsersPage } from "./users/AdminUsersPage";

const AdminHiringPage = lazy(() =>
  import("./hiring/AdminHiringPage").then((module) => ({ default: module.AdminHiringPage })),
);
const AdminPartnerships = lazy(() =>
  import("./partnerships/AdminPartnerships").then((module) => ({ default: module.AdminPartnerships })),
);

export function AdminSectionContent({ section, workspace }) {
  return (
    <>
      {section === "dashboard" && <AdminDashboardPage />}

      {section === "restaurants" && (
        <AdminRestaurantsPage
          restaurants={workspace.restaurantsRaw}
          dishes={workspace.dishesRaw}
          orders={workspace.orders}
          onCreateRestaurant={workspace.handleCreateRestaurant}
          onUpdateRestaurant={workspace.handleUpdateRestaurant}
          onDeleteRestaurant={workspace.handleDeleteRestaurant}
          workspace={workspace}
        />
      )}

      {section === "dishes" && (
        <LegacyDishesSection
          menuAvailabilityView={workspace.menuAvailability}
          workspace={workspace}
        />
      )}

      {section === "orders" && (
        <AdminOrdersPage
          orders={workspace.orders}
          onUpdateStatus={workspace.handleUpdateStatus}
        />
      )}

      {section === "users" && (
        <AdminUsersPage
          users={workspace.usersRaw}
          orders={workspace.orders}
        />
      )}
      {section === "finance" && <AdminFinancePage />}
      {section === "support" && <AdminSupportPage />}
      {section === "hiring" && (
        <Suspense fallback={<p role="status">Loading Hiring…</p>}>
          <AdminHiringPage />
        </Suspense>
      )}
      {section === "partnerships" && (
        <Suspense fallback={<p role="status">Loading Partnerships…</p>}>
          <AdminPartnerships />
        </Suspense>
      )}
    </>
  );
}
