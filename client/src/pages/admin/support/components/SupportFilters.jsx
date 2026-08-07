import { AdminCard } from "../../components/AdminCard";
import { AdminSelect } from "../../components/ui/AdminSelect/AdminSelect";
import {
  supportIssueTypeFilters,
  supportPriorityFilters,
  supportSlaFilters,
  supportStatusFilters,
} from "../support.data";

const getToneClass = (value) =>
  `admin-support-tone--${String(value || "all")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

export function SupportFilters({ filters, onChange }) {
  return (
    <AdminCard className="admin-support-filters">
      <div className="admin-support-filters__top">
        <input
          type="search"
          value={filters.searchValue}
          onChange={(event) => onChange({ searchValue: event.target.value })}
          placeholder="Search by ticket ID, customer, order or restaurant..."
          className="admin-support-filters__search"
        />
        <AdminSelect
          value={filters.issueTypeFilter}
          onChange={(event) => onChange({ issueTypeFilter: event.target.value })}
          aria-label="Issue type filter"
        >
          {supportIssueTypeFilters.map((filter) => (
            <option key={filter} value={filter}>{filter}</option>
          ))}
        </AdminSelect>
        <AdminSelect
          value={filters.priorityFilter}
          onChange={(event) => onChange({ priorityFilter: event.target.value })}
          aria-label="Priority filter"
        >
          {supportPriorityFilters.map((filter) => (
            <option key={filter} value={filter}>{filter}</option>
          ))}
        </AdminSelect>
        <AdminSelect
          value={filters.slaFilter}
          onChange={(event) => onChange({ slaFilter: event.target.value })}
          aria-label="SLA filter"
        >
          {supportSlaFilters.map((filter) => (
            <option key={filter} value={filter}>{filter}</option>
          ))}
        </AdminSelect>
      </div>

      <div className="admin-support-filters__status-row">
        <span className="admin-support-filters__status-label">Status</span>
        <div className="admin-support-filters__chips">
          {supportStatusFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => onChange({ statusFilter: filter, resolvedTodayOnly: false })}
              aria-pressed={
                filters.statusFilter === filter && !filters.resolvedTodayOnly
              }
              className={`admin-support-filters__chip ${getToneClass(filter)} ${
                filters.statusFilter === filter && !filters.resolvedTodayOnly
                  ? "admin-support-filters__chip--active"
                  : ""
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </AdminCard>
  );
}
