import { ProductCard } from "../../menu/ProductCard";

export function SpecialsGrid({ t, deals }) {
  return (
    <section className="specials-grid">
      {deals.map((deal) => (
        <ProductCard
          key={deal.id}
          item={{
            ...deal,
            title: t(deal.titleKey),
            description: t(deal.descriptionKey),
            category: t(deal.categoryKey),
            restaurant: t(deal.restaurantKey),
          }}
        />
      ))}
    </section>
  );
}
