import { ChevronRight, Clock3 } from "lucide-react";
import {
  AdminKpiCard,
  AdminKpiGrid,
} from "../../../components/ui/AdminKpiCard/AdminKpiCard";
import { StatusBadge } from "../../../components/StatusBadge";
import { WorkspaceSection } from "./WorkspaceSection";
import {
  formatRestaurantKpiMoney,
  formatRestaurantMoney,
} from "./workspace.formatters";

export function OverviewTab({ restaurant, orders, promotions, navigateToOrders, onTabChange }) {
  const attentionItems = [
    restaurant.issueStatus !== "No active issues" && {
      title: restaurant.issueStatus,
      action:
        restaurant.issueStatus.includes("menu") || restaurant.issueStatus.includes("availability")
          ? "Open menu"
          : "Review issue",
      tab: restaurant.issueStatus.includes("documents") ? "Settings" : "Menu",
    },
    restaurant.unavailableItems > 0 && {
      title: `${restaurant.unavailableItems} unavailable menu items`,
      action: "Open menu",
      tab: "Menu",
    },
    restaurant.operationalAvailability === "Temporarily paused" && {
      title: "Restaurant is temporarily paused",
      action: "Open operations",
      tab: "Operations",
    },
  ].filter(Boolean);
  const recentOrders = orders.slice(0, 4);
  const activePromotion = promotions.find((promotion) => promotion.status === "Active");

  return (
    <div className="restaurant-workspace-grid">
      <AdminKpiGrid className="restaurant-workspace-kpis">
        <AdminKpiCard
          label="Orders Today"
          value={String(restaurant.ordersToday)}
          helper="+6 vs yesterday"
          tone="success"
        />
        <AdminKpiCard
          label="Revenue Today"
          value={formatRestaurantKpiMoney(restaurant.revenueToday)}
          helper="+8.4%"
          tone="success"
        />
        <AdminKpiCard
          label="Active Menu Items"
          value={String(restaurant.activeItems)}
          helper={`${restaurant.activeItems} of ${restaurant.activeItems + restaurant.unavailableItems}`}
          tone="neutral"
        />
        <AdminKpiCard
          label="Unavailable Items"
          value={String(restaurant.unavailableItems)}
          helper={restaurant.unavailableItems ? "Needs review" : undefined}
          tone={restaurant.unavailableItems ? "warning" : "neutral"}
        />
      </AdminKpiGrid>

      <WorkspaceSection title="Current Operational State" className="restaurant-workspace-card--state">
        <div className="restaurant-state-summary">
          <div><span>Partnership</span><StatusBadge value={restaurant.partnershipStatus} /></div>
          <div><span>Order acceptance</span><StatusBadge value={restaurant.operationalAvailability} /></div>
          <div>
            <span>Menu visibility</span>
            <strong>
              {restaurant.operationalAvailability === "Accepting orders"
                ? "Published items visible"
                : "Ordering temporarily hidden"}
            </strong>
          </div>
        </div>
      </WorkspaceSection>

      <WorkspaceSection title="Needs Attention" className="restaurant-workspace-card--attention">
        {attentionItems.length ? (
          <div className="restaurant-attention-list">
            {attentionItems.map((item) => (
              <div key={item.title}>
                <StatusBadge value={item.title} />
                <button type="button" onClick={() => onTabChange(item.tab)}>
                  {item.action}<ChevronRight size={15} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="restaurants-empty restaurants-empty--compact">
            <strong>No items require attention</strong>
            <span>All menu content is currently complete.</span>
          </div>
        )}
      </WorkspaceSection>

      <WorkspaceSection
        title="Recent Orders"
        action={(
          <button type="button" className="restaurants-link-action" onClick={() => navigateToOrders()}>
            View all restaurant orders <ChevronRight size={15} />
          </button>
        )}
      >
        <div className="restaurant-recent-orders">
          {recentOrders.length ? recentOrders.map((order) => (
            <button
              type="button"
              className="restaurant-recent-orders__row"
              key={order.id}
              onClick={() => navigateToOrders(order.id)}
            >
              <strong>{order.id}</strong>
              <span>{order.customer.name}</span>
              <span>{formatRestaurantMoney(order.payment.total)}</span>
              <StatusBadge value={order.status} />
              <time>{order.placed}</time>
            </button>
          )) : (
            <div className="restaurants-empty restaurants-empty--compact">
              <strong>No recent orders</strong>
              <span>This restaurant has no matching orders in the current mock dataset.</span>
            </div>
          )}
        </div>
      </WorkspaceSection>

      <WorkspaceSection title="Recent Activity">
        <div className="restaurant-activity-list">
          {[
            ["Menu item price updated", "Today, 10:18 AM"],
            ["Availability changed", "Yesterday, 4:42 PM"],
            ["Menu image added", "Jun 24, 1:10 PM"],
          ].map(([event, time]) => (
            <div key={event}>
              <Clock3 size={16} />
              <span><strong>{event}</strong><small>{time}</small></span>
            </div>
          ))}
        </div>
      </WorkspaceSection>

      <WorkspaceSection
        title="Active Promotion"
        action={(
          <button type="button" className="restaurants-link-action" onClick={() => onTabChange("Promotions")}>
            Open promotions <ChevronRight size={15} />
          </button>
        )}
      >
        {activePromotion ? (
          <div className="restaurant-promotion-summary">
            <div><strong>{activePromotion.name}</strong><span>{activePromotion.value} · {activePromotion.funding}</span></div>
            <StatusBadge value={activePromotion.status} />
            <span>{activePromotion.usageToday} uses today</span>
            <strong>{activePromotion.costToday}</strong>
          </div>
        ) : (
          <div className="restaurants-empty restaurants-empty--compact">
            <strong>No active promotions</strong>
            <span>Create a promotion for this restaurant.</span>
          </div>
        )}
      </WorkspaceSection>
    </div>
  );
}
