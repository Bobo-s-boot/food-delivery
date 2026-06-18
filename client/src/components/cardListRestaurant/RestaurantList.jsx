import { useMemo } from "react";
import { RestaurantCard } from "./RestaurantCard";
import { Loading } from "../loading/Loading";
import "./RestaurantList.scss";
import { filterRestaurants } from "./utils/restaurantUtils";
import { useRestaurants } from "../../hooks/useRestaurants";

export function RestaurantList({ searchQuery = "", activeCategory = "All" }) {
  const { restaurants, isLoading } = useRestaurants();

  const filteredRestaurants = useMemo(
    () => filterRestaurants(restaurants, searchQuery, activeCategory),
    [restaurants, searchQuery, activeCategory],
  );

  if (isLoading) {
    return <Loading message={"restaurants"} />;
  }

  if (filteredRestaurants.length === 0) {
    return <div className="restaurant-list__empty">Nothing found 😔</div>;
  }

  return (
    <div className="restaurant-list">
      {filteredRestaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} data={restaurant} />
      ))}
    </div>
  );
}
