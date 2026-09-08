import chevronRight from "../../../../../assets/chevron-right.svg";
import { StatusBadge } from "../../../components/StatusBadge";

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

const getCourierName = (order) => {
  const name = order?.courier?.name?.trim();

  if (!name || name.toLowerCase() === "not assigned") {
    return "Unassigned";
  }

  return name;
};

function TextPair({ primary, secondary, secondaryTitle, className = "" }) {
  return (
    <span className={`admin-order-queue__pair ${className}`.trim()} role="cell">
      <strong className="admin-order-queue__primary">{primary}</strong>
      {secondary && (
        <span
          className="admin-order-queue__secondary"
          title={secondaryTitle || secondary}
        >
          {secondary}
        </span>
      )}
    </span>
  );
}

function OrderIssue({ issue }) {
  if (!issue) {
    return <span className="admin-order-queue__no-issue" aria-label="No issue" />;
  }

  return (
    <span className="admin-order-queue__issue">
      <StatusBadge value={issue} />
    </span>
  );
}

function DeliveryInfo({ order }) {
  const courierName = getCourierName(order);

  return (
    <TextPair
      primary={courierName}
      secondary={order.placed}
      secondaryTitle={`Placed ${order.placed}`}
      className="admin-order-queue__delivery"
    />
  );
}

function PaymentInfo({ order }) {
  return (
    <span className="admin-order-queue__pair admin-order-queue__payment" role="cell">
      <strong className="admin-order-queue__primary admin-order-queue__money">
        {formatMoney(order.payment.total)}
      </strong>
      <StatusBadge value={order.payment.status} />
    </span>
  );
}

function OrderAction({ order, onViewOrder }) {
  return (
    <button
      type="button"
      className="admin-order-queue__action"
      onClick={() => onViewOrder(order)}
      aria-label={`View order ${order.id}`}
      title="View order"
    >
      <span className="admin-order-queue__action-text">View</span>
      <img
        className="admin-order-queue__action-icon"
        src={chevronRight}
        alt=""
        aria-hidden="true"
      />
    </button>
  );
}

function LargeRow({ order, onViewOrder }) {
  const courierName = getCourierName(order);

  return (
    <div className="admin-order-queue__row admin-order-queue__row--large" role="row">
      <span className="admin-order-queue__primary admin-order-queue__nowrap" role="cell">
        {order.id}
      </span>
      <span className="admin-order-queue__ellipsis" title={order.customer.name} role="cell">
        {order.customer.name}
      </span>
      <span className="admin-order-queue__ellipsis" title={order.restaurant.name} role="cell">
        {order.restaurant.name}
      </span>
      <span role="cell"><StatusBadge value={order.status} /></span>
      <span role="cell"><OrderIssue issue={order.issue} /></span>
      <span role="cell"><StatusBadge value={order.payment.status} /></span>
      <span className="admin-order-queue__ellipsis" title={courierName} role="cell">
        {courierName}
      </span>
      <span className="admin-order-queue__primary admin-order-queue__money" role="cell">
        {formatMoney(order.payment.total)}
      </span>
      <span className="admin-order-queue__nowrap admin-order-queue__secondary" role="cell">
        {order.placed}
      </span>
      <span className="admin-order-queue__action-cell" role="cell">
        <OrderAction order={order} onViewOrder={onViewOrder} />
      </span>
    </div>
  );
}

function MediumRow({ order, onViewOrder }) {
  return (
    <div className="admin-order-queue__row admin-order-queue__row--medium" role="row">
      <TextPair primary={order.id} secondary={order.customer.name} />
      <span className="admin-order-queue__ellipsis" title={order.restaurant.name} role="cell">
        {order.restaurant.name}
      </span>
      <span role="cell"><StatusBadge value={order.status} /></span>
      <span role="cell"><OrderIssue issue={order.issue} /></span>
      <DeliveryInfo order={order} />
      <PaymentInfo order={order} />
      <span className="admin-order-queue__action-cell" role="cell">
        <OrderAction order={order} onViewOrder={onViewOrder} />
      </span>
    </div>
  );
}

function CompactRow({ order, onViewOrder }) {
  return (
    <div className="admin-order-queue__row admin-order-queue__row--compact" role="row">
      <TextPair
        primary={order.id}
        secondary={`${order.customer.name} · ${order.restaurant.name}`}
      />
      <span className="admin-order-queue__pair admin-order-queue__state" role="cell">
        <StatusBadge value={order.status} />
        <OrderIssue issue={order.issue} />
      </span>
      <DeliveryInfo order={order} />
      <PaymentInfo order={order} />
      <span className="admin-order-queue__action-cell" role="cell">
        <OrderAction order={order} onViewOrder={onViewOrder} />
      </span>
    </div>
  );
}

function NarrowCard({ order, onViewOrder }) {
  const courierName = getCourierName(order);

  return (
    <article className="admin-order-queue__card">
      <div className="admin-order-queue__card-top">
        <strong className="admin-order-queue__primary">{order.id}</strong>
        <strong className="admin-order-queue__money">
          {formatMoney(order.payment.total)}
        </strong>
        <OrderAction order={order} onViewOrder={onViewOrder} />
      </div>

      <div className="admin-order-queue__card-parties">
        <span title={order.customer.name}>{order.customer.name}</span>
        <span title={order.restaurant.name}>{order.restaurant.name}</span>
      </div>

      <div className="admin-order-queue__card-state">
        <StatusBadge value={order.status} />
        <OrderIssue issue={order.issue} />
      </div>

      <div className="admin-order-queue__card-meta">
        <span>
          <small>Courier</small>
          <strong title={courierName}>{courierName}</strong>
        </span>
        <span>
          <small>Placed</small>
          <strong>{order.placed}</strong>
        </span>
        <StatusBadge value={order.payment.status} />
      </div>
    </article>
  );
}

export function AdminOrderQueueItem({ order, onViewOrder }) {
  return (
    <div className="admin-order-queue__item">
      <LargeRow order={order} onViewOrder={onViewOrder} />
      <MediumRow order={order} onViewOrder={onViewOrder} />
      <CompactRow order={order} onViewOrder={onViewOrder} />
      <NarrowCard order={order} onViewOrder={onViewOrder} />
    </div>
  );
}
