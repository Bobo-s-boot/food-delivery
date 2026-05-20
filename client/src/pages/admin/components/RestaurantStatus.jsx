import { AdminCard } from "./AdminCard";
import { SectionHeader } from "./SectionHeader";
import { StatusBadge } from "./StatusBadge";
import "../Admin.scss";

export function RestaurantStatus({ restaurants }) {
  return (
    <AdminCard className="restaurant-status">
      <SectionHeader
        title="Restaurant Status"
        description="Check which restaurants are open, busy, paused or need attention."
      />
      <div className="restaurant-status__grid">
        {restaurants.map((restaurant) => (
          <article key={restaurant.name} className="restaurant-card">
            <div className="restaurant-card__header">
              <h3 className="restaurant-card__name">{restaurant.name}</h3>
              <StatusBadge value={restaurant.status} />
            </div>

            <p className="restaurant-card__orders">{restaurant.orders}</p>
            <p className="restaurant-card__prep">{restaurant.prep}</p>

            <div className="restaurant-card__footer">
              <span className="restaurant-card__rating">
                Rating: {restaurant.rating}
              </span>
              <button className="restaurant-card__btn">
                {restaurant.action}
              </button>
            </div>
          </article>
        ))}
      </div>
    </AdminCard>
  );
}
