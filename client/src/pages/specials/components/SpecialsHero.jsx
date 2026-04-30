export function SpecialsHero({ t }) {
  return (
    <section className="relative w-full min-h-112.5 rounded-[40px] lg:rounded-[64px] overflow-hidden shadow-sm">
      <img
        src="/img/backgroundImage.png"
        alt={t("specials.hero.imageAlt")}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative z-10 min-h-112.5 flex flex-col justify-end gap-8 p-8 md:p-14 lg:p-20 text-white">
        <span className="w-max rounded-full border border-white/40 bg-white/15 px-5 py-2 text-sm backdrop-blur-md">
          {t("specials.hero.badge")}
        </span>
        <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-190">
            <h1 className="text-[42px] md:text-[64px] font-normal leading-none tracking-[-0.04em]">
              {t("specials.hero.title")}
            </h1>
            <p className="mt-5 max-w-170 text-base md:text-lg leading-[150%] text-white/90">
              {t("specials.hero.description")}
            </p>
          </div>
          <button className="h-12 w-max rounded-full border-2 border-white px-7 text-lg text-white transition hover:bg-white hover:text-black">
            {t("specials.hero.button")}
          </button>
        </div>
      </div>
    </section>
  );
}
