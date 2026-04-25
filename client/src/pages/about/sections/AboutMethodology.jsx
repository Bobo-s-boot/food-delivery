import { useTranslation } from "react-i18next";

import { SectionLabel } from "../components/SectionLabel";

export function AboutMethodology() {
  const { t } = useTranslation();
  const benefits = t("about.methodology.benefits", { returnObjects: true });

  return (
    <section className="bg-[#0D1A2D] pb-14">
      <div className="relative min-h-220 overflow-hidden bg-[#0D1A2D] p-8 text-white md:p-14 lg:p-18">
        <SectionLabel>{t("about.methodology.label")}</SectionLabel>

        <div className="relative z-10 mt-16 grid gap-12 lg:grid-cols-2">
          <div className="max-w-130">
            <h2 className="text-[56px] font-medium leading-none tracking-[-0.06em] text-white md:text-[76px] xl:text-[88px]">
              {t("about.methodology.buildTitle")}
            </h2>
            <div className="mt-8 grid gap-5 text-[18px] leading-[145%] text-white/55">
              <p>{t("about.methodology.buildTextFirst")}</p>
              <p>{t("about.methodology.buildTextSecond")}</p>
            </div>
          </div>

          <div className="max-w-130 lg:ml-auto">
            <h2 className="text-[56px] font-medium leading-none tracking-[-0.06em] text-white md:text-[76px] xl:text-[88px]">
              {t("about.methodology.worksTitle")}
            </h2>
            <div className="mt-8 grid gap-5 text-[18px] leading-[145%] text-white/55">
              <p>{t("about.methodology.worksTextFirst")}</p>
              <p>{t("about.methodology.worksTextSecond")}</p>
            </div>

            <ul className="mt-8 grid gap-2 text-[18px] leading-[145%] text-white/65">
              {benefits.map((benefit) => (
                <li key={benefit}>• {benefit}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pointer-events-none absolute -left-34 bottom-28 h-110 w-110 rounded-full bg-white"></div>
        <div className="pointer-events-none absolute bottom-28 left-44 h-110 w-110 rounded-full border border-white/45"></div>
        <div className="pointer-events-none absolute bottom-28 left-44 h-110 w-110 border border-white/45"></div>

        <div className="relative z-10 mt-56 flex justify-end">
          <p className="max-w-190 text-[56px] font-normal leading-[92%] tracking-[-0.06em] text-white md:text-[92px] xl:text-[116px]">
            {t("about.methodology.statement")}
          </p>
        </div>
      </div>
    </section>
  );
}
