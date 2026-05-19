export function CheckoutOrderItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <article className="grid grid-cols-[96px_minmax(0,1fr)_auto] gap-4 border-b border-[#E8EAF0] py-4 last:border-b-0">
      <div className="relative h-24 w-24 overflow-hidden rounded-3xl bg-[#EEF2F7]">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
        <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-semibold text-[#0D1A2D] shadow-sm">
          {item.quantity}
        </span>
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#8F9BB1]">
          {item.restaurant}
        </p>
        <h3 className="mt-1 truncate text-base font-medium text-[#0F1316]">
          {item.name}
        </h3>
        <p className="mt-1 text-sm text-[#5F6878]">
          {[item.category, item.weight].filter(Boolean).join(" · ")}
        </p>

        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-8 items-center overflow-hidden rounded-full border border-[#D8DDE7] bg-white">
            <button
              type="button"
              onClick={onDecrease}
              className="flex h-8 w-8 items-center justify-center text-base text-[#0D1A2D] transition hover:bg-[#EEF2F7]"
              aria-label={`Decrease ${item.name}`}
            >
              -
            </button>
            <span className="flex h-8 min-w-8 items-center justify-center border-x border-[#D8DDE7] px-2 text-xs font-medium text-[#0F1316]">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={onIncrease}
              className="flex h-8 w-8 items-center justify-center text-base text-[#0D1A2D] transition hover:bg-[#EEF2F7]"
              aria-label={`Increase ${item.name}`}
            >
              +
            </button>
          </div>

        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <p className="text-base font-medium text-[#0D1A2D]">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs font-medium text-[#8F9BB1] underline-offset-4 transition hover:text-[#0D1A2D] hover:underline"
        >
          Remove
        </button>
      </div>
    </article>
  );
}
