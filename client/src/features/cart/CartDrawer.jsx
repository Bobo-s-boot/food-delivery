import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { useCart } from "./useCart";
import "./Features.scss"; // Подключаем наши стили!

export function CartDrawer() {
  const navigate = useNavigate();
  const {
    items,
    totals,
    isCartOpen,
    closeCart,
    addItem,
    decreaseItem,
    removeItem,
  } = useCart();

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  useEffect(() => {
    if (!isCartOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isCartOpen]);

  return (
    <div
      className={`cart-drawer ${isCartOpen ? "cart-drawer--open" : ""}`}
      aria-hidden={!isCartOpen}
    >
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        className="cart-drawer__overlay"
      />

      <aside className="cart-drawer__panel" aria-label="Shopping cart">
        <header className="cart-drawer__header">
          <div>
            <p className="cart-drawer__eyebrow">Your order</p>
            <h2 className="cart-drawer__title">Cart ({totals.itemCount})</h2>
            <p className="cart-drawer__description">
              Delivery from selected restaurants. Add more dishes or adjust
              portions before checkout.
            </p>
          </div>

          <button
            type="button"
            onClick={closeCart}
            className="cart-drawer__close"
            aria-label="Close cart"
          >
            x
          </button>
        </header>

        <div className="cart-drawer__content">
          {items.length > 0 ? (
            items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={() => addItem(item)}
                onDecrease={() => decreaseItem(item.id)}
                onRemove={() => removeItem(item.id)}
              />
            ))
          ) : (
            <div className="cart-drawer__empty">
              <div className="cart-drawer__empty-icon">0</div>
              <h3 className="cart-drawer__empty-title">Your cart is empty</h3>
              <p className="cart-drawer__empty-text">
                Add a burger, sushi set, dessert, or anything else that looks
                dangerously good.
              </p>
            </div>
          )}
        </div>

        <CartSummary totals={totals} onCheckout={handleCheckout} />
      </aside>
    </div>
  );
}
