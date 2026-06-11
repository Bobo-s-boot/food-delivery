export function SpecialsPromo({ t }) {
  return (
    <section className="specials-promo">
      <div className="specials-promo__featured">
        <img
          src="/img/Image_Rest1.png"
          alt={t("specials.featured.imageAlt")}
          className="specials-promo__featured-bg"
        />
        <div className="specials-promo__featured-overlay" />
        <div className="specials-promo__featured-content">
          <span className="specials-promo__badge">
            {t("specials.featured.badge")}
          </span>
          <h2 className="specials-promo__title">
            {t("specials.featured.title")}
          </h2>
          <p className="specials-promo__text">
            {t("specials.featured.description")}
          </p>
          <p className="specials-promo__conditions">
            {t("specials.featured.conditions")}
          </p>
          <button className="specials-promo__button">
            {t("specials.featured.button")}
          </button>
        </div>
      </div>

      <div className="specials-promo__student">
        <p className="specials-promo__student-label">
          {t("specials.student.label")}
        </p>
        <h2 className="specials-promo__student-title">
          {t("specials.student.title")}
        </h2>
        <p className="specials-promo__student-text">
          {t("specials.student.description")}
        </p>
        <button className="specials-promo__student-button">
          {t("specials.student.button")}
        </button>
      </div>
    </section>
  );
}
