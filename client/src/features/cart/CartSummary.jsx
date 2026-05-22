import "./Features.scss";

export function CartSummary({ totals, onCheckout }) {
  // Защита от пустых данных, если корзина только загрузилась
  const subtotal = totals?.subtotal || 0;
  const delivery = totals?.delivery || 0;
  const total = totals?.total || 0;
  const isCartEmpty = !totals?.itemCount;

  return (
    <div className="cart-summary">
      <div className="cart-summary__items">
        <div className="cart-summary__row">
          <span>Subtotal</span>
          <span className="cart-summary__row-value">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="cart-summary__row">
          <span>Delivery</span>
          <span className="cart-summary__row-value">
            {delivery === 0 ? "Free" : `$${delivery.toFixed(2)}`}
          </span>
        </div>
      </div>

      <div className="cart-summary__total">
        <span className="cart-summary__total-label">Total</span>
        <span className="cart-summary__total-value">${total.toFixed(2)}</span>
      </div>

      <button
        type="button"
        className="cart-summary__button"
        onClick={onCheckout}
        disabled={isCartEmpty}
      >
        Go to Checkout
      </button>
    </div>
  );
}
