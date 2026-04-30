import { AdminCard } from "./AdminCard";
import { SectionHeader } from "./SectionHeader";
import { StatusBadge } from "./StatusBadge";

export function CourierActivity({ couriers }) {
  return (
    <AdminCard className="p-5 md:p-6">
      <SectionHeader
        title="Courier Activity"
        description="Track courier availability, active deliveries and estimated arrival time."
      />
      <div className="mt-5 space-y-3">
        {couriers.map((courier) => (
          <div
            key={courier.courier}
            className="rounded-2xl bg-[#F7F9FC] p-4 transition hover:bg-[#EEF2F7]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium">{courier.courier}</p>
                <p className="truncate text-sm text-[#6B7788]">
                  {courier.order} - {courier.area}
                </p>
              </div>
              <StatusBadge value={courier.status} />
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-[#5E6A7A]">ETA {courier.eta}</span>
              <button className="rounded-full bg-[#0D1A2D] px-4 py-2 text-xs text-white">
                {courier.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminCard>
  );
}
