import { AdminCard } from "../../components/AdminCard";
import { SectionHeader } from "../../components/SectionHeader";

export function TopRestaurantsToday({ restaurants = [] }) {
  return (
    <AdminCard className="top-restaurants">
      <SectionHeader title="Top Restaurants Today" />

      <div className="top-restaurants__list">
        {restaurants.length === 0 ? (
          <p className="text-gray-400 text-sm py-4">No restaurant activity today</p>
        ) : (
          restaurants.map((restaurant, index) => (
            <div key={`${restaurant.name}-${index}`} className="top-restaurant-item">
              <span className="top-restaurant-item__rank">{index + 1}</span>
              <div className="top-restaurant-item__info">
                <p className="top-restaurant-item__name">{restaurant.name}</p>
                <p className="top-restaurant-item__orders">
                  {restaurant.orders}
                </p>
              </div>
              <strong className="top-restaurant-item__revenue">
                {restaurant.revenue}
              </strong>
            </div>
          ))
        )}
      </div>
    </AdminCard>
  );
}
