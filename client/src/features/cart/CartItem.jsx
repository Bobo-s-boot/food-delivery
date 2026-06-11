import "./Features.scss";

export function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <article className="cart-item">
      <div className="cart-item__image-wrapper">
        <img src={item.image} alt={item.name} className="cart-item__image" />
      </div>

      <div className="cart-item__content">
        <div className="cart-item__header">
          <div className="cart-item__info">
            <p className="cart-item__restaurant">{item.restaurant}</p>
            <h3 className="cart-item__name">{item.name}</h3>
          </div>

          <p className="cart-item__price">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>

        <p className="cart-item__description">
          {[item.category, item.weight].filter(Boolean).join(" · ") ||
            item.description}
        </p>

        <div className="cart-item__footer">
          <div className="cart-item__counter">
            <button
              type="button"
              onClick={onDecrease}
              className="cart-item__counter-btn"
              aria-label={`Decrease ${item.name}`}
            >
              -
            </button>
            <span className="cart-item__counter-value">{item.quantity}</span>
            <button
              type="button"
              onClick={onIncrease}
              className="cart-item__counter-btn"
              aria-label={`Increase ${item.name}`}
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="cart-item__remove-btn"
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}
