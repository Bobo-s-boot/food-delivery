export function SpecialsPromo({ t }) {
  return (
    <section className="mt-16 grid w-full max-w-[1692px] grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="relative min-h-115 overflow-hidden rounded-[40px] bg-[#0D1A2D] p-8 md:p-12 text-white">
        <img
          src="/img/Image_Rest1.png"
          alt={t("specials.featured.imageAlt")}
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-[#0D1A2D]/45" />
        <div className="relative z-10 flex h-full max-w-150 flex-col justify-end">
          <span className="mb-5 w-max rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur-md">
            {t("specials.featured.badge")}
          </span>
          <h2 className="text-[40px] md:text-[56px] font-normal leading-none tracking-[-0.04em]">
            {t("specials.featured.title")}
          </h2>
          <p className="mt-5 text-lg leading-[150%] text-white/90">
            {t("specials.featured.description")}
          </p>
          <p className="mt-6 text-sm text-white/75">
            {t("specials.featured.conditions")}
          </p>
          <button className="mt-8 h-12 w-max rounded-full border border-white px-7 text-lg transition hover:bg-white hover:text-black">
            {t("specials.featured.button")}
          </button>
        </div>
      </div>

      <div className="rounded-[40px] bg-[#F3F4F6] p-8 md:p-12">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#6B7280]">
          {t("specials.student.label")}
        </p>
        <h2 className="mt-5 text-[36px] md:text-[48px] font-normal leading-none tracking-[-0.04em] text-black">
          {t("specials.student.title")}
        </h2>
        <p className="mt-5 text-base leading-[150%] text-[#4B5563]">
          {t("specials.student.description")}
        </p>
        <button className="mt-8 h-12 rounded-full bg-[#0D1A2D] px-7 text-base text-white transition hover:bg-black">
          {t("specials.student.button")}
        </button>
      </div>
    </section>
  );
}
