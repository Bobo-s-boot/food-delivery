import "./MenuSearch.scss";
import searchIcon from "../../assets/search.svg";

export function MenuSearch({ value, onChange, placeholder }) {
  return (
    <div className="menu-search">
      <div className="menu-search__inner">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="menu-search__input"
        />
        <img src={searchIcon} alt="Search" className="menu-search__icon" />
      </div>
    </div>
  );
}
