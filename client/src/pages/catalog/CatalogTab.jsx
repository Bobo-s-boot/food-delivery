import "./CatalogTab.scss";

export function CatalogTab({ categories, activeCategory, onCategorySelect }) {
  return (
    <div className="catalog-tab">
      {categories.map((category) => (
        <button
          key={category.key}
          onClick={() => onCategorySelect(category.key)}
          className={`catalog-tab__button ${
            activeCategory === category.key ? "catalog-tab__button--active" : ""
          }`}
          type="button"
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
