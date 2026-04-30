export function SpecialsHowItWorks({ t, steps }) {
  return (
    <section className="mt-24 w-full max-w-[1692px]">
      <h2 className="text-[40px] md:text-[56px] font-normal leading-none tracking-[-0.04em] text-black">
        {t("specials.stepsTitle")}
      </h2>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <article
            key={step.titleKey}
            className="rounded-[32px] bg-[#0D1A2D] p-8 text-white"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg font-medium text-[#0D1A2D]">
              {index + 1}
            </span>
            <h3 className="mt-8 text-2xl font-medium tracking-[-0.03em]">
              {t(step.titleKey)}
            </h3>
            <p className="mt-3 text-base leading-[150%] text-white/75">
              {t(step.textKey)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
