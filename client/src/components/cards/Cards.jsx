import { RestaurantList } from "../cardListRestaurant/RestaurantList";
import { Loading } from "../loading/Loading";
import "./Cards.scss";

export function Cards({
  title = "",
  description = "",
  restaurants = [],
  isLoading = false,
  emptyMessage = "",
  className = "",
}) {
  return (
    <section className={`cards ${className}`.trim()}>
      <div className="cards__header">
        <h2 className="cards__title">{title}</h2>
        <p className="cards__description">{description}</p>
      </div>

      {isLoading ? (
        <Loading message={"restaurants"} />
      ) : restaurants.length > 0 ? (
        <RestaurantList items={restaurants} />
      ) : (
        <p className="cards__empty">{emptyMessage}</p>
      )}
    </section>
  );
}
