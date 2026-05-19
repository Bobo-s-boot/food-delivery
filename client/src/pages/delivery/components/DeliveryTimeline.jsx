import "../Delivery.scss";

export function DeliveryTimeline({ t, steps }) {
  return (
    <section className="delivery-timeline">
      <div className="delivery-timeline__intro">
        <p>{t("delivery.timeline.label")}</p>
        <h2>{t("delivery.timeline.title")}</h2>
        <p>{t("delivery.timeline.description")}</p>
      </div>

      <div className="delivery-timeline__steps">
        {steps.map((step, index) => (
          <article key={step.titleKey} className="delivery-step">
            <span className="delivery-step__marker">{index + 1}</span>
            <div>
              <h3 className="delivery-step__title">{t(step.titleKey)}</h3>
              <p className="delivery-step__text">{t(step.textKey)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
