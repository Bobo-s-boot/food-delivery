export function DeliveryStats({ t, stats }) {
  return (
    <section className="mt-16 grid w-full max-w-[1692px] grid-cols-1 gap-6 md:grid-cols-3">
      {stats.map((stat) => (
        <article
          key={stat.value || stat.valueKey}
          className="rounded-[32px] bg-[#F3F4F6] p-8"
        >
          <h2 className="text-[32px] font-medium tracking-[-0.04em] text-black">
            {stat.value || t(stat.valueKey)}
          </h2>
          <p className="mt-3 text-base leading-[150%] text-[#4B5563]">
            {t(stat.labelKey)}
          </p>
        </article>
      ))}
    </section>
  );
}
