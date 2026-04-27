import { useTranslation } from "react-i18next";

import { SectionLabel } from "../components/SectionLabel";
import { TeamCard } from "../components/TeamCard";
import { teamMembers } from "../const";

export function AboutTeam() {
  const { t } = useTranslation();

  return (
    <section className="bg-[#F4F6F8] px-4 py-24 md:px-8">
      <div className="mb-14">
        <SectionLabel>{t("about.team.label")}</SectionLabel>
        <h2 className="mt-4 text-[64px] font-normal leading-none tracking-[-0.05em] md:text-[120px]">
          {t("about.team.title")}
        </h2>
      </div>

      <div className="grid gap-12">
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
