import { AdminCard } from "../../components/AdminCard";
import { AdminSelect } from "../../components/ui/AdminSelect/AdminSelect";

const getToneClass = (value) =>
  `admin-finance-tone--${String(value || "all")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

export function FinanceFilters({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  selects = [],
  chips = [],
  statusValue,
  onStatusChange,
  embedded = false,
}) {
  const content = (
    <>
      <div className="admin-finance-filters__top">
        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="admin-finance-filters__search"
        />
        {selects.map((select) => (
          <AdminSelect
            key={select.label}
            value={select.value}
            onChange={(event) => select.onChange(event.target.value)}
            aria-label={select.label}
          >
            {select.options.map((option) => (
              <option
                key={typeof option === "string" ? option : option.value}
                value={typeof option === "string" ? option : option.value}
              >
                {typeof option === "string" ? option : option.label}
              </option>
            ))}
          </AdminSelect>
        ))}
      </div>
      {chips.length > 0 && (
        <div className="admin-finance-filters__status-row">
          <span className="admin-finance-filters__status-label">Status</span>
          <div className="admin-finance-filters__chips">
            {chips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => onStatusChange(chip)}
                className={`admin-finance-filters__chip ${getToneClass(chip)} ${
                  statusValue === chip ? "admin-finance-filters__chip--active" : ""
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );

  if (embedded) {
    return (
      <div className="admin-finance-filters admin-finance-filters--embedded">
        {content}
      </div>
    );
  }

  return <AdminCard className="admin-finance-filters">{content}</AdminCard>;
}
