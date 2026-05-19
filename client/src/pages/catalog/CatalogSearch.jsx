import searchIcon from "../../assets/search.svg";
import "./CatalogSearch.scss";

export function CatalogSearch({ value, onChange, placeholder }) {
  return (
    <div className="catalog-search">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="catalog-search__input"
      />
      <img src={searchIcon} alt="Search" className="catalog-search__icon" />
    </div>
  );
}
