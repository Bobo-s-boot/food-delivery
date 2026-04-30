import { AdminCard } from "./AdminCard";
import { AdminTable } from "./AdminTable";
import { SectionHeader } from "./SectionHeader";
import { StatusBadge } from "./StatusBadge";

export function ActiveSpecialsTable({ specials }) {
  return (
    <AdminCard className="p-5 md:p-6">
      <SectionHeader
        title="Active Specials"
        description="Create and manage discounts, free delivery offers, student deals and limited-time promotions."
      />
      <AdminTable
        minWidth="min-w-200"
        columns={[
          "Promotion",
          "Type",
          "Restaurant",
          "Discount",
          "Status",
          "Valid until",
          "Action",
        ]}
        rows={specials}
        renderRow={(row) => (
          <tr
            key={row.promotion}
            className="bg-[#F7F9FC] transition hover:bg-[#EEF2F7]"
          >
            <td className="rounded-l-2xl px-3 py-3 font-medium">
              {row.promotion}
            </td>
            <td className="px-3 py-3 text-[#5E6A7A]">{row.type}</td>
            <td className="px-3 py-3 text-[#5E6A7A]">{row.restaurant}</td>
            <td className="px-3 py-3 text-[#5E6A7A]">{row.discount}</td>
            <td className="px-3 py-3">
              <StatusBadge value={row.status} />
            </td>
            <td className="px-3 py-3 text-[#7B8794]">{row.validUntil}</td>
            <td className="rounded-r-2xl px-3 py-3">
              <button className="rounded-full bg-[#EEF2F7] px-4 py-2 text-xs text-[#0D1A2D]">
                Edit
              </button>
            </td>
          </tr>
        )}
      />
    </AdminCard>
  );
}
