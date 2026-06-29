import { useMemo, useState } from "react";
import { AdminCard } from "./AdminCard";
import { AdminTable } from "./AdminTable";
import { SectionHeader } from "./SectionHeader";
import { StatusBadge } from "./StatusBadge";
import "../Admin.scss";
import { dashbordTabs } from "../const";

export function LiveOrdersTable({ orders, filters, onUpdateStatus }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredOrders = useMemo(() => {
    if (activeFilter === "All") {
      return orders;
    }
    return orders.filter((order) => order.status === activeFilter);
  }, [activeFilter, orders]);

  return (
    <AdminCard className="live-orders-card">
      <div className="live-orders__header">
        <SectionHeader
          title="Live Orders"
          description="Monitor new, preparing, ready and active delivery orders in real time."
        />

        <div className="live-orders__filters">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`live-orders__filter-btn ${
                activeFilter === filter ? "live-orders__filter-btn--active" : ""
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="live-orders__table-container">
        <AdminTable
          columns={dashbordTabs}
          rows={filteredOrders}
          renderRow={(order) => (
            <tr key={order.id} className="live-orders-row">
              <td className="live-orders-row__cell live-orders-row__cell--first font-medium text-primary">
                {order.id}
              </td>

              <td className="live-orders-row__cell text-secondary">
                {order.customer}
              </td>

              <td className="live-orders-row__cell text-secondary">
                {order.restaurant}
              </td>

              <td className="live-orders-row__cell">
                {onUpdateStatus ? (
                  <select
                    value={order.status}
                    onChange={(e) => onUpdateStatus?.(order.id, e.target.value)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "8px",
                      border: "1px solid var(--color-border-card)",
                      fontSize: "0.75rem",
                      backgroundColor: "var(--color-bg-soft)",
                      color: "var(--color-text-strong)",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    <option value="pending">pending</option>
                    <option value="preparing">preparing</option>
                    <option value="delivering">delivering</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                ) : (
                  <StatusBadge value={order.status} />
                )}
              </td>

              <td className="live-orders-row__cell text-tertiary">
                {order.payment}
              </td>

              <td className="live-orders-row__cell text-tertiary">
                {order.courier}
              </td>

              <td className="live-orders-row__cell font-medium">
                {order.total}
              </td>

              <td className="live-orders-row__cell text-quaternary">
                {order.time}
              </td>

              <td className="live-orders-row__cell live-orders-row__cell--last">
                <button className="live-orders-btn">View</button>
              </td>
            </tr>
          )}
        />
      </div>
    </AdminCard>
  );
}
