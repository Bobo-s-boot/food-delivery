import { AdminCard } from "../../../components/AdminCard";
import { SectionHeader } from "../../../components/SectionHeader";
import { AdminOrderQueueItem } from "./AdminOrderQueueItem";
import "./AdminOrderQueue.scss";

const headers = {
  large: [
    "Order ID",
    "Customer",
    "Restaurant",
    "Status",
    "Issue",
    "Payment",
    "Courier",
    "Total",
    "Placed",
    "Action",
  ],
  medium: ["Order", "Restaurant", "Status", "Issue", "Delivery", "Payment", "Action"],
  compact: ["Order", "State", "Fulfillment", "Payment", "Action"],
};

function QueueHeader({ mode }) {
  return (
    <div
      className={`admin-order-queue__head admin-order-queue__head--${mode}`}
      role="row"
    >
      {headers[mode].map((label) => (
        <span key={label} role="columnheader">{label}</span>
      ))}
    </div>
  );
}

export function AdminOrderQueue({ orders, totalCount, onViewOrder }) {
  return (
    <AdminCard className="admin-order-queue">
      <div className="admin-order-queue__header">
        <SectionHeader title="Order Queue" />
      </div>

      {orders.length > 0 ? (
        <div className="admin-order-queue__table" role="table" aria-label="Order Queue">
          <QueueHeader mode="large" />
          <QueueHeader mode="medium" />
          <QueueHeader mode="compact" />

          <div className="admin-order-queue__body" role="rowgroup">
            {orders.map((order) => (
              <AdminOrderQueueItem
                key={order.id}
                order={order}
                onViewOrder={onViewOrder}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="admin-orders-empty">No orders match this filter.</div>
      )}

      <div className="admin-order-queue__footer">
        <p>
          Showing {orders.length ? "1" : "0"}-{orders.length} of {totalCount} orders
        </p>
        <div className="admin-order-queue__pagination">
          <button type="button">Previous</button>
          <button type="button">Next</button>
        </div>
      </div>
    </AdminCard>
  );
}
