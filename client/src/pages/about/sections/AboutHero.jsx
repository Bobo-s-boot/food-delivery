import { useTranslation } from "react-i18next";

import { SectionLabel } from "../components/SectionLabel";

export function AboutHero() {
  const { t } = useTranslation();

  return (
    <section className="pb-24 pt-0">
      <div className="relative min-h-160 overflow-hidden border-y border-[#DDE3EA] bg-[#F7F8FA] px-0 py-8 md:min-h-180 lg:min-h-200">
        <div className="pointer-events-none absolute -left-6 -top-10 whitespace-nowrap text-[112px] font-semibold leading-[0.78] tracking-[-0.08em] text-[#0D1A2D] md:-left-10 md:-top-16 md:text-[220px] xl:-left-14 xl:-top-22 xl:text-[330px] 2xl:text-[390px]">
          DEFILICIOUS
        </div>

        <div className="relative z-10 flex min-h-140 flex-col justify-end gap-10 px-6 pb-8 pt-44 md:min-h-160 md:px-10 md:pt-60 lg:min-h-180 lg:px-16 lg:pt-72">
          <div className="grid gap-8 border-t border-[#0D1A2D] pt-8 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="flex min-h-36 flex-col justify-between gap-10">
              <SectionLabel>{t("about.hero.label")}</SectionLabel>
              <p className="max-w-80 text-[12px] leading-[150%] text-[#3A4656]">
                {t("about.hero.aside")}
              </p>
            </div>

            <div className="grid gap-8 border-[#0D1A2D] lg:grid-cols-[0.9fr_1.1fr] lg:border-l lg:pl-12">
              <h1 className="text-[48px] font-normal leading-[90%] tracking-[-0.06em] text-[#0D1A2D] md:text-[76px] xl:text-[104px]">
                {t("about.hero.title")}
              </h1>

              <div className="grid content-end gap-5">
                <p className="text-[24px] font-medium leading-[120%] tracking-[-0.04em] text-[#0D1A2D] md:text-[32px]">
                  {t("about.hero.lead")}
                </p>
                <p className="text-[16px] leading-[155%] text-[#3A4656]">
                  {t("about.hero.description")}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 border-t border-[#0D1A2D] pt-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-[28px] font-normal tracking-[-0.04em] text-[#0D1A2D]">
                  {t("about.hero.clientsTitle")}
                </h2>
                <p className="mt-4 text-[18px] leading-[150%] text-[#3A4656]">
                  {t("about.hero.clientsText")}
                </p>
              </div>

              <div>
                <h2 className="text-[28px] font-normal tracking-[-0.04em] text-[#0D1A2D]">
                  {t("about.hero.restaurantsTitle")}
                </h2>
                <p className="mt-4 text-[18px] leading-[150%] text-[#3A4656]">
                  {t("about.hero.restaurantsText")}
                </p>
              </div>
            </div>

            <div className="relative h-40 overflow-hidden rounded-4xl bg-[#0D1A2D] md:h-52">
              <img
                src="/img/backgroundImage.png"
                alt=""
                className="h-full w-full object-cover opacity-80"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
