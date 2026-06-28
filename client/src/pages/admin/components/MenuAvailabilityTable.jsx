import { AdminCard } from "./AdminCard";
import { AdminTable } from "./AdminTable";
import { SectionHeader } from "./SectionHeader";
import { StatusBadge } from "./StatusBadge";
import "../Admin.scss";
import { categorysStatistic } from "../const";

export function MenuAvailabilityTable({ items, onDelete, onEdit }) {
  return (
    <AdminCard className="menu-availability-card">
      <SectionHeader
        title="Menu Availability"
        description="Manage dishes that are available, low-stock or temporarily unavailable."
      />
      <div className="menu-availability__table-wrapper">
        <AdminTable
          columns={categorysStatistic}
          rows={items}
          renderRow={(row) => (
            <tr key={row.id || row.item} className="menu-availability-row">
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
                <div style={{ display: "flex", gap: "8px" }}>
                  {onEdit && (
                    <button
                      className="menu-availability-btn"
                      onClick={() => onEdit?.(row)}
                      style={{ backgroundColor: "var(--color-bg-brand)", color: "white" }}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="menu-availability-btn"
                    onClick={() => onDelete?.(row.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          )}
        />
      </div>
    </AdminCard>
  );
}
