import { useMemo, useState } from "react";
import { AdminCard } from "./AdminCard";
import { AdminTable } from "./AdminTable";
import { SectionHeader } from "./SectionHeader";
import { StatusBadge } from "./StatusBadge";
import { AdminSelect } from "./ui/AdminSelect/AdminSelect";
import "../Admin.scss";

const compactOrderColumns = [
  "Order ID",
  "Customer",
  "Restaurant",
  "Status",
  "Total",
  "Time",
  "Action",
];

const fullOrderColumns = [
  "Order ID",
  "Customer",
  "Restaurant",
  "Status",
  "Payment",
  "Courier",
  "Total",
  "Time",
  "Action",
];

export function LiveOrdersTable({
  orders,
  filters = [],
  onUpdateStatus,
  onViewOrder,
  onViewAll,
  compact = false,
  maxRows,
}) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredOrders = useMemo(() => {
    if (activeFilter === "All") {
      return orders;
    }
    return orders.filter((order) => order.status === activeFilter);
  }, [activeFilter, orders]);

  const visibleOrders = compact
    ? filteredOrders.slice(0, maxRows || 6)
    : filteredOrders;
  const columns = compact ? compactOrderColumns : fullOrderColumns;

  return (
    <AdminCard
      className={`live-orders-card ${
        compact ? "live-orders-card--compact" : ""
      }`}
    >
      <div className="live-orders__header">
        <SectionHeader
          title="Live Orders"
          description={
            compact
              ? undefined
              : "Monitor new, preparing, ready and active delivery orders in real time."
          }
        />

        {!compact && filters.length > 0 && (
          <div className="live-orders__filters">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`live-orders__filter-btn ${
                  activeFilter === filter
                    ? "live-orders__filter-btn--active"
                    : ""
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="live-orders__table-container">
        <AdminTable
          columns={columns}
          rows={visibleOrders}
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
                  <AdminSelect
                    value={order.status}
                    onChange={(e) => onUpdateStatus?.(order.id, e.target.value)}
                    size="compact"
                    aria-label={`Status for order ${order.id}`}
                  >
                    <option value="pending">pending</option>
                    <option value="preparing">preparing</option>
                    <option value="delivering">delivering</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancelled</option>
                  </AdminSelect>
                ) : (
                  <StatusBadge value={order.status} />
                )}
              </td>

              {!compact && (
                <td className="live-orders-row__cell text-tertiary">
                  {order.payment}
                </td>
              )}

              {!compact && (
                <td className="live-orders-row__cell text-tertiary">
                  {order.courier}
                </td>
              )}

              <td className="live-orders-row__cell font-medium">
                {order.total}
              </td>

              <td className="live-orders-row__cell text-quaternary">
                {order.time}
              </td>

              <td className="live-orders-row__cell live-orders-row__cell--last">
                <button
                  type="button"
                  className="live-orders-btn"
                  onClick={() => onViewOrder?.(order)}
                >
                  View
                </button>
              </td>
            </tr>
          )}
        />
      </div>

      {compact && (
        <div className="live-orders__footer">
          <button
            type="button"
            className="live-orders__view-all"
            onClick={onViewAll}
          >
            View all orders {"->"}
          </button>
        </div>
      )}
    </AdminCard>
  );
}
