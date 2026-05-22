import { CatalogSearch } from "./CatalogSearch";
import { CatalogTab } from "./CatalogTab";
import "./CatalogFilters.scss";

export function CatalogFilters({
  categories,
  activeCategory,
  searchQuery,
  searchPlaceholder,
  description,
  onCategorySelect,
  onSearchChange,
}) {
  return (
    <div className="catalog-filters">
      <div className="catalog-filters__container">
        {/* Этот div получает класс __controls, и благодаря SCSS выстраивает внутри себя колонку */}
        <div className="catalog-filters__controls">
          <CatalogTab
            categories={categories}
            activeCategory={activeCategory}
            onCategorySelect={onCategorySelect}
          />
          <CatalogSearch
            value={searchQuery}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
          />
        </div>

        {/* А этот div уезжает вправо на больших экранах */}
        <div className="catalog-filters__description">
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}
