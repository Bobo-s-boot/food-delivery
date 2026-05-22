import { useMemo, useState } from "react";
import { AdminCard } from "./AdminCard";
import { AdminTable } from "./AdminTable";
import { SectionHeader } from "./SectionHeader";
import { StatusBadge } from "./StatusBadge";
import "../Admin.scss";

export function LiveOrdersTable({ orders, filters }) {
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
          columns={[
            "Order ID",
            "Customer",
            "Restaurant",
            "Status",
            "Payment",
            "Courier",
            "Total",
            "Time",
            "Action",
          ]}
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
                <StatusBadge value={order.status} />
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
