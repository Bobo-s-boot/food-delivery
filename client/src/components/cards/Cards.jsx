import { RestaurantList } from "../cardListRestaurant/RestaurantList";
import { Loading } from "../loading/Loading";

export function Cards({
  title = "",
  description = "",
  restaurants = [],
  isLoading = false,
  emptyMessage = "",
  className = "",
}) {
  return (
    <section className={`w-full px-4 py-10 ${className}`.trim()}>
      <div className="flex flex-col gap-4 mb-8">
        <h2 className="text-3xl font-semibold text-gray-900">{title}</h2>
        <p className="text-gray-500 max-w-2xl">{description}</p>
      </div>

      {isLoading ? (
        <Loading message={"restaurants"} />
      ) : restaurants.length > 0 ? (
        <RestaurantList items={restaurants} />
      ) : (
        <p className="text-gray-500">{emptyMessage}</p>
      )}
    </section>
  );
}
