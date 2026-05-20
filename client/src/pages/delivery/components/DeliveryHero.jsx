import "../Delivery.scss";

export function DeliveryHero({ t }) {
  return (
    <section className="delivery-hero">
      <img
        src="/img/menu_background.png"
        alt={t("delivery.hero.imageAlt")}
        className="delivery-hero__bg"
      />

      <div className="delivery-hero__overlay" />

      <div className="delivery-hero__content">
        <span className="delivery-hero__badge">{t("delivery.hero.badge")}</span>

        <div className="delivery-hero__group">
          <div className="delivery-hero__text">
            <h1 className="delivery-hero__title">{t("delivery.hero.title")}</h1>
            <p className="delivery-hero__description">
              {t("delivery.hero.description")}
            </p>
          </div>

          <div className="delivery-hero__actions">
            <button className="delivery-hero__btn-primary">
              {t("delivery.hero.primaryButton")}
            </button>
            <button className="delivery-hero__btn-secondary">
              {t("delivery.hero.secondaryButton")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
