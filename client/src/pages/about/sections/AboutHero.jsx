import { useTranslation } from "react-i18next";

import { SectionLabel } from "../components/SectionLabel";

export function AboutHero() {
  const { t } = useTranslation();

  return (
    <section className="about-hero">
      <div className="about-hero__decor">DEFILICIOUS</div>

      <div className="about-hero__content">
        <div className="about-hero__row about-hero__row--top">
          <div className="about-hero__panel">
            <SectionLabel>{t("about.hero.label")}</SectionLabel>
            <p>{t("about.hero.aside")}</p>
          </div>

          <div className="about-hero__panel about-hero__panel--lead">
            <h1>{t("about.hero.title")}</h1>
            <div className="about-hero__summary">
              <p className="about-hero__lead">{t("about.hero.lead")}</p>
              <p className="about-hero__description">
                {t("about.hero.description")}
              </p>
            </div>
          </div>
        </div>

        <div className="about-hero__row about-hero__row--bottom">
          <div className="about-hero__stats">
            <div className="about-hero__stat">
              <h2>{t("about.hero.clientsTitle")}</h2>
              <p>{t("about.hero.clientsText")}</p>
            </div>
            <div className="about-hero__stat">
              <h2>{t("about.hero.restaurantsTitle")}</h2>
              <p>{t("about.hero.restaurantsText")}</p>
            </div>
          </div>

          <div className="about-hero__image">
            <img src="/img/backgroundImage.png" alt="about background" />
          </div>
        </div>
      </div>
    </section>
  );
}
