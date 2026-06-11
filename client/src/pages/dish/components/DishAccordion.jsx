import { useState } from "react";
import { DELIVERY_NOTES, DISH_REVIEWS } from "../const";
import "./DishAccordion.scss";

function AccordionItem({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="dish-accordion-item">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="dish-accordion-item__header"
      >
        <span>{title}</span>
        <span className="dish-accordion-item__toggle">
          {isOpen ? "-" : "+"}
        </span>
      </button>

      {isOpen && <div className="dish-accordion-item__content">{children}</div>}
    </section>
  );
}

export function DishAccordion({ dish }) {
  return (
    <div className="dish-accordion">
      <AccordionItem title="Ingredients" defaultOpen>
        <p>{dish.ingredients}</p>
      </AccordionItem>

      <AccordionItem title="Delivery details">
        <ul className="dish-accordion-item__content">
          {DELIVERY_NOTES.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </AccordionItem>

      <AccordionItem title={`Reviews (${dish.reviews})`}>
        <div className="dish-accordion__reviews">
          <div className="dish-accordion__review-header">
            <p className="dish-accordion__rating-text">
              {dish.rating.toFixed(1)} overall rating
            </p>
            <p className="dish-accordion__rating-subtext">
              Based on customer feedback
            </p>
          </div>

          {DISH_REVIEWS.map((review) => (
            <article key={review.id} className="dish-accordion__review">
              <div className="dish-accordion__review-meta">
                <h3 className="dish-accordion__review-author">
                  {review.author}
                </h3>
                <span className="dish-accordion__review-time">
                  {review.time}
                </span>
              </div>
              <p className="dish-accordion__review-rating">
                {review.rating.toFixed(1)} rating
              </p>
              <p className="dish-accordion__review-text">{review.text}</p>
            </article>
          ))}
        </div>
      </AccordionItem>
    </div>
  );
}
