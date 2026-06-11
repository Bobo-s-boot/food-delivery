import { CATEGORY_RATINGS, DISH_REVIEWS, RATING_DISTRIBUTION } from "../const";

export function DishReviews({ dish }) {
  return (
    <section className="dish-reviews">
      <article className="dish-reviews__card">
        <div className="dish-reviews__header">
          <div>
            <p className="dish-reviews__eyebrow">Reviews</p>
            <h2 className="dish-reviews__title">What customers say</h2>
            <p className="dish-reviews__subtitle">Based on {dish.reviews} customer reviews</p>
          </div>

          <div className="dish-reviews__summary-card">
            <div className="dish-reviews__summary-score">
              <span className="dish-reviews__rating">{dish.rating.toFixed(1)}</span>
              <span className="dish-reviews__rating-label">overall rating</span>
            </div>
            <p className="dish-reviews__summary-text">
              Warm delivery, strong packaging, and consistent taste.
            </p>
          </div>
        </div>

        <div className="dish-reviews__charts">
          <div className="dish-reviews__distribution">
            {RATING_DISTRIBUTION.map(([label, value]) => (
              <div key={label} className="dish-reviews__distribution-row">
                <span className="dish-reviews__distribution-label">{label}</span>
                <div className="dish-reviews__distribution-bar">
                  <div className="dish-reviews__distribution-fill" style={{ width: `${value}%` }} />
                </div>
                <span className="dish-reviews__distribution-value">
                  {value < 1 ? "<1%" : `${value}%`}
                </span>
              </div>
            ))}
          </div>

          <div className="dish-reviews__category-grid">
            {CATEGORY_RATINGS.map(([label, value]) => (
              <div key={label} className="dish-reviews__category-card">
                <p className="dish-reviews__category-label">{label}</p>
                <p className="dish-reviews__category-score">{value.toFixed(1)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="dish-reviews__feed">
          {DISH_REVIEWS.map((review) => {
            const initials = review.author
              .split(" ")
              .map((part) => part[0])
              .join("");

            return (
              <article key={review.id} className="dish-reviews__item">
                <div className="dish-reviews__avatar">{initials}</div>
                <div>
                  <div className="dish-reviews__item-header">
                    <div>
                      <h3 className="dish-reviews__author">{review.author}</h3>
                      <p className="dish-reviews__time">{review.time}</p>
                    </div>
                    <span className="dish-reviews__rating-badge">{review.rating.toFixed(1)} ★</span>
                  </div>
                  <p className="dish-reviews__text">{review.text}</p>
                </div>
              </article>
            );
          })}
        </div>

        <button type="button" className="dish-button dish-button--secondary dish-button--wide">
          See all {dish.reviews} reviews
        </button>
      </article>
    </section>
  );
}
