export function SpecialsHero({ t }) {
  return (
    <section className="specials-hero">
      <img
        src="/img/backgroundImage.png"
        alt={t("specials.hero.imageAlt")}
        className="specials-hero__bg"
      />

      <div className="specials-hero__overlay" />
      <div className="specials-hero__content">
        <span className="specials-hero__badge">{t("specials.hero.badge")}</span>

        <div className="specials-hero__group">
          <div className="specials-hero__copy">
            <h1 className="specials-hero__title">{t("specials.hero.title")}</h1>
            <p className="specials-hero__text">
              {t("specials.hero.description")}
            </p>
          </div>

          <button className="specials-hero__button">
            {t("specials.hero.button")}
          </button>
        </div>
      </div>
    </section>
  );
}
