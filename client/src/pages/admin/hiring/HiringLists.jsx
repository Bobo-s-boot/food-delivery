import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { restoreHiringVacancy } from "../../../api/engagementService";
import { useHiringNotification } from "./HiringNotificationContext";
import { Plus } from "lucide-react";
import { AdminCard } from "../components/AdminCard";
import { applicationStatuses, vacancyStatuses } from "./engagementLabels";
import { EngagementHeading as HiringHeading } from "../components/engagement/EngagementPrimitives";
import { filterApplications, filterVacancies } from "./hiring.utils";
import { HiringListFilters, HiringListResults } from "./components/HiringListContent";

export function HiringLists({ data, base, candidates }) {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const notify = useHiringNotification();
  const [restoreError, setRestoreError] = useState("");
  const [restoring, setRestoring] = useState(false);
  const deleted = data.deletedVacancies?.[0];
  const update = (key, value) => {
    const next = new URLSearchParams(params);
    next.delete("candidate");
    value ? next.set(key, value) : next.delete(key);
    if (key !== "page") next.delete("page");
    if (key === "kind" && value !== "courier") next.delete("city");
    setParams(next, { replace: true });
  };
  const items = candidates ? data.applications : data.vacancies;
  const filtered = (
    candidates
      ? filterApplications(items, params)
      : filterVacancies(items, params)
  ).sort(
    (a, b) =>
      new Date(candidates ? b.createdAt : b.updatedAt) -
      new Date(candidates ? a.createdAt : a.updatedAt),
  );
  const page = Math.min(
    Math.max(1, Number(params.get("page")) || 1),
    Math.max(1, Math.ceil(filtered.length / 15)),
  );
  const hasFilters = [...params].some(
    ([key, value]) => !["page", "candidate"].includes(key) && value,
  );
  const statuses = candidates ? applicationStatuses : vacancyStatuses;
  const departments = [
    ...new Set(data.vacancies.map((item) => item.department).filter(Boolean)),
  ].sort();
  const cities = [
    ...new Set(
      data.applications
        .filter((item) => item.kind === "courier")
        .map((item) => item.city)
        .filter(Boolean),
    ),
  ].sort();
  const listState = { listSearch: location.search };
  const vacancyOptions = [...new Map([
    ...data.applications.filter((item) => item.vacancy_id).map((item) => [item.vacancy_id, { _id: item.vacancy_id, title: item.vacancy_title }]),
    ...data.vacancies.map((item) => [item._id, item]),
  ]).values()];
  return (
    <>
      <HiringHeading
        title={candidates ? "Candidates" : "Vacancies"}
        description={
          candidates
            ? "Review applications and follow up with your next teammates."
            : "Manage open roles and the candidates applying to them."
        }
      >
        {!candidates && (
          <Link
            className="hiring-button is-primary"
            to={`${base}/vacancies/new`}
          >
            <Plus size={16} aria-hidden="true" />
            Create vacancy
          </Link>
        )}
      </HiringHeading>
      <AdminCard>
        <HiringListFilters
          params={params}
          candidates={candidates}
          statuses={statuses}
          departments={departments}
          cities={cities}
          vacancyOptions={vacancyOptions}
          hasFilters={hasFilters}
          update={update}
          setParams={setParams}
        />
        <HiringListResults
          candidates={candidates}
          filtered={filtered}
          page={page}
          base={base}
          listState={listState}
          data={data}
          items={items}
          setParams={setParams}
          update={update}
        />
      </AdminCard>
      {!candidates && deleted && <div className="hiring-notice" role="status">Deleted: {deleted.title}. Candidates are kept.{" "}
        <button type="button" disabled={restoring} onClick={async () => {
          setRestoring(true); setRestoreError("");
          try { await restoreHiringVacancy(deleted._id, deleted.revision); notify?.({ title: "Vacancy restored as draft" }); }
          catch (error) { setRestoreError(error.message); notify?.({ title: "Vacancy could not be restored", description: error.message, tone: "error" }); }
          finally { setRestoring(false); }
        }}>Restore as draft</button>
        {restoreError && <p role="alert">{restoreError}</p>}
      </div>}
    </>
  );
}
