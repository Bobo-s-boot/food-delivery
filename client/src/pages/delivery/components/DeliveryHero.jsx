export function DeliveryHero({ t }) {
  return (
    <section className="relative w-full min-h-112.5 overflow-hidden rounded-[40px] lg:rounded-[64px] shadow-sm">
      <img
        src="/img/menu_background.png"
        alt={t("delivery.hero.imageAlt")}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[#0D1A2D]/55" />
      <div className="relative z-10 flex min-h-112.5 flex-col justify-end gap-8 p-8 text-white md:p-14 lg:p-20">
        <span className="w-max rounded-full border border-white/40 bg-white/15 px-5 py-2 text-sm backdrop-blur-md">
          {t("delivery.hero.badge")}
        </span>
        <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-200">
            <h1 className="text-[42px] md:text-[64px] font-normal leading-none tracking-[-0.04em]">
              {t("delivery.hero.title")}
            </h1>
            <p className="mt-5 max-w-190 text-base md:text-lg leading-[150%] text-white/90">
              {t("delivery.hero.description")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="h-12 rounded-full bg-white px-7 text-lg text-[#0D1A2D] transition hover:bg-[#F3F4F6]">
              {t("delivery.hero.primaryButton")}
            </button>
            <button className="h-12 rounded-full border-2 border-white px-7 text-lg text-white transition hover:bg-white hover:text-black">
              {t("delivery.hero.secondaryButton")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
