import "./MenuCategoryList.scss";

export function MenuCategoryList({
  categories,
  activeCategory,
  getCategoryLabel,
  onCategorySelect,
}) {
  return (
    <div className="menu-category-list">
      {categories.map((category) => (
        <button
          key={category.key}
          onClick={() => onCategorySelect(category.key)}
          className={`menu-category-card ${
            activeCategory === category.key ? "menu-category-card--active" : ""
          }`}
          style={{ minWidth: 0 }}
        >
          <div
            className="menu-category-card__background"
            style={{ backgroundImage: `url(${category.imageUrl})` }}
          />
          <div className="menu-category-card__overlay" />
          <div
            className={
              "menu-category-card__title " +
              (activeCategory === category.key
                ? "menu-category-card__title--active"
                : "")
            }
          >
            {getCategoryLabel(category.key)}
          </div>
        </button>
      ))}
    </div>
  );
}
