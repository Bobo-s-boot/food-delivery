import searchIcon from "../../../assets/search.svg";

export function HeaderSearchBox({ value, onChange, onFocus, placeholder, inputRef }) {
  return (
    <div className="header__search-box">
      <input
        ref={inputRef}
        type="text"
        aria-label={placeholder}
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
