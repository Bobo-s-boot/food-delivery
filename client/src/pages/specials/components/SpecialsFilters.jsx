export function SpecialsFilters({ t, filters, activeFilter, onFilterChange }) {
  return (
    <section className="mt-20 w-full max-w-[1692px]">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-[40px] md:text-[56px] font-normal leading-none tracking-[-0.04em] text-black">
            {t("specials.filtersTitle")}
          </h2>
          <p className="mt-5 max-w-180 text-base leading-[150%] text-[#4B5563]">
            {t("specials.filtersDescription")}
          </p>
        </div>

        <div className="flex max-w-210 flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => onFilterChange(filter.key)}
              className={`rounded-lg border border-black px-4 py-2 text-base font-medium transition ${
                activeFilter === filter.key
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              {t(filter.labelKey)}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
