export function CheckoutStep({
  step,
  isActive,
  isComplete,
  onToggle,
  children,
}) {
  return (
    <section className="checkout-step">
      <button
        type="button"
        onClick={onToggle}
        className="checkout-step__summary"
      >
        <div>
          <p className="checkout-step__eyebrow">{step.eyebrow}</p>
          <h2 className="checkout-step__title">{step.title}</h2>
          <p className="checkout-step__description">{step.summary}</p>
        </div>

        <span
          className={`checkout-step__toggle ${isActive ? "checkout-step__toggle--active" : ""}`}
        >
          {isComplete ? "✓" : isActive ? "-" : "+"}
        </span>
      </button>

      {isActive && <div className="checkout-step__content">{children}</div>}
    </section>
  );
}
