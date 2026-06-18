export function HeaderSearchResult({ item, onSelect, translate }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item.route)}
      className="header__dropdown-item"
    >
      <div className="header__dropdown-title">{item.title}</div>
      <div className="header__dropdown-subtitle">
        {item.type === "restaurant"
          ? translate("nav.catalog")
          : `${translate("nav.menu")} - ${item.subtitle}`}
      </div>
    </button>
  );
}
