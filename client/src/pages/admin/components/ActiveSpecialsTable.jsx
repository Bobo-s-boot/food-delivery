import { AdminCard } from "./AdminCard";
import { AdminTable } from "./AdminTable";
import { SectionHeader } from "./SectionHeader";
import { StatusBadge } from "./StatusBadge";
import "../Admin.scss";

export function ActiveSpecialsTable({ specials }) {
  return (
    <AdminCard className="active-specials-card">
      <SectionHeader
        title="Active Specials"
        description="Create and manage discounts, free delivery offers, student deals and limited-time promotions."
      />
      <div className="active-specials-table__wrapper">
        <AdminTable
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
            <tr key={row.promotion} className="active-specials-row">
              <td className="active-specials-row__cell active-specials-row__cell--first font-medium">
                {row.promotion}
              </td>
              <td className="active-specials-row__cell text-secondary">
                {row.type}
              </td>
              <td className="active-specials-row__cell text-secondary">
                {row.restaurant}
              </td>
              <td className="active-specials-row__cell text-secondary">
                {row.discount}
              </td>
              <td className="active-specials-row__cell">
                <StatusBadge value={row.status} />
              </td>
              <td className="active-specials-row__cell text-tertiary">
                {row.validUntil}
              </td>
              <td className="active-specials-row__cell active-specials-row__cell--last">
                <button className="active-specials-btn">Edit</button>
              </td>
            </tr>
          )}
        />
      </div>
    </AdminCard>
  );
}
