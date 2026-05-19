import { useState } from "react";
import { DELIVERY_NOTES, DISH_REVIEWS } from "../const";

function AccordionItem({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="overflow-hidden rounded-3xl border border-[#E8EAF0] bg-white">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition hover:bg-[#F8FAFC]"
      >
        <span className="text-base font-medium text-[#0F1316]">{title}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D8DDE7] text-xl text-[#0D1A2D]">
          {isOpen ? "-" : "+"}
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-[#E8EAF0] px-6 py-5 text-sm leading-[155%] text-[#5F6878]">
          {children}
        </div>
      )}
    </section>
  );
}

export function DishAccordion({ dish }) {
  return (
    <div className="mt-6 grid gap-4">
      <AccordionItem title="Ingredients" defaultOpen>
        <p>{dish.ingredients}</p>
      </AccordionItem>

      <AccordionItem title="Delivery details">
        <ul className="grid gap-2">
          {DELIVERY_NOTES.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </AccordionItem>

      <AccordionItem title={`Reviews (${dish.reviews})`}>
        <div className="grid gap-5">
          <div>
            <p className="text-2xl font-medium tracking-[-0.03em] text-[#0D1A2D]">
              {dish.rating.toFixed(1)} overall rating
            </p>
            <p className="mt-1 text-[#8F9BB1]">Based on customer feedback</p>
          </div>

          {DISH_REVIEWS.map((review) => (
            <article key={review.id} className="border-t border-[#E8EAF0] pt-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-medium text-[#0F1316]">{review.author}</h3>
                <span className="text-xs text-[#8F9BB1]">{review.time}</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-[#0D1A2D]">
                {review.rating.toFixed(1)} rating
              </p>
              <p className="mt-2">{review.text}</p>
            </article>
          ))}
        </div>
      </AccordionItem>
    </div>
  );
}
