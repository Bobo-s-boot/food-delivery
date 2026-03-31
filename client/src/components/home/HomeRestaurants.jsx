import { RestaurantList } from "../cardListRestaurant/RestaurantList";

export function HomeRestaurants({ restaurants, isLoading }) {
  return (
    <section className="w-full px-4 py-10">
      <div className="flex flex-col gap-4 mb-8">
        <h2 className="text-3xl font-semibold text-gray-900">
          Popular Restaurants
        </h2>
        <p className="text-gray-500 max-w-2xl">
          Browse the freshest restaurant options available in your area and find
          the perfect meal for any mood.
        </p>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading restaurants...</p>
      ) : restaurants.length > 0 ? (
        <RestaurantList items={restaurants} />
      ) : (
        <p className="text-gray-500">
          No restaurants available right now. Please try again later.
        </p>
      )}
    </section>
  );
}
