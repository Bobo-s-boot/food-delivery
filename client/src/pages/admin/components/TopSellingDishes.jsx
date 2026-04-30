import { AdminCard } from "./AdminCard";
import { SectionHeader } from "./SectionHeader";

export function TopSellingDishes({ dishes }) {
  return (
    <AdminCard className="p-5 md:p-6">
      <SectionHeader title="Top-Selling Dishes" />
      <div className="mt-5 space-y-3">
        {dishes.map((dish, index) => (
          <div
            key={dish.name}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl bg-[#F7F9FC] p-4"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0D1A2D] text-sm font-medium text-white">
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium">{dish.name}</p>
              <p className="text-sm text-[#7B8794]">{dish.orders}</p>
            </div>
            <strong className="font-medium">{dish.revenue}</strong>
          </div>
        ))}
      </div>
    </AdminCard>
  );
}
