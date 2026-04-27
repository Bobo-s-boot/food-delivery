import { useTranslation } from "react-i18next";

import { SectionLabel } from "../components/SectionLabel";
import { TechStackGroup } from "../components/TechStackGroup";
import { techStack } from "../const";

export function AboutTechStack() {
  const { t } = useTranslation();

  return (
    <section className="px-4 py-24 md:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionLabel>{t("about.stack.label")}</SectionLabel>
          <h2 className="mt-4 text-[56px] font-normal leading-none tracking-[-0.05em] md:text-[96px]">
            {t("about.stack.title")}
          </h2>
          <p className="mt-8 max-w-140 text-[18px] leading-[150%] text-[#3A4656]">
            {t("about.stack.description")}
          </p>
        </div>

        <div className="grid gap-6">
          {techStack.map((group) => {
            const translationKey = `about.stack.groups.${group.key}`;

            return (
              <TechStackGroup
                key={group.key}
                group={{
                  title: t(`${translationKey}.title`),
                  items: group.items.map((item) =>
                    t(`${translationKey}.items.${item}`),
                  ),
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
