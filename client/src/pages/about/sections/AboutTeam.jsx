import { useTranslation } from "react-i18next";

import { SectionLabel } from "../components/SectionLabel";
import { TeamCard } from "../components/TeamCard";
import { teamMembers } from "../const";

export function AboutTeam() {
  const { t } = useTranslation();

  return (
    <section className="about-section about-team">
      <div className="about-team__header">
        <SectionLabel>{t("about.team.label")}</SectionLabel>
        <h2>{t("about.team.title")}</h2>
      </div>

      <div className="about-team__list">
        {teamMembers.map((member, index) => {
          const translationKey = `about.team.members.${member.key}`;

          return (
            <TeamCard
              key={member.key}
              member={{
                ...member,
                name: t(`${translationKey}.name`),
                role: t(`${translationKey}.role`),
                summary: t(`${translationKey}.summary`),
                details: t(`${translationKey}.details`, {
                  returnObjects: true,
                }),
              }}
              index={index}
            />
          );
        })}
      </div>
    </section>
  );
}
