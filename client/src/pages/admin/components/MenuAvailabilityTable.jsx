import { AdminCard } from "./AdminCard";
import { AdminTable } from "./AdminTable";
import { SectionHeader } from "./SectionHeader";
import { StatusBadge } from "./StatusBadge";
import "../Admin.scss";

export function MenuAvailabilityTable({ items }) {
  return (
    <AdminCard className="menu-availability-card">
      <SectionHeader
        title="Menu Availability"
        description="Manage dishes that are available, low-stock or temporarily unavailable."
      />
      <div className="menu-availability__table-wrapper">
        <AdminTable
          columns={[
            "Item",
            "Restaurant",
            "Category",
            "Price",
            "Status",
            "Action",
          ]}
          rows={items}
          renderRow={(row) => (
            <tr key={row.item} className="menu-availability-row">
              <td className="menu-availability-row__cell menu-availability-row__cell--first font-medium">
                {row.item}
              </td>
              <td className="menu-availability-row__cell text-secondary">
                {row.restaurant}
              </td>
              <td className="menu-availability-row__cell text-tertiary">
                {row.category}
              </td>
              <td className="menu-availability-row__cell">{row.price}</td>
              <td className="menu-availability-row__cell">
                <StatusBadge value={row.status} />
              </td>
              <td className="menu-availability-row__cell menu-availability-row__cell--last">
                <button className="menu-availability-btn">{row.action}</button>
              </td>
            </tr>
          )}
        />
      </div>
    </AdminCard>
  );
}
