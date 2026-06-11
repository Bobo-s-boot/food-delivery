import { AdminCard } from "./AdminCard";
import { SectionHeader } from "./SectionHeader";
import { StatusBadge } from "./StatusBadge";
import "../Admin.scss";

export function RestaurantStatus({ restaurants, onDelete }) {
  return (
    <AdminCard className="restaurant-status-admin">
      <SectionHeader
        title="Restaurant Status"
        description="Check which restaurants are open, busy, paused or need attention."
      />
      <div className="restaurant-status-admin__grid">
        {restaurants.map((restaurant) => (
          <article
            key={restaurant.id || restaurant.name}
            className="restaurant-card_adminStatus-admin"
          >
            <div className="restaurant-card_adminStatus-admin__header">
              <h3 className="restaurant-card_adminStatus-admin__name">
                {restaurant.name}
              </h3>
              <StatusBadge value={restaurant.status} />
            </div>

            <p className="restaurant-card_adminStatus-admin__orders">
              {restaurant.orders}
            </p>
            <p className="restaurant-card_adminStatus-admin__prep">
              {restaurant.prep}
            </p>

            <div className="restaurant-card_adminStatus-admin__footer">
              <span className="restaurant-card_adminStatus-admin__rating">
                Rating: {restaurant.rating}
              </span>
              <button
                className="restaurant-card_adminStatus-admin__btn"
                onClick={() => onDelete?.(restaurant.id)}
              >
                {restaurant.action}
              </button>
            </div>
          </article>
        ))}
      </div>
    </AdminCard>
  );
}
