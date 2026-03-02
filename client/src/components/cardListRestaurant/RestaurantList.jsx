import { RestaurantCard } from "./RestaurantCard";

export function RestaurantList({ items }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((restaurant) => (
        <RestaurantCard key={restaurant.id} data={restaurant} />
      ))}
    </div>
  );
}
