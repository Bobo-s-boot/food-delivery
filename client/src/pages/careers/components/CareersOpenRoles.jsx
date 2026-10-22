import { BriefcaseBusiness } from "lucide-react";
import { eligibility } from "../../../../../shared/engagement.mjs";
import { VacancyCard } from "../../../features/engagement/components/VacancyCard";

export function CareersVacancyFilters({ vacancies, departments, cities, localized, filters, setFilter, copy }) {
  return (
    vacancies.length > 5 && (
      <div className="eng-filters">
        {vacancies.length > 15 && (
          <div className="eng-field">
            <label htmlFor="role-search">{copy.search}</label>
            <input
              id="role-search"
              value={filters.search}
              onChange={(event) => setFilter("search", event.target.value)}
            />
          </div>
        )}
        {departments.length > 1 && (
          <div className="eng-field">
            <label htmlFor="role-department">{copy.department}</label>
            <select
              id="role-department"
              value={filters.department}
              onChange={(event) =>
                setFilter("department", event.target.value)
              }
            >
              <option value="">{copy.allDepartments}</option>
              {departments.map((item) => (
                <option key={item} value={item}>
                  {localized.find((role) => role.sourceDepartment === item)
                    ?.department || item}
                </option>
              ))}
            </select>
          </div>
        )}
        {cities.length > 1 && (
          <div className="eng-field">
            <label htmlFor="role-city">{copy.city}</label>
            <select
              id="role-city"
              value={filters.city}
              onChange={(event) => setFilter("city", event.target.value)}
            >
              <option value="">{copy.allCities}</option>
              {cities.map((item) => (
                <option key={item} value={item}>
                  {localized.find((role) => role.sourceCity === item)
                    ?.city || item}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    )
  );
}

export function CareersVacancyResults({ loading, error, vacancies, filtered, settings, copy, t, setFilters }) {
  return (
    <>
      {loading && (
        <p role="status" className="eng-empty">
          {t("engagement.common.loading")}
        </p>
      )}
      {!loading && !error && !vacancies.length && (
        <div className="eng-vacancies-empty" role="status">
          <BriefcaseBusiness size={28} aria-hidden="true" />
          <h3>{t("engagement.hiring.emptyTitle")}</h3>
          <p>{t("engagement.hiring.emptyBody")}</p>
        </div>
      )}
      {!!vacancies.length && !filtered.length && (
        <div className="eng-notice">
          {copy.noMatches}{" "}
          <button
            type="button"
            onClick={() =>
              setFilters({ department: "", city: "", search: "" })
            }
          >
            {copy.reset}
          </button>
        </div>
      )}
      {!!filtered.length && (
        <div className="eng-roles">
          {filtered.map((vacancy) => (
            <VacancyCard key={vacancy._id} vacancy={vacancy} paused={eligibility(settings, "team", vacancy) ? copy.paused : ""} />
          ))}
        </div>
      )}
    </>
  );
}
