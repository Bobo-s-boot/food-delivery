import "../Delivery.scss";

export function DeliveryOptions({ t, options }) {
  return (
    <section className="delivery-options">
      <div className="delivery-options__intro">
        <h2>{t("delivery.optionsTitle")}</h2>
        <p>{t("delivery.optionsDescription")}</p>
      </div>

      <div className="delivery-option-list">
        {options.map((option) => (
          <article key={option.titleKey} className="delivery-option-card">
            <h3>{t(option.titleKey)}</h3>
            <p>{t(option.textKey)}</p>
            <span className="delivery-option-meta">{t(option.metaKey)}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
