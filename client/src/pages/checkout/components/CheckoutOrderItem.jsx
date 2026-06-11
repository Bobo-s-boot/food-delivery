export function CheckoutOrderItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <article className="checkout-order-item">
      <div className="checkout-order-item__image">
        <img
          src={item.image}
          alt={item.name}
          className="checkout-order-item__photo"
        />
        <span className="checkout-order-item__badge">{item.quantity}</span>
      </div>

      <div className="checkout-order-item__info">
        <p className="checkout-order-item__restaurant">{item.restaurant}</p>
        <h3 className="checkout-order-item__name">{item.name}</h3>
        <p className="checkout-order-item__meta">
          {[item.category, item.weight].filter(Boolean).join(" · ")}
        </p>

        <div className="checkout-order-item__controls">
          <div className="checkout-counter">
            <button
              type="button"
              onClick={onDecrease}
              className="checkout-counter__button"
              aria-label={`Decrease ${item.name}`}
            >
              -
            </button>
            <span className="checkout-counter__value">{item.quantity}</span>
            <button
              type="button"
              onClick={onIncrease}
              className="checkout-counter__button"
              aria-label={`Increase ${item.name}`}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="checkout-order-item__summary">
        <p className="checkout-order-item__price">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="checkout-order-item__remove"
        >
          Remove
        </button>
      </div>
    </article>
  );
}
