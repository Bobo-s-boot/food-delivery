import { CATEGORY_RATINGS, DISH_REVIEWS, RATING_DISTRIBUTION } from "../const";

export function DishReviews({ dish }) {
  return (
    <section className="mt-16">
      <article className="rounded-[28px] border border-[#E1E7F0] bg-white p-6 shadow-[0_14px_35px_rgba(7,20,38,0.04)] md:p-8">
        <div className="flex flex-col gap-6 border-b border-[#E1E7F0] pb-8 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#8A96A8]">
              Reviews
            </p>
            <h2 className="mt-2 text-[40px] font-medium leading-none tracking-[-0.04em] text-[#071426]">
              What customers say
            </h2>
            <p className="mt-3 text-base text-[#6B7890]">
              Based on {dish.reviews} customer reviews
            </p>
          </div>

          <div className="rounded-[28px] bg-[#F5F7FA] p-6 lg:min-w-72">
            <div className="flex items-end gap-3">
              <span className="text-[56px] font-semibold leading-none tracking-[-0.05em] text-[#071426]">
                {dish.rating.toFixed(1)}
              </span>
              <span className="mb-2 rounded-full bg-[#EAF24D] px-3 py-1.5 text-sm font-semibold text-[#071426]">
                overall rating
              </span>
            </div>
            <p className="mt-3 text-sm text-[#6B7890]">
              Warm delivery, strong packaging, and consistent taste.
            </p>
          </div>
        </div>

        <div className="grid gap-8 py-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-3">
            {RATING_DISTRIBUTION.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[70px_1fr_44px] items-center gap-3">
                <span className="text-sm text-[#6B7890]">{label}</span>
                <div className="h-2 overflow-hidden rounded-full bg-[#EEF2F6]">
                  <div
                    className="h-full rounded-full bg-[#EAF24D]"
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="text-right text-sm font-medium text-[#071426]">
                  {value < 1 ? "<1%" : `${value}%`}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {CATEGORY_RATINGS.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-[#E1E7F0] bg-[#F5F7FA] p-4">
                <p className="text-sm text-[#6B7890]">{label}</p>
                <p className="mt-1 text-2xl font-semibold text-[#071426]">
                  {value.toFixed(1)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 border-t border-[#E1E7F0] pt-6">
          {DISH_REVIEWS.map((review) => {
            const initials = review.author
              .split(" ")
              .map((part) => part[0])
              .join("");

            return (
              <article
                key={review.id}
                className="grid gap-4 rounded-[24px] bg-[#F8FAFC] p-5 md:grid-cols-[48px_1fr]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#071426] text-sm font-semibold text-white">
                  {initials}
                </div>
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-[#071426]">
                        {review.author}
                      </h3>
                      <p className="mt-1 text-sm text-[#8A96A8]">
                        {review.time}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#EAF24D] px-3 py-1.5 text-sm font-semibold text-[#071426]">
                      {review.rating.toFixed(1)} ★
                    </span>
                  </div>
                  <p className="mt-3 text-base leading-[150%] text-[#39445A]">
                    {review.text}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <button
          type="button"
          className="mt-6 rounded-full border border-[#E1E7F0] px-6 py-3 text-sm font-semibold text-[#071426] transition hover:border-[#071426] hover:bg-[#F5F7FA]"
        >
          See all {dish.reviews} reviews
        </button>
      </article>
    </section>
  );
}
