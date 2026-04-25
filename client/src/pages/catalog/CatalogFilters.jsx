import { CatalogSearch } from "./CatalogSearch";
import { CatalogTab } from "./CatalogTab";

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
    <div className="w-full flex justify-center">
      <div className="flex flex-col lg:flex-row justify-between items-start w-full max-w-423 gap-30">
        <div className="flex flex-col gap-5 w-full max-w-211.25 items-start">
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

        <div className="w-full max-w-181.75 shrink-0 mt-0">
          <p className="text-[16px] font-normal leading-[140%] text-gray-800">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
