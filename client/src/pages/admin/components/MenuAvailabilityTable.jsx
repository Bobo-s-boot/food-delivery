import { AdminCard } from "./AdminCard";
import { AdminTable } from "./AdminTable";
import { SectionHeader } from "./SectionHeader";
import { StatusBadge } from "./StatusBadge";

export function MenuAvailabilityTable({ items }) {
  return (
    <AdminCard className="p-5 md:p-6">
      <SectionHeader
        title="Menu Availability"
        description="Manage dishes that are available, low-stock or temporarily unavailable."
      />
      <AdminTable
        columns={["Item", "Restaurant", "Category", "Price", "Status", "Action"]}
        rows={items}
        renderRow={(row) => (
          <tr
            key={row.item}
            className="bg-[#F7F9FC] transition hover:bg-[#EEF2F7]"
          >
            <td className="rounded-l-2xl px-3 py-3 font-medium">{row.item}</td>
            <td className="px-3 py-3 text-[#5E6A7A]">{row.restaurant}</td>
            <td className="px-3 py-3 text-[#7B8794]">{row.category}</td>
            <td className="px-3 py-3">{row.price}</td>
            <td className="px-3 py-3">
              <StatusBadge value={row.status} />
            </td>
            <td className="rounded-r-2xl px-3 py-3">
              <button className="rounded-full bg-[#EEF2F7] px-4 py-2 text-xs text-[#0D1A2D]">
                {row.action}
              </button>
            </td>
          </tr>
        )}
      />
    </AdminCard>
  );
}
