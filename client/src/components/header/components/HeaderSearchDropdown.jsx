import { HeaderSearchResult } from "./HeaderSearchResult.jsx";

export function HeaderSearchDropdown({
  results,
  isLoading,
  onSelect,
  translate,
}) {
  return (
    <div className="header__dropdown">
      {isLoading ? (
        <div className="header__dropdown-empty">Loading...</div>
      ) : results.length > 0 ? (
        results.map((item) => (
          <HeaderSearchResult
            key={`${item.type}-${item.id}`}
            item={item}
            onSelect={onSelect}
            translate={translate}
          />
        ))
      ) : (
        <div className="header__dropdown-empty">Nothing found</div>
      )}
    </div>
  );
}
