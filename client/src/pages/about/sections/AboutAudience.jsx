import { useTranslation } from "react-i18next";

import { NeedList } from "../components/NeedList";
import { SectionLabel } from "../components/SectionLabel";
import { audienceNeeds, restaurantNeeds } from "../const";

export function AboutAudience() {
  const { t } = useTranslation();
  const translateNeed = (group, key) =>
    t(`about.audience.${group}.items.${key}`);

  return (
    <section className="about-section about-audience">
      <div className="about-audience__intro">
        <div>
          <SectionLabel>{t("about.audience.label")}</SectionLabel>
          <h2>{t("about.audience.title")}</h2>
        </div>
        <p>{t("about.audience.intro")}</p>
      </div>

      <div className="about-audience__grid">
        <NeedList
          title={t("about.audience.usersTitle")}
          items={audienceNeeds.map((key) => translateNeed("users", key))}
        />
        <NeedList
          title={t("about.audience.restaurantsTitle")}
          items={restaurantNeeds.map((key) =>
            translateNeed("restaurants", key),
          )}
        />
      </div>
    </section>
  );
}
