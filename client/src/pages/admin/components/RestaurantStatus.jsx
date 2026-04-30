import { AdminCard } from "./AdminCard";
import { SectionHeader } from "./SectionHeader";
import { StatusBadge } from "./StatusBadge";

export function RestaurantStatus({ restaurants }) {
  return (
    <AdminCard className="p-5 md:p-6">
      <SectionHeader
        title="Restaurant Status"
        description="Check which restaurants are open, busy, paused or need attention."
      />
      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
        {restaurants.map((restaurant) => (
          <article
            key={restaurant.name}
            className="rounded-2xl bg-[#F7F9FC] p-4 transition hover:bg-[#EEF2F7]"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-medium">{restaurant.name}</h3>
              <StatusBadge value={restaurant.status} />
            </div>
            <p className="mt-3 text-sm text-[#5E6A7A]">{restaurant.orders}</p>
            <p className="mt-1 text-sm text-[#7B8794]">{restaurant.prep}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-[#5E6A7A]">
                Rating: {restaurant.rating}
              </span>
              <button className="rounded-full bg-[#0D1A2D] px-4 py-2 text-xs text-white">
                {restaurant.action}
              </button>
            </div>
          </article>
        ))}
      </div>
    </AdminCard>
  );
}
