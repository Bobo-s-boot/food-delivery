export function DeliveryTimeline({ t, steps }) {
  return (
    <section className="mt-24 grid w-full max-w-[1692px] grid-cols-1 gap-10 xl:grid-cols-[0.8fr_1.2fr]">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#6B7280]">
          {t("delivery.timeline.label")}
        </p>
        <h2 className="mt-5 text-[40px] md:text-[56px] font-normal leading-none tracking-[-0.04em] text-black">
          {t("delivery.timeline.title")}
        </h2>
        <p className="mt-5 max-w-140 text-base leading-[150%] text-[#4B5563]">
          {t("delivery.timeline.description")}
        </p>
      </div>

      <div className="rounded-[40px] bg-[#0D1A2D] p-6 md:p-10">
        <div className="grid grid-cols-1 gap-4">
          {steps.map((step, index) => (
            <article
              key={step.titleKey}
              className="grid grid-cols-[auto_1fr] gap-5 rounded-[24px] bg-white/8 p-5 text-white"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-base font-medium text-[#0D1A2D]">
                {index + 1}
              </span>
              <div>
                <h3 className="text-xl font-medium tracking-[-0.03em]">
                  {t(step.titleKey)}
                </h3>
                <p className="mt-2 text-sm leading-[150%] text-white/70">
                  {t(step.textKey)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
