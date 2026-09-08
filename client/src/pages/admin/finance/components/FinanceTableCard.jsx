import { AdminCard } from "../../components/AdminCard";
import { SectionHeader } from "../../components/SectionHeader";

export function FinanceTableCard({
  title,
  description,
  children,
  emptyMessage,
  isEmpty,
  onClearFilters,
  state = "ready",
  onRetry,
  headerAction,
  toolbar,
  className = "",
}) {
  return (
    <AdminCard className={`admin-finance-table-card ${className}`.trim()}>
      <div className="admin-finance-table-card__header">
        <SectionHeader title={title} description={description} />
        {headerAction}
      </div>
      {toolbar}
      {state === "loading" && (
        <div className="admin-finance-state" role="status">
          <strong>Loading finance records...</strong>
          <span>Checking the selected period and filters.</span>
        </div>
      )}
      {state === "error" && (
        <div className="admin-finance-state" role="alert">
          <strong>Finance records could not be loaded</strong>
          <span>Check the connection and try again.</span>
          <button type="button" onClick={onRetry}>Retry</button>
        </div>
      )}
      {state === "ready" && !isEmpty && (
        <div className="admin-finance-table-card__table">{children}</div>
      )}
      {state === "ready" && isEmpty && (
        <div className="admin-finance-empty">
          <span>{emptyMessage}</span>
          {onClearFilters && <button type="button" onClick={onClearFilters}>Clear filters</button>}
        </div>
      )}
    </AdminCard>
  );
}
