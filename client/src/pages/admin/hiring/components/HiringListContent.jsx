import { Link } from "react-router-dom";
import { ExternalLink, RotateCcw, Search } from "lucide-react";
import { applicationStatuses, vacancyStatuses } from "../engagementLabels";
import { EmptyState, PageControls } from "../../components/engagement/EngagementPrimitives";
import { EngagementSelect } from "../../components/engagement/EngagementSelect";
import { EngagementTable, RecordLink } from "../../components/engagement/EngagementTable";
import { formatSubmissionDate } from "../hiring.utils";

export function HiringListFilters({ params, candidates, statuses, departments, cities, vacancyOptions, hasFilters, update, setParams }) {
  const select = (key, label, entries, searchable = false) => (
    <EngagementSelect
      id={`filter-${key}`}
      label={label}
      value={params.get(key) || ""}
      options={[
        { value: "", label: `All ${label.toLowerCase()}` },
        ...entries.map(([value, label]) => ({ value, label })),
      ]}
      active={!!params.get(key)}
      searchable={searchable}
      onChange={(value) => update(key, value)}
    />
  );
  return (
    <div
          className="engagement-filters"
          aria-label={candidates ? "Candidate filters" : "Vacancy filters"}
        >
          <div className="engagement-search">
            <Search size={17} aria-hidden="true" />
            <input
              type="search"
              aria-label={candidates ? "Search candidates" : "Search vacancies"}
              placeholder={
                candidates ? "Search name or vacancy…" : "Search vacancy title…"
              }
              value={params.get("q") || ""}
              onChange={(event) => update("q", event.target.value)}
            />
          </div>
          {select("status", "Statuses", Object.entries(statuses))}
          {candidates ? (
            <>
              {select("kind", "Teams", [
                ["courier", "Couriers"],
                ["team", "Core team"],
              ])}
              {select(
                "vacancy",
                "Vacancies",
                vacancyOptions.map((item) => [item._id, item.title]),
                true,
              )}
              {params.get("kind") === "courier" &&
                select(
                  "city",
                  "Cities",
                  cities.map((item) => [item, item]),
                  true,
                )}
            </>
          ) : (
            select(
              "department",
              "Departments",
              departments.map((item) => [item, item]),
              true,
            )
          )}
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

export function HiringListResults({ candidates, filtered, page, base, listState, data, items, setParams, update }) {
  return (
    <>
{filtered.length ? (
          <EngagementTable
            columns={
              candidates
                ? ["Candidate", "Vacancy", "Submitted", "Status"]
                : [
                    "Vacancy",
                    "Department",
                    "City",
                    "Status",
                    "Candidates",
                    "Updated",
                    "Actions",
                  ]
            }
            rows={filtered.slice((page - 1) * 15, page * 15)}
            renderRow={(item) =>
              candidates ? (
                <tr key={item._id}>
                  <td className="admin-table__cell">
                    <RecordLink
                      to={`${base}/applications/${item._id}`}
                      state={listState}
                    >
                      {item.applicant_name}
                    </RecordLink>
                  </td>
                  <td className="admin-table__cell">{item.vacancy_title}</td>
                  <td className="admin-table__cell hiring-date">
                    {formatSubmissionDate(item.createdAt)}
                  </td>
                  <td className="admin-table__cell">
                    <span
                      className={`hiring-badge hiring-badge--${item.application_status}`}
                    >
                      {applicationStatuses[item.application_status]}
                    </span>
                  </td>
                </tr>
              ) : (
                <tr key={item._id}>
                  <td className="admin-table__cell">
                    <RecordLink
                      to={`${base}/vacancies/${item._id}`}
                      state={listState}
                    >
                      {item.title}
                      {item.has_unpublished_changes && <small className="hiring-list-update">Unpublished changes</small>}
                    </RecordLink>
                  </td>
                  <td className="admin-table__cell">{item.department}</td>
                  <td className="admin-table__cell">{item.city || "—"}</td>
                  <td className="admin-table__cell">
                    <span
                      className={`hiring-badge hiring-badge--${item.publication_status}`}
                    >
                      {vacancyStatuses[item.publication_status]}
                    </span>
                  </td>
                  <td className="admin-table__cell">
                    <Link
                      className="engagement-inline-link"
                      to={`${base}/applications?vacancy=${item._id}`}
                      aria-label={`View candidates for ${item.title}`}
                    >
                      {
                        data.applications.filter(
                          (application) => application.vacancy_id === item._id,
                        ).length
                      }
                    </Link>
                  </td>
                  <td className="admin-table__cell hiring-date">
                    {formatSubmissionDate(item.updatedAt)}
                  </td>
                  <td className="admin-table__cell">
                    <div className="engagement-row-actions">
                      <Link
                        className="engagement-row-action"
                        to={`${base}/vacancies/${item._id}`}
                        state={listState}
                      >
                        Edit
                      </Link>
                      {["published", "draft"].includes(item.publication_status) && (
                        <Link
                          className="engagement-row-action engagement-row-action--quiet"
                          to={`/careers/${item.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.publication_status === "draft" ? "Preview draft" : "View page"}
                          <ExternalLink size={14} aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )
            }
          />
        ) : (
          <EmptyState
            title={
              items.length
                ? "No matching records"
                : candidates
                  ? "No applications yet"
                  : "No vacancies yet"
            }
            description={
              items.length
                ? "Try another search or reset your filters."
                : candidates
                  ? "New applications will appear here when candidates apply."
                  : "Create your first vacancy to start hiring."
            }
          >
            {items.length ? (
              <button type="button" onClick={() => setParams({})}>
                Reset filters
              </button>
            ) : (
              !candidates && (
                <Link className="hiring-button" to={`${base}/vacancies/new`}>
                  Create vacancy
                </Link>
              )
            )}
          </EmptyState>
        )}
        {filtered.length > 15 && (
          <PageControls
            page={page}
            total={filtered.length}
            onChange={(value) => update("page", String(value))}
          />
        )}
    </>
  );
}
