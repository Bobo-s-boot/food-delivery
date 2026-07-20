import { useState } from "react";
import { useCart } from "../../../features/cart/useCart";
import { CheckoutOrderItem } from "./CheckoutOrderItem";

const formatMoney = (value) => `$${value.toFixed(2)}`;

export function CheckoutOrderSummary({
  validateAll,
  setErrors,
  onContinueToPayment,
}) {
  const { items, totals, increaseItem, decreaseItem, removeItem, clearCart } =
    useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = async () => {
    if (totals.itemCount === 0) return;

    if (validateAll && !validateAll()) {
      alert("Please fill in all required fields correctly.");
      return;
    }

    if (onContinueToPayment) {
      onContinueToPayment();
      return;
    }

    setIsSubmitting(true);
    try {
      throw new Error("Payment flow must be handled on the checkout step.");
    } catch (error) {
      console.error("Failed to place order", error);
      alert(
        error.response?.data?.message ||
          "Failed to place order. Please try again.",
      );
      setErrors(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside className="checkout-summary">
      <div className="checkout-summary__header">
        <p className="checkout-summary__eyebrow">Your basket</p>
        <h2 className="checkout-summary__title">Order summary</h2>
      </div>

      <div className="checkout-summary__items">
        {items.map((item) => (
          <CheckoutOrderItem
            key={item.id}
            item={item}
            onIncrease={() => increaseItem(item)}
            onDecrease={() => decreaseItem(item.id)}
            onRemove={() => removeItem(item.id)}
          />
        ))}
      </div>

      <div className="checkout-summary__footer">
        <div className="checkout-summary__totals">
          <div className="checkout-summary__row">
            <span>{totals.itemCount} items</span>
            <span className="checkout-summary__value">
              {formatMoney(totals.subtotal)}
            </span>
          </div>

          <div className="checkout-summary__row">
            <span>Delivery</span>
            <span className="checkout-summary__value">
              {totals.deliveryFee > 0
                ? formatMoney(totals.deliveryFee)
                : "Free"}
            </span>
          </div>

          <div className="checkout-summary__row">
            <span>Service</span>
            <span className="checkout-summary__value">$0.00</span>
          </div>
        </div>

        <div className="checkout-summary__pay-row">
          <span className="checkout-summary__pay-label">To pay</span>
          <span className="checkout-summary__pay-value">
            {formatMoney(totals.total)}
          </span>
        </div>

        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={totals.itemCount === 0 || isSubmitting}
          className="checkout-button checkout-button--primary checkout-button--wide checkout-button--summary"
        >
          {isSubmitting ? "Opening payment..." : "Continue to payment"}
        </button>

        <button
          type="button"
          onClick={clearCart}
          className="checkout-button checkout-button--secondary checkout-button--wide checkout-button--summary-secondary"
        >
          Clear basket
        </button>
      </div>
    </aside>
  );
}
