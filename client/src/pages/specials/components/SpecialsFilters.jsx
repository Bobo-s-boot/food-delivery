export function SpecialsFilters({ t, filters, activeFilter, onFilterChange }) {
  return (
    <section className="specials-filters">
      <div className="specials-filters__header">
        <div>
          <h2 className="specials-filters__title">
            {t("specials.filtersTitle")}
          </h2>
          <p className="specials-filters__description">
            {t("specials.filtersDescription")}
          </p>
        </div>

        <div className="specials-filters__controls">
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => onFilterChange(filter.key)}
              className={`specials-filter-button ${
                activeFilter === filter.key
                  ? "specials-filter-button--active"
                  : ""
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
