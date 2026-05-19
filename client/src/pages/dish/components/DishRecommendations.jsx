import { ProductCard } from "../../menu/ProductCard";

export function DishRecommendations({ dishes, restaurant }) {
  if (dishes.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8A96A8]">
            Complete your order
          </p>
          <h2 className="mt-2 text-[40px] font-medium leading-none tracking-[-0.04em] text-[#071426]">
            More from {restaurant}
          </h2>
        </div>
        <p className="max-w-120 text-base leading-[150%] text-[#6B7890]">
          Sides and drinks from the same restaurant, using the same card style
          as the menu.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {dishes.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
