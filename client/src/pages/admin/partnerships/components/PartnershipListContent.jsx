import { RotateCcw, Search } from "lucide-react";
import { EmptyState, PageControls } from "../../components/engagement/EngagementPrimitives";
import { EngagementSelect } from "../../components/engagement/EngagementSelect";
import { EngagementTable, RecordLink } from "../../components/engagement/EngagementTable";
import { partnershipStatuses } from "../../hiring/engagementLabels";
import { formatSubmissionDate, formatSubmissionTime } from "../../hiring/hiring.utils";

export function PartnershipListFilters({ q, status, city, data, hasFilters, update, setParams }) {
  return (
    <div className="engagement-filters" aria-label="Inquiry filters">
        <div className="engagement-search">
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            aria-label="Search inquiries"
            placeholder="Restaurant, city, or contact…"
            value={q}
            onChange={(event) => update("q", event.target.value)}
          />
        </div>
        <EngagementSelect
          id="inquiry-status"
          label="Status"
          value={status}
          active={!!status}
          options={[
            { value: "", label: "All statuses" },
            ...Object.entries(partnershipStatuses).map(([value, label]) => ({
              value,
              label,
            })),
          ]}
          onChange={(value) => update("status", value)}
        />
        <EngagementSelect
          id="inquiry-city"
          label="City"
          value={city}
          active={!!city}
          searchable
          options={[
            { value: "", label: "All cities" },
            ...[...new Set(data.partnerships.map((item) => item.city))]
              .sort()
              .map((value) => ({ value, label: value })),
          ]}
          onChange={(value) => update("city", value)}
        />
        {hasFilters && (
          <button
            className="engagement-reset"
            type="button"
            onClick={() => setParams({}, { replace: true })}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        )}
      </div>
  );
}

export function PartnershipListResults({ records, page, base, location, data, setParams, update }) {
  return (
    <>
{records.length ? (
        <EngagementTable
          columns={["Restaurant", "City", "Contact", "Submitted", "Status"]}
          rows={records.slice((page - 1) * 15, page * 15)}
          renderRow={(item) => (
            <tr key={item._id}>
              <td className="admin-table__cell">
                <RecordLink
                  to={`${base}/${item._id}`}
                  state={{ listSearch: location.search }}
                >
                  {item.restaurant_name}
                </RecordLink>
              </td>
              <td className="admin-table__cell">{item.city}</td>
              <td className="admin-table__cell">{item.contact_name}</td>
              <td className="admin-table__cell hiring-date">
                {formatSubmissionDate(item.createdAt)}{" "}
                <span className="hiring-inline-time">
                  {formatSubmissionTime(item.createdAt)}
                </span>
              </td>
              <td className="admin-table__cell">
                <span className={`hiring-badge hiring-badge--${item.status}`}>
                  {partnershipStatuses[item.status]}
                </span>
              </td>
            </tr>
          )}
        />
      ) : (
        <EmptyState
          title={
            data.partnerships.length
              ? "No matching inquiries"
              : "No inquiries yet"
          }
          description={
            data.partnerships.length
              ? "Try another search or reset your filters."
              : "Restaurant inquiries will appear here when submitted."
          }
        >
          {!!data.partnerships.length && (
            <button type="button" onClick={() => setParams({})}>
              Reset filters
            </button>
          )}
        </EmptyState>
      )}
      {records.length > 15 && (
        <PageControls
          page={page}
          total={records.length}
          onChange={(value) => update("page", String(value))}
        />
      )}
    </>
  );
}
