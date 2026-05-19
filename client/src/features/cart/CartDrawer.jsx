import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { useCart } from "./useCart";

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
      className={`fixed inset-0 z-50 transition ${
        isCartOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isCartOpen}
    >
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        className={`absolute inset-0 h-full w-full bg-[#07101D]/45 backdrop-blur-sm transition-opacity ${
          isCartOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        className={`fixed bottom-0 right-0 top-0 flex h-dvh w-full max-w-150 flex-col bg-white shadow-[-24px_0_60px_rgba(13,26,45,0.18)] transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping cart"
      >
        <header className="flex items-start justify-between border-b border-[#E8EAF0] px-6 py-6 sm:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8F9BB1]">
              Your order
            </p>
            <h2 className="mt-1 text-3xl font-medium tracking-[-0.03em] text-[#0F1316]">
              Cart ({totals.itemCount})
            </h2>
            <p className="mt-3 max-w-105 text-sm leading-[145%] text-[#5F6878]">
              Delivery from selected restaurants. Add more dishes or adjust
              portions before checkout.
            </p>
          </div>

          <button
            type="button"
            onClick={closeCart}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D8DDE7] text-2xl leading-none text-[#0D1A2D] transition hover:bg-[#EEF2F7]"
            aria-label="Close cart"
          >
            x
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 sm:px-8">
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
            <div className="flex h-full flex-col items-center justify-center py-14 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EEF2F7] text-2xl font-medium text-[#0D1A2D]">
                0
              </div>
              <h3 className="mt-6 text-2xl font-medium tracking-[-0.03em] text-[#0F1316]">
                Your cart is empty
              </h3>
              <p className="mt-3 max-w-80 text-sm leading-[150%] text-[#6B7280]">
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
