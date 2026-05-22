import { useTranslation } from "react-i18next";

import { SectionLabel } from "../components/SectionLabel";
import { TechStackGroup } from "../components/TechStackGroup";
import { techStack } from "../const";

export function AboutTechStack() {
  const { t } = useTranslation();

  return (
    <section className="about-section about-stack">
      <div className="about-stack__grid">
        <div>
          <SectionLabel>{t("about.stack.label")}</SectionLabel>
          <h2>{t("about.stack.title")}</h2>
          <p>{t("about.stack.description")}</p>
        </div>

        <div className="about-stack__groups">
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
