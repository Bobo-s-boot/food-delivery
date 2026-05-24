import { ProductCard } from "../../menu/ProductCard";

export function DishRecommendations({ dishes, restaurant }) {
  if (dishes.length === 0) {
    return null;
  }

  return (
    <section className="dish-recommendations">
      <div className="dish-recommendations__header">
        <div>
          <p className="dish-recommendations__eyebrow">Complete your order</p>
          <h2 className="dish-recommendations__title">More from {restaurant}</h2>
        </div>
        <p className="dish-recommendations__subtitle">
          Sides and drinks from the same restaurant, using the same card style
          as the menu.
        </p>
      </div>

      <div className="dish-recommendations__grid">
        {dishes.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
