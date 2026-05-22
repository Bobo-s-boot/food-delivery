import { DETAIL_CARDS } from "../const";

function DetailRows({ rows }) {
  return (
    <div className="dish-details__rows">
      {rows.map(([label, value]) => (
        <div key={label} className="dish-details__row">
          <span className="dish-details__row-label">{label}</span>
          <span className="dish-details__row-value">{value}</span>
        </div>
      ))}
    </div>
  );
}

export function DishProductDetails() {
  return (
    <section className="dish-details">
      <div className="dish-details__header">
        <div>
          <p className="dish-details__eyebrow">Product details</p>
          <h2 className="dish-details__title">Everything before you order</h2>
        </div>
        <p className="dish-details__subtitle">
          Clear ingredients, delivery timing, restaurant status, and nutrition
          notes before the burger goes into your cart.
        </p>
      </div>

      <div className="dish-details__grid">
        {DETAIL_CARDS.map((card) => (
          <article key={card.id} className="dish-details__card">
            <h3 className="dish-details__card-title">{card.title}</h3>

            {card.text && <p className="dish-details__card-text">{card.text}</p>}

            {card.chips && (
              <div className="dish-details__chips">
                {card.chips.map((chip) => (
                  <span key={chip} className="dish-details__chip">
                    {chip}
                  </span>
                ))}
              </div>
            )}

            {card.rows && <DetailRows rows={card.rows} />}

            {card.note && <p className="dish-details__note">{card.note}</p>}

            {card.action && (
              <button type="button" className="dish-button dish-button--secondary">
                {card.action}
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
