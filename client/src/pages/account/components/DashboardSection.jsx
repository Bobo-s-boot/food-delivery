import { getRepeatOrderLabel } from "../accountUtils";
import { ArrowUpRightIcon } from "./AccountActions";

const getProgressClass = (steps, activeStep, step) => {
  const activeIndex = steps.indexOf(activeStep);
  const stepIndex = steps.indexOf(step);

  if (stepIndex < activeIndex) return "account-progress__step--done";
  if (stepIndex === activeIndex) return "account-progress__step--active";
  return "";
};

const QUICK_ACTION_LABELS = {
  reorder: "Open cart",
  track: "Track",
  address: "Change",
  favorites: "View",
};

export function DashboardSection({
  account,
  onSectionChange,
  onReorder,
  onTrackOrder,
  onSupport,
  onBrowseRestaurants,
}) {
  const {
    user,
    dashboardStats,
    activeOrder,
    orders,
    mostOrderedRestaurants,
    favorites,
    recommendations,
  } = account;
  const recentOrders = orders.filter((order) => order.status !== "active").slice(0, 3);

  const openRecentOrderDetails = (orderId) => {
    onTrackOrder(orderId);
  };

  const handleRecentOrderKeyDown = (event, orderId) => {
    if (event.target !== event.currentTarget) return;
    if (event.key !== "Enter") return;
    event.preventDefault();
    openRecentOrderDetails(orderId);
  };

  const handleRecentOrderAction = (event, order) => {
    event.stopPropagation();

    if (order.status === "active") {
      onTrackOrder(order.id);
      return;
    }

    onReorder(order);
  };

  return (
    <div className="account-section">
      <section className="account-hero-card">
        <div>
          <span className="account-eyebrow">My Account</span>
          <h1>Welcome back, {user.name.split(" ")[0]}</h1>
          <p>
            Here&apos;s your food activity, recent orders, and delivery updates.
          </p>
        </div>
      </section>

      <section className="account-stats-grid">
        {dashboardStats.map((stat) => (
          <article key={stat.label} className="account-stat-card">
            <p>{stat.label}</p>
            <strong>{stat.value}</strong>
            <span>{stat.detail}</span>
          </article>
        ))}
      </section>

      <section className="account-card account-delivery-card">
        <div className="account-card__header">
          <div>
            <span className="account-eyebrow">Active delivery</span>
            <h2>Your order is on the way</h2>
            <p>{activeOrder.message}</p>
          </div>
          <div className="account-delivery-card__eta">
            <strong>{activeOrder.etaMinutes} min</strong>
            <span>Estimated arrival</span>
          </div>
        </div>

        <div className="account-delivery-card__meta">
          <span>{activeOrder.restaurantName}</span>
          <span>Order #{activeOrder.id}</span>
          <span>Courier: {activeOrder.courierName}</span>
          <span>{activeOrder.deliveryAddress}</span>
        </div>

        <div className="account-progress">
          {activeOrder.progressSteps.map((step) => (
            <div
              key={step}
              className={`account-progress__step ${getProgressClass(
                activeOrder.progressSteps,
                activeOrder.activeStep,
                step,
              )}`}
            >
              <span></span>
              <p>{step}</p>
            </div>
          ))}
        </div>

        <div className="account-actions-row">
          <button
            type="button"
            className="account-button account-button--primary"
            onClick={() => onTrackOrder(activeOrder.id)}
          >
            Track Order
          </button>
          <button
            type="button"
            className="account-button account-button--secondary"
            onClick={() => onSupport(activeOrder.id)}
          >
            Problem with delivery?
          </button>
        </div>
      </section>

      <section className="account-quick-grid">
        <button type="button" onClick={() => onReorder(orders[1])}>
          <span>Reorder last meal</span>
          <strong>The Burger Joint</strong>
          <em>{QUICK_ACTION_LABELS.reorder}</em>
        </button>
        <button type="button" onClick={() => onTrackOrder(activeOrder.id)}>
          <span>Track active order</span>
          <strong>{activeOrder.etaMinutes} min ETA</strong>
          <em>{QUICK_ACTION_LABELS.track}</em>
        </button>
        <button type="button" onClick={() => onSectionChange("addresses")}>
          <span>Change delivery address</span>
          <strong>Green Park Area</strong>
          <em>{QUICK_ACTION_LABELS.address}</em>
        </button>
        <button type="button" onClick={() => onSectionChange("favorites")}>
          <span>View favorites</span>
          <strong>{favorites.restaurants.length + favorites.dishes.length} saved</strong>
          <em>{QUICK_ACTION_LABELS.favorites}</em>
        </button>
      </section>

      <div className="account-two-column">
        <section className="account-card">
          <div className="account-card__header">
            <div>
              <span className="account-eyebrow">Recent orders</span>
              <h2>Order again safely</h2>
            </div>
            <button
              type="button"
              className="account-link-button"
              onClick={() => onSectionChange("orders")}
            >
              <span>View all orders</span>
              <ArrowUpRightIcon />
            </button>
          </div>
          <div className="account-list">
            {recentOrders.map((order) => (
              <article
                key={order.id}
                className="account-order-mini account-order-mini--clickable"
                role="button"
                tabIndex={0}
                aria-label={`Open details for order ${order.id}`}
                onClick={() => openRecentOrderDetails(order.id)}
                onKeyDown={(event) => handleRecentOrderKeyDown(event, order.id)}
              >
                <div>
                  <h3>{order.restaurantName}</h3>
                  <p>
                    {order.statusLabel} · {order.date}, {order.time} · $
                    {order.total.toFixed(2)}
                  </p>
                  <span>{order.items.map((item) => item.name).join(" · ")}</span>
                </div>
                <div className="account-order-mini__actions">
                  <button
                    type="button"
                    onClick={(event) => handleRecentOrderAction(event, order)}
                  >
                    {order.status === "active"
                      ? "Track order"
                      : getRepeatOrderLabel(order.status)}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="account-card">
          <div className="account-card__header">
            <div>
              <span className="account-eyebrow">Most ordered</span>
              <h2>Your regular places</h2>
            </div>
          </div>
          <div className="account-restaurant-list">
            {mostOrderedRestaurants.map((restaurant) => (
              <article key={restaurant.name} className="account-media-row">
                <img src={restaurant.image} alt="" />
                <div>
                  <h3>{restaurant.name}</h3>
                  <p>
                    {restaurant.category} · Ordered {restaurant.count} times
                  </p>
                </div>
                <button type="button" onClick={onBrowseRestaurants}>
                  <span>View menu</span>
                  <ArrowUpRightIcon />
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="account-two-column">
        <section className="account-card">
          <div className="account-card__header">
            <div>
              <span className="account-eyebrow">Saved places</span>
              <h2>Your Favorite Places</h2>
            </div>
            <button
              type="button"
              className="account-link-button"
              onClick={() => onSectionChange("favorites")}
            >
              <span>View all favorites</span>
              <ArrowUpRightIcon />
            </button>
          </div>
          <div className="account-restaurant-list">
            {favorites.restaurants.map((restaurant) => (
              <article key={restaurant.id} className="account-media-row">
                <img src={restaurant.image} alt="" />
                <div>
                  <h3>{restaurant.name}</h3>
                  <p>
                    {restaurant.category} · {restaurant.rating} · Delivery{" "}
                    {restaurant.deliveryTime}
                  </p>
                </div>
                <button type="button" onClick={onBrowseRestaurants}>
                  <span>View Menu</span>
                  <ArrowUpRightIcon />
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="account-card">
          <div className="account-card__header">
            <div>
              <span className="account-eyebrow">Recommended for you</span>
              <h2>Based on your recent orders</h2>
            </div>
          </div>
          <div className="account-tag-grid">
            {recommendations.map((recommendation) => (
              <button key={recommendation} type="button" onClick={onBrowseRestaurants}>
                {recommendation}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
