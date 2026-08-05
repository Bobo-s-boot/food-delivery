import { AdminDashboardPage } from "./dashboard/AdminDashboardPage";
import { AdminFinancePage } from "./finance/AdminFinancePage";
import { LegacyDishesSection } from "./live/LegacyDishesSection";
import { AdminLiveOrdersPage } from "./orders/AdminLiveOrdersPage";
import { AdminOrdersPage } from "./orders/AdminOrdersPage";
import { AdminRestaurantsPage } from "./restaurants/AdminRestaurantsPage";
import { AdminSupportPage } from "./support/AdminSupportPage";
import { AdminUsersPage } from "./users/AdminUsersPage";
import { AdminPlaceholderPage } from "./components/AdminPlaceholderPage";

const placeholderSections = {
  users: {
    title: "Users",
    description:
      "User management will be designed here during the admin refactor.",
  },
  support: {
    title: "Support",
    description:
      "Support queue and issue handling will be shaped in this section.",
  },
};

export function AdminSectionContent({ section, previewMode, workspace }) {
  const placeholder = placeholderSections[section];

  return (
    <>
      {section === "dashboard" && <AdminDashboardPage />}

      {/* 🔥 Добавили пропсы в AdminRestaurantsPage */}
      {section === "restaurants" && (
        <AdminRestaurantsPage
          restaurants={workspace.restaurantsRaw}
          dishes={workspace.dishesRaw}
          orders={workspace.orders}
          onCreateRestaurant={workspace.handleCreateRestaurant}
          onUpdateRestaurant={workspace.handleUpdateRestaurant}
          onDeleteRestaurant={workspace.handleDeleteRestaurant}
          previewMode={previewMode}
          workspace={workspace}
        />
      )}

      {section === "dishes" && (
        <LegacyDishesSection
          previewMode={previewMode}
          menuAvailabilityView={workspace.menuAvailability}
          workspace={workspace}
        />
      )}

      {section === "orders" && previewMode && <AdminOrdersPage />}
      {section === "orders" && !previewMode && (
        <AdminLiveOrdersPage
          orders={workspace.liveOrdersData}
          onUpdateStatus={workspace.handleUpdateStatus}
        />
      )}

      {section === "users" && previewMode && <AdminUsersPage />}
      {section === "finance" && <AdminFinancePage />}
      {section === "support" && (
        <AdminSupportPage previewMode={previewMode} />
      )}

      {placeholder &&
        !(section === "users" && previewMode) &&
        section !== "support" &&
        section !== "finance" && <AdminPlaceholderPage {...placeholder} />}
    </>
  );
}
