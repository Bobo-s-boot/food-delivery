const formatMoney = (value) => `$${value.toFixed(2)}`;

export function CartSummary({ totals, onCheckout }) {
  return (
    <div className="border-t border-[#E8EAF0] bg-white px-6 pb-6 pt-5 sm:px-8">
      <div className="space-y-3 text-sm text-[#5F6878]">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
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
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[#E8EAF0] pt-5">
        <span className="text-xl font-medium text-[#0F1316]">Total</span>
        <span className="text-2xl font-medium text-[#0D1A2D]">
          {formatMoney(totals.total)}
        </span>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        disabled={totals.itemCount === 0}
        className="mt-6 flex h-13 w-full items-center justify-center rounded-full bg-[#0D1A2D] px-6 text-base font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-[#D8DDE7] disabled:text-[#8F9BB1]"
      >
        Proceed to checkout
      </button>
    </div>
  );
}
