import { ProductCard } from "../../menu/ProductCard";

export function SpecialsGrid({ t, deals }) {
  return (
    <section className="mt-16 grid w-full max-w-[1692px] grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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
