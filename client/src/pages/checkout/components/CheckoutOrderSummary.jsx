import { useCart } from "../../../features/cart/useCart";
import { CheckoutOrderItem } from "./CheckoutOrderItem";

const formatMoney = (value) => `$${value.toFixed(2)}`;

export function CheckoutOrderSummary() {
  const { items, totals, increaseItem, decreaseItem, removeItem, clearCart } =
    useCart();

  return (
    <aside className="sticky top-6 flex max-h-[calc(100vh-48px)] flex-col rounded-3xl border border-[#E8EAF0] bg-white">
      <div className="border-b border-[#E8EAF0] px-6 py-5">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8F9BB1]">
          Your basket
        </p>
        <h2 className="mt-1 text-2xl font-medium tracking-[-0.03em] text-[#0F1316]">
          Order summary
        </h2>
      </div>

      <div className="min-h-0 overflow-y-auto px-6">
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

      <div className="border-t border-[#E8EAF0] px-6 py-5">
        <div className="space-y-3 text-sm text-[#5F6878]">
          <div className="flex items-center justify-between">
            <span>{totals.itemCount} items</span>
            <span className="font-medium text-[#0F1316]">
              {formatMoney(totals.subtotal)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Delivery</span>
            <span className="font-medium text-[#0F1316]">
              {totals.deliveryFee > 0 ? formatMoney(totals.deliveryFee) : "Free"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Service</span>
            <span className="font-medium text-[#0F1316]">$0.00</span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-[#E8EAF0] pt-5">
          <span className="text-xl font-medium text-[#0F1316]">To pay</span>
          <span className="text-3xl font-medium tracking-[-0.03em] text-[#0D1A2D]">
            {formatMoney(totals.total)}
          </span>
        </div>

        <button
          type="button"
          disabled={totals.itemCount === 0}
          className="mt-6 h-13 w-full rounded-full bg-[#0D1A2D] px-6 text-base font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-[#D8DDE7] disabled:text-[#8F9BB1]"
        >
          Place order
        </button>
        <button
          type="button"
          onClick={clearCart}
          className="mt-3 h-11 w-full rounded-full border border-[#D8DDE7] text-sm font-medium text-[#0D1A2D] transition hover:bg-[#EEF2F7]"
        >
          Clear basket
        </button>
      </div>
    </aside>
  );
}
