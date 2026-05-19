import { DETAIL_CARDS } from "../const";

function DetailRows({ rows }) {
  return (
    <div className="mt-5 grid gap-3">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="flex items-start justify-between gap-6 border-b border-[#EEF2F6] pb-3 last:border-b-0 last:pb-0"
        >
          <span className="text-sm text-[#6B7890]">{label}</span>
          <span className="max-w-70 text-right text-sm font-medium text-[#071426]">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function DishProductDetails() {
  return (
    <section className="mt-16">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8A96A8]">
            Product details
          </p>
          <h2 className="mt-2 text-[40px] font-medium leading-none tracking-[-0.04em] text-[#071426]">
            Everything before you order
          </h2>
        </div>
        <p className="max-w-120 text-base leading-[150%] text-[#6B7890]">
          Clear ingredients, delivery timing, restaurant status, and nutrition
          notes before the burger goes into your cart.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {DETAIL_CARDS.map((card) => (
          <article
            key={card.id}
            className="rounded-[28px] border border-[#E1E7F0] bg-white p-6 shadow-[0_14px_35px_rgba(7,20,38,0.04)] md:p-8"
          >
            <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[#071426]">
              {card.title}
            </h3>

            {card.text && (
              <p className="mt-4 text-base leading-[150%] text-[#39445A]">
                {card.text}
              </p>
            )}

            {card.chips && (
              <div className="mt-5 flex flex-wrap gap-2">
                {card.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-[#E1E7F0] bg-[#F5F7FA] px-3 py-1.5 text-sm font-medium text-[#071426]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}

            {card.rows && <DetailRows rows={card.rows} />}

            {card.note && (
              <p className="mt-5 rounded-2xl bg-[#F5F7FA] px-4 py-3 text-sm leading-[145%] text-[#6B7890]">
                {card.note}
              </p>
            )}

            {card.action && (
              <button
                type="button"
                className="mt-6 rounded-full border border-[#E1E7F0] px-5 py-2.5 text-sm font-semibold text-[#071426] transition hover:border-[#071426] hover:bg-[#F5F7FA]"
              >
                {card.action}
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
