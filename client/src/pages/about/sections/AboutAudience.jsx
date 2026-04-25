import { useTranslation } from "react-i18next";

import { NeedList } from "../components/NeedList";
import { SectionLabel } from "../components/SectionLabel";
import { audienceNeeds, restaurantNeeds } from "../const";

export function AboutAudience() {
  const { t } = useTranslation();
  const translateNeed = (group, key) => t(`about.audience.${group}.items.${key}`);

  return (
    <section className="px-4 pb-24 md:px-8">
      <div className="mb-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div>
          <SectionLabel>{t("about.audience.label")}</SectionLabel>
          <h2 className="mt-4 text-[56px] font-normal leading-none tracking-[-0.05em] md:text-[96px]">
            {t("about.audience.title")}
          </h2>
        </div>
        <p className="pt-13 text-[18px] leading-[150%] text-[#3A4656]">
          {t("about.audience.intro")}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
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
