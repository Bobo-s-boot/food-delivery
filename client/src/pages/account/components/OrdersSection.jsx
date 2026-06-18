import { useMemo, useState } from "react";
import { ORDER_FILTERS } from "../const";
import {
  filterOrders,
  getOrderItemsSummary,
  getOrderMeta,
  getRepeatOrderLabel,
} from "../accountUtils";

export function OrdersSection({
  orders,
  activeOrder,
  selectedOrderId,
  onSelectOrder,
  onReorder,
  onSupport,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const activeOrderDetails = orders.find((order) => order.status === "active");
  const selectedOrder =
    orders.find((order) => order.id === selectedOrderId) || activeOrderDetails;
  const visibleOrders = useMemo(
    () => filterOrders(orders, activeFilter, searchQuery),
    [orders, activeFilter, searchQuery],
  );

  const handleOrderCardKeyDown = (event, orderId) => {
    if (event.target !== event.currentTarget) return;
    if (event.key !== "Enter") return;
    event.preventDefault();
    onSelectOrder(orderId);
  };

  const handleOrderAction = (event, action) => {
    event.stopPropagation();
    action();
  };

  const renderDetailsActions = () => {
    if (!selectedOrder) return null;

    if (selectedOrder.status === "active") {
      return (
        <>
          <button
            type="button"
            className="account-button account-button--primary"
            onClick={() => onSelectOrder(selectedOrder.id)}
          >
            Track order
          </button>
          <button
            type="button"
            className="account-button account-button--secondary"
            onClick={() => onSupport(selectedOrder.id)}
          >
            Get help
          </button>
        </>
      );
    }

    const isCancelled = selectedOrder.status === "cancelled";
    const secondaryLabel =
      selectedOrder.status === "delivered"
        ? "View receipt"
        : selectedOrder.status === "refunded"
          ? "View refund"
          : "Get help";

    return (
      <>
        <button
          type="button"
          className="account-button account-button--primary"
          onClick={() => onReorder(selectedOrder)}
        >
          {getRepeatOrderLabel(selectedOrder.status)}
        </button>
        <button
          type="button"
          className="account-button account-button--secondary"
          onClick={isCancelled ? () => onSupport(selectedOrder.id) : undefined}
        >
          {secondaryLabel}
        </button>
      </>
    );
  };

  return (
    <div className="account-section">
      <section className="account-page-heading">
        <span className="account-eyebrow">Orders</span>
        <h1>Orders History</h1>
        <p>
          Review your past orders, track active deliveries, or reorder your
          favorite meals.
        </p>
      </section>

      <section className="account-card">
        <div className="account-toolbar">
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by restaurant, dish, or order number"
          />
          <div className="account-filter-row">
            {ORDER_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={activeFilter === filter ? "is-active" : ""}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="account-card account-active-order">
        <div>
          <span className="account-eyebrow">Active order</span>
          {activeOrder ? (
            <>
              <div className="account-active-order__title">
                <h2>Order #{activeOrder.id}</h2>
                <span className="account-pill account-pill--accent">
                  Active now
                </span>
              </div>
              <h3>{activeOrder.restaurantName}</h3>
              <p>
                {activeOrder.statusLabel} - Estimated arrival:{" "}
                {activeOrder.etaMinutes} min
              </p>
            </>
          ) : (
            <>
              <h2>No active orders right now</h2>
              <p>Your current deliveries will appear here.</p>
            </>
          )}
        </div>
        {activeOrder && (
          <div className="account-actions-row">
            <button
              type="button"
              className="account-button account-button--primary"
              onClick={() => onSelectOrder(activeOrder.id)}
            >
              Track order
            </button>
            <button
              type="button"
              className="account-button account-button--secondary"
              onClick={() => onSelectOrder(activeOrder.id)}
            >
              View details
            </button>
          </div>
        )}
      </section>

      <div className="account-orders-layout">
        <section className="account-card">
          <div className="account-card__header">
            <div>
              <span className="account-eyebrow">All orders</span>
              <h2>Past orders list</h2>
            </div>
          </div>
          {visibleOrders.length > 0 ? (
            <div className="account-list">
              {visibleOrders.map((order) => (
                <article
                  key={order.id}
                  className={`account-order-card ${
                    selectedOrder?.id === order.id
                      ? "account-order-card--selected"
                      : ""
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open details for order ${order.id}`}
                  onClick={() => onSelectOrder(order.id)}
                  onKeyDown={(event) => handleOrderCardKeyDown(event, order.id)}
                >
                  <div className="account-order-card__main">
                    <h3>Order #{order.id}</h3>
                    <strong>{order.restaurantName}</strong>
                    <p>{getOrderMeta(order)}</p>
                    <span>{getOrderItemsSummary(order)}</span>
                  </div>
                  <div className="account-order-card__side">
                    <span className={`account-status account-status--${order.status}`}>
                      {order.statusLabel}
                    </span>
                    {order.status !== "active" && (
                    <div className="account-order-card__actions">
                      <button
                        type="button"
                        onClick={(event) =>
                          handleOrderAction(event, () => onReorder(order))
                        }
                      >
                        {getRepeatOrderLabel(order.status)}
                      </button>
                    </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="account-empty-state">
              <h3>No matching orders found</h3>
              <p>Try searching by restaurant, dish, or order number.</p>
            </div>
          )}
        </section>

        <aside className="account-card account-details-panel">
          {selectedOrder ? (
            <>
              <span className="account-eyebrow">Order details</span>
              <h2>Order #{selectedOrder.id}</h2>
              <span className={`account-status account-status--${selectedOrder.status}`}>
                {selectedOrder.statusLabel}
              </span>

              <div className="account-details-panel__group">
                <h3>Restaurant</h3>
                <p>{selectedOrder.restaurantName}</p>
              </div>

              <div className="account-details-panel__group">
                <h3>Items</h3>
                {selectedOrder.items.map((item) => (
                  <p key={item.id}>
                    {item.name} - ${Number(item.price).toFixed(2)}
                  </p>
                ))}
              </div>

              <div className="account-details-panel__group">
                <h3>Delivery address</h3>
                <p>{selectedOrder.address}</p>
              </div>

              <div className="account-details-panel__group">
                <h3>Payment</h3>
                <p>{selectedOrder.paymentMethod}</p>
              </div>

              <div className="account-details-panel__totals">
                <span>Subtotal</span>
                <strong>${selectedOrder.priceBreakdown.subtotal.toFixed(2)}</strong>
                <span>Delivery fee</span>
                <strong>${selectedOrder.priceBreakdown.delivery.toFixed(2)}</strong>
                <span>Discount</span>
                <strong>-${selectedOrder.priceBreakdown.discount.toFixed(2)}</strong>
                <span>Total</span>
                <strong>${selectedOrder.priceBreakdown.total.toFixed(2)}</strong>
              </div>

              <div className="account-actions-row account-details-actions">
                {renderDetailsActions()}
              </div>
            </>
          ) : (
            <div className="account-empty-state">
              <h3>Select an order</h3>
              <p>Order details will appear here.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
