import { Trans, useTranslation } from "react-i18next";

import { SectionLabel } from "../components/SectionLabel";

export function AboutMission() {
  const { t } = useTranslation();

  return (
    <section className="px-4 pb-24 md:px-8">
      <div className="border-b border-[#DDE3EA] pb-24 pt-8">
        <SectionLabel>{t("about.mission.label")}</SectionLabel>
        <h2 className="whitespace-nowrap text-[42px] font-normal leading-none tracking-[-0.05em] xl:text-[56px]">
          {t("about.mission.title")}
        </h2>
        <div className="mt-8 grid max-w-210 gap-8 text-[15px] leading-[145%] text-[#7A828D] lg:ml-[calc(42%-110px)]">
          <p className="md:indent-27.5">
            <Trans
              i18nKey="about.mission.firstText"
              components={{
                strong: <strong className="font-semibold text-[#6B727C]" />,
              }}
            />
          </p>
          <p className="md:indent-27.5">{t("about.mission.secondText")}</p>
        </div>
      </div>
    </section>
  );
}
