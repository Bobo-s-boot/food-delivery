import { Trans, useTranslation } from "react-i18next";

import { SectionLabel } from "../components/SectionLabel";

export function AboutMission() {
  const { t } = useTranslation();

  return (
    <section className="about-section about-mission">
      <div className="about-mission__wrapper">
        <SectionLabel>{t("about.mission.label")}</SectionLabel>
        <h2>{t("about.mission.title")}</h2>
        <div className="about-mission__text">
          <p>
            <Trans
              i18nKey="about.mission.firstText"
              components={{
                strong: <strong className="about-mission__strong" />,
              }}
            />
          </p>
          <p>{t("about.mission.secondText")}</p>
        </div>
      </div>
    </section>
  );
}
