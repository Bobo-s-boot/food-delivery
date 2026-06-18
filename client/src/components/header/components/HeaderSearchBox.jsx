import searchIcon from "../../../assets/search.svg";

export function HeaderSearchBox({ value, onChange, onFocus, placeholder }) {
  return (
    <div className="header__search-box">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        className="header__search-input"
      />
      <img src={searchIcon} alt="Search" className="header__search-icon" />
    </div>
  );
}
