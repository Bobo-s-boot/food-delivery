import { useState } from "react";
import { StatusBadge } from "../../components/StatusBadge";

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

const actionsByStatus = {
  New: ["Accept order", "Cancel order", "Mark as issue"],
  Preparing: [
    "Assign courier",
    "Mark as on the way",
    "Cancel order",
    "Mark as issue",
  ],
  "On the way": [
    "Track courier",
    "Mark as delivered",
    "Mark as issue",
    "Contact courier",
  ],
  Delivered: ["View receipt", "Open refund request", "Contact customer"],
  Cancelled: ["View reason", "Refund details"],
};

const statusByAction = {
  "Accept order": "preparing",
  "Cancel order": "cancelled",
  "Mark as on the way": "delivering",
  "Mark as delivered": "delivered",
};

export function OrderDetailsDrawer({ order, onClose, onUpdateStatus }) {
  const [updatingAction, setUpdatingAction] = useState("");

  if (!order) {
    return null;
  }

  const actions = actionsByStatus[order.status] || [];

  const handleAction = async (action) => {
    const status = statusByAction[action];
    if (!status || !onUpdateStatus) return;

    try {
      setUpdatingAction(action);
      await onUpdateStatus(order.id, status);
    } finally {
      setUpdatingAction("");
    }
  };

  return (
    <div className="order-drawer" role="dialog" aria-modal="true">
      <button
        type="button"
        className="order-drawer__backdrop"
        aria-label="Close order details"
        onClick={onClose}
      />

      <aside className="order-drawer__panel">
        <div className="order-drawer__header">
          <div>
            <p className="order-drawer__eyebrow">Order details</p>
            <h2 className="order-drawer__title">Order {order.id}</h2>
          </div>

          <button
            type="button"
            className="order-drawer__close"
            aria-label="Close order details"
            onClick={onClose}
          >
            x
          </button>
        </div>

        <div className="order-drawer__badges">
          <StatusBadge value={order.status} />
          {order.issue && <StatusBadge value={order.issue} />}
        </div>

        <section className="order-drawer__section">
          <h3>Order summary</h3>
          <div className="order-drawer__summary-grid">
            <span>Placed</span>
            <strong>{order.placed}</strong>
            <span>Total</span>
            <strong>{formatMoney(order.payment.total)}</strong>
          </div>
        </section>

        <section className="order-drawer__section">
          <h3>Customer</h3>
          <p className="order-drawer__primary">{order.customer.name}</p>
          <p>{order.customer.email}</p>
          <p>{order.customer.phone}</p>
        </section>

        <section className="order-drawer__section">
          <h3>Restaurant</h3>
          <p className="order-drawer__primary">{order.restaurant.name}</p>
          <p>Prep time: {order.restaurant.prepTime}</p>
        </section>

        <section className="order-drawer__section">
          <h3>Order items</h3>
          <div className="order-drawer__items">
            {order.items.map((item) => (
              <div key={`${order.id}-${item.name}`} className="order-drawer__item">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <strong>{formatMoney(item.price)}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="order-drawer__section">
          <h3>Delivery</h3>
          <p>Address: {order.delivery.address}</p>
          <p>Courier: {order.courier.name}</p>
          <p>ETA: {order.delivery.eta}</p>
        </section>

        <section className="order-drawer__section">
          <h3>Payment</h3>
          <div className="order-drawer__summary-grid">
            <span>Status</span>
            <strong>{order.payment.status}</strong>
            <span>Subtotal</span>
            <strong>{formatMoney(order.payment.subtotal)}</strong>
            <span>Delivery fee</span>
            <strong>{formatMoney(order.payment.deliveryFee)}</strong>
            <span>Discount</span>
            <strong>-{formatMoney(order.payment.discount)}</strong>
            <span>Total</span>
            <strong>{formatMoney(order.payment.total)}</strong>
          </div>
        </section>

        <section className="order-drawer__section">
          <h3>Timeline</h3>
          <div className="order-drawer__timeline">
            {order.timeline.map((event) => (
              <div
                key={`${order.id}-${event.time}-${event.label}`}
                className="order-drawer__timeline-item"
              >
                <span>{event.time}</span>
                <p>{event.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="order-drawer__section">
          <h3>Admin actions</h3>
          <div className="order-drawer__actions">
            {actions.map((action) => (
              <button
                key={action}
                type="button"
                className="order-drawer__action"
                disabled={Boolean(updatingAction)}
                onClick={() => handleAction(action)}
              >
                {action}
              </button>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
