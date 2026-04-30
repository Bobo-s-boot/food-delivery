export function DeliveryOptions({ t, options }) {
  return (
    <section className="mt-24 w-full max-w-[1692px]">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <h2 className="max-w-160 text-[40px] md:text-[56px] font-normal leading-none tracking-[-0.04em] text-black">
          {t("delivery.optionsTitle")}
        </h2>
        <p className="max-w-160 text-base leading-[150%] text-[#4B5563]">
          {t("delivery.optionsDescription")}
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {options.map((option) => (
          <article
            key={option.titleKey}
            className="rounded-[32px] border border-[#EDECF1] bg-white p-8 shadow-sm"
          >
            <h3 className="text-2xl font-medium tracking-[-0.03em] text-black">
              {t(option.titleKey)}
            </h3>
            <p className="mt-3 min-h-12 text-base leading-[150%] text-[#4B5563]">
              {t(option.textKey)}
            </p>
            <span className="mt-8 inline-flex rounded-full bg-[#0D1A2D] px-4 py-2 text-sm text-white">
              {t(option.metaKey)}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
