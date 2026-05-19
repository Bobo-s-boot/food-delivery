export function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <article className="grid grid-cols-[128px_minmax(0,1fr)] gap-5 border-b border-[#E8EAF0] py-5">
      <div className="h-36 w-32 overflow-hidden rounded-3xl bg-[#EEF2F7]">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-col">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#8F9BB1]">
              {item.restaurant}
            </p>
            <h3 className="mt-1 truncate text-lg font-medium leading-tight text-[#0F1316]">
              {item.name}
            </h3>
          </div>

          <p className="shrink-0 text-lg font-medium text-[#0D1A2D]">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-[140%] text-[#6B7280]">
          {[item.category, item.weight].filter(Boolean).join(" · ") ||
            item.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <div className="flex h-10 items-center overflow-hidden rounded-full border border-[#D8DDE7] bg-white">
            <button
              type="button"
              onClick={onDecrease}
              className="flex h-10 w-10 items-center justify-center text-xl text-[#0D1A2D] transition hover:bg-[#EEF2F7]"
              aria-label={`Decrease ${item.name}`}
            >
              -
            </button>
            <span className="flex h-10 min-w-10 items-center justify-center border-x border-[#D8DDE7] px-3 text-sm font-medium text-[#0F1316]">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={onIncrease}
              className="flex h-10 w-10 items-center justify-center text-xl text-[#0D1A2D] transition hover:bg-[#EEF2F7]"
              aria-label={`Increase ${item.name}`}
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="text-sm font-medium text-[#8F9BB1] underline-offset-4 transition hover:text-[#0D1A2D] hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}
