import { useTranslation } from "react-i18next";
import { SectionLabel } from "../components/SectionLabel";

export function AboutMethodology() {
  const { t } = useTranslation();
  const benefits = t("about.methodology.benefits", { returnObjects: true });

  return (
    <section className="about-section about-methodology">
      <div className="about-methodology__container">
        <SectionLabel>{t("about.methodology.label")}</SectionLabel>

        <div className="about-methodology__content">
          <div className="about-methodology__column">
            <h2 className="about-methodology__heading">
              {t("about.methodology.buildTitle")}
            </h2>

            <div className="about-methodology__text">
              <p>{t("about.methodology.buildTextFirst")}</p>
              <p>{t("about.methodology.buildTextSecond")}</p>
            </div>
          </div>

          <div className="about-methodology__column about-methodology__column--right">
            <h2 className="about-methodology__heading">
              {t("about.methodology.worksTitle")}
            </h2>

            <div className="about-methodology__text">
              <p>{t("about.methodology.worksTextFirst")}</p>
              <p>{t("about.methodology.worksTextSecond")}</p>
            </div>

            <ul className="about-methodology__list">
              {benefits.map((benefit) => (
                <li key={benefit}>• {benefit}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="about-methodology__decor-circle-filled"></div>
        <div className="about-methodology__decor-circle-outline"></div>
        <div className="about-methodology__decor-square-outline"></div>

        <div className="about-methodology__footer">
          <p className="about-methodology__statement">
            {t("about.methodology.statement")}
          </p>
        </div>
      </div>
    </section>
  );
}
