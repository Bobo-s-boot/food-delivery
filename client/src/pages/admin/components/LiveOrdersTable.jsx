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

const formatOrderTime = (value) => {
  if (!value) return "Unknown";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const getOrderDisplayData = (order) => {
  const customer =
    typeof order.customer === "object" ? order.customer?.name : order.customer;
  const restaurant =
    typeof order.restaurant === "object"
      ? order.restaurant?.name
      : order.restaurant;
  const payment =
    typeof order.payment === "object"
      ? order.payment?.method || order.payment?.status
      : order.payment;
  const courier =
    typeof order.courier === "object" ? order.courier?.name : order.courier;
  const total =
    order.total ??
    (order.totalPrice === undefined
      ? undefined
      : `$${Number(order.totalPrice || 0).toFixed(2)}`);
  const time = order.time || order.placed || formatOrderTime(order.createdAt);

  return {
    id: order.orderNumber || order.id || order._id || "Unknown order",
    customer: customer || order.customerName || "Unknown customer",
    restaurant: restaurant || order.restaurantId?.name || "Unknown restaurant",
    payment: payment || order.paymentMethod || "Not provided",
    courier: courier || "Not assigned",
    total: total || "$0.00",
    time,
    status: String(order.status).trim().toLowerCase(),
  };
};

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
    return orders.filter(
      (order) =>
        String(order.status || "pending")
          .trim()
          .toLowerCase() === activeFilter.toLowerCase(),
    );
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
          renderRow={(order) => {
            const displayOrder = getOrderDisplayData(order);
            const orderId = order._id || order.id || order.orderNumber;

            return (
              <tr key={orderId} className="live-orders-row">
                <td className="live-orders-row__cell live-orders-row__cell--first font-medium text-primary">
                  {displayOrder.id}
                </td>

                <td className="live-orders-row__cell text-secondary">
                  {displayOrder.customer}
                </td>

                <td className="live-orders-row__cell text-secondary">
                  {displayOrder.restaurant}
                </td>

                <td className="live-orders-row__cell">
                  {onUpdateStatus ? (
                    <AdminSelect
                      value={displayOrder.status}
                      onChange={(e) =>
                        onUpdateStatus?.(orderId, e.target.value)
                      }
                      size="compact"
                      aria-label={`Status for order ${displayOrder.id}`}
                    >
                      <option value="pending">pending</option>
                      <option value="preparing">preparing</option>
                      <option value="delivering">delivering</option>
                      <option value="delivered">delivered</option>
                      <option value="cancelled">cancelled</option>
                    </AdminSelect>
                  ) : (
                    <StatusBadge value={displayOrder.status} />
                  )}
                </td>

                {!compact && (
                  <td className="live-orders-row__cell text-tertiary">
                    {displayOrder.payment}
                  </td>
                )}

                {!compact && (
                  <td className="live-orders-row__cell text-tertiary">
                    {displayOrder.courier}
                  </td>
                )}

                <td className="live-orders-row__cell font-medium">
                  {displayOrder.total}
                </td>

                <td className="live-orders-row__cell text-quaternary">
                  {displayOrder.time}
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
            );
          }}
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
