export function DeliveryZonesAndOperations({ t, zones, operationItems }) {
  return (
    <section className="mt-24 grid w-full max-w-[1692px] grid-cols-1 gap-6 xl:grid-cols-[1fr_0.85fr]">
      <div className="rounded-[40px] bg-[#F3F4F6] p-6 md:p-10">
        <h2 className="text-[36px] md:text-[48px] font-normal leading-none tracking-[-0.04em] text-black">
          {t("delivery.zonesTitle")}
        </h2>
        <div className="mt-8 overflow-hidden rounded-[28px] bg-white">
          {zones.map((zone) => (
            <div
              key={zone.areaKey}
              className="grid grid-cols-1 gap-3 border-b border-[#EDECF1] p-5 last:border-b-0 md:grid-cols-3 md:items-center"
            >
              <span className="font-medium text-black">{t(zone.areaKey)}</span>
              <span className="text-[#4B5563]">{t(zone.timeKey)}</span>
              <span className="font-medium text-[#0D1A2D]">{t(zone.feeKey)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative min-h-115 overflow-hidden rounded-[40px] bg-[#0D1A2D] p-8 md:p-10 text-white">
        <img
          src="/img/ImageRest2.png"
          alt={t("delivery.restaurantLogic.imageAlt")}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-[#0D1A2D]/55" />
        <div className="relative z-10 flex h-full flex-col justify-end">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/70">
            {t("delivery.restaurantLogic.label")}
          </p>
          <h2 className="mt-5 text-[36px] md:text-[48px] font-normal leading-none tracking-[-0.04em]">
            {t("delivery.restaurantLogic.title")}
          </h2>
          <p className="mt-5 text-base leading-[150%] text-white/80">
            {t("delivery.restaurantLogic.description")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {operationItems.map((itemKey) => (
              <span
                key={itemKey}
                className="rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur-md"
              >
                {t(itemKey)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
