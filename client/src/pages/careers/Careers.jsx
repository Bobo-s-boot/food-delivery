import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Bike } from "lucide-react";
import { CareersVacancyFilters, CareersVacancyResults } from "./components/CareersOpenRoles";
import { careerWorkIcons } from "./careers.data";
import { eligibility } from "../../../../shared/engagement.mjs";
import { useEngagement } from "../../features/engagement/useEngagement";
import {
  filterVacancies,
  localizeVacancy,
} from "../../features/engagement/engagement.utils";
import {
  PublicSection,
  ScrollButton,
  InfoCards,
  FaqSection,
  PublicDataNotice,
} from "../../features/engagement/components/PublicPrimitives";
import "../../features/engagement/Engagement.scss";

export function Careers() {
  const { t, i18n } = useTranslation();
  const copy = t("engagement.careers", { returnObjects: true });
  const { settings, vacancies, intakeReady, loading, error: workspaceError, hiringError, refresh, demo } =
    useEngagement();
  const error = workspaceError || hiringError;
  const courierAvailable =
    !loading && !error && intakeReady && !eligibility(settings, "courier");
  const [filters, setFilters] = useState({
    department: "",
    city: "",
    search: "",
  });
  const departments = useMemo(
    () => [
      ...new Set(vacancies.map((item) => item.content?.en.department || item.department).filter(Boolean)),
    ],
    [vacancies],
  );
  const cities = useMemo(
    () => [...new Set(vacancies.map((item) => item.content?.en.city || item.city).filter(Boolean))],
    [vacancies],
  );
  const localized = vacancies.map((item) => ({
    ...localizeVacancy(item, t, demo),
    sourceDepartment: item.content?.en.department || item.department,
    sourceCity: item.content?.en.city || item.city,
  }));
  const filtered = filterVacancies(localized, filters);
  const setFilter = (key, value) =>
    setFilters((current) => ({ ...current, [key]: value }));
  return (
    <article
      className="eng-page eng-page--careers"
      lang={i18n.resolvedLanguage}
    >
      <header className="eng-career-hero">
        <h1>
          <span className="eng-career-hero__lead">{copy.title}</span>
          <span className="eng-career-hero__accent">{copy.titleAccent}</span>
        </h1>
        <div className="eng-career-hero__scene">
          <img src="/img/engagement/careers-team-banner.webp" alt={copy.imageAlt} width="2022" height="778" fetchPriority="high" />
          <div className="eng-career-hero__intro">
            <p>{copy.description}</p>
            <div className="eng-actions">
              <ScrollButton target="open-roles">{copy.apply}</ScrollButton>
              {courierAvailable && <Link className="eng-text-link" to="/careers/courier">{copy.courierAction}<ArrowUpRight size={18} aria-hidden="true" /></Link>}
            </div>
          </div>
        </div>
      </header>
      <PublicDataNotice />
      {hiringError && <p className="eng-notice" role="alert">{t("engagement.hiring.storageUnavailable")} <button type="button" onClick={refresh}>{t("engagement.common.retry")}</button></p>}
      {!loading && !error && !settings.hiring.global_enabled && (
        <p className="eng-notice">{copy.globalClosed}</p>
      )}
      <PublicSection
        id="open-roles"
        className="eng-section--vacancies"
        title={copy.rolesTitle}
        description={copy.rolesDescription}
      >
        <CareersVacancyFilters
          vacancies={vacancies}
          departments={departments}
          cities={cities}
          localized={localized}
          filters={filters}
          setFilter={setFilter}
          copy={copy}
        />
        <CareersVacancyResults
          loading={loading}
          error={error}
          vacancies={vacancies}
          filtered={filtered}
          settings={settings}
          copy={copy}
          t={t}
          setFilters={setFilters}
        />
      </PublicSection>
      <section className="eng-work-story" aria-labelledby="work-story-title">
        <figure>
          <img
            src="/img/engagement/shared-table.webp"
            alt={copy.workAlt}
            width="1536"
            height="1024"
            loading="lazy"
          />
        </figure>
        <div className="eng-work-story__copy">
          <div><h2 id="work-story-title">{copy.workTitle}</h2><p>{copy.workDescription}</p></div>
          <InfoCards items={copy.work} icons={careerWorkIcons} />
          <p className="eng-work-story__closing">{copy.workClosing}</p>
        </div>
      </section>
      <section
        className="eng-courier-invite"
        aria-labelledby="courier-invite-title"
      >
        <img
          src="/img/engagement/courier-in-city.webp"
          alt={copy.courierAlt}
          width="1536"
          height="1024"
          loading="lazy"
        />
        <div>
          <h2 id="courier-invite-title">{copy.courierTitle}<span>{copy.courierAccent}</span></h2>
          <div className="eng-courier-invite__bottom">
            <p>{copy.courierDescription}</p><p>{copy.courierDetail}</p>
            {!loading && !error && eligibility(settings, "courier") && <p className="eng-courier-invite__status">{copy.closed}</p>}
            <div className="eng-courier-invite__action"><Link className="eng-button" to="/careers/courier">{courierAvailable ? copy.courierLink : copy.courierInfo}<ArrowUpRight size={18} aria-hidden="true" /></Link><Bike size={40} strokeWidth={1.3} aria-hidden="true" /></div>
          </div>
        </div>
      </section>
      <PublicSection
        className="eng-process eng-process--light"
        title={copy.processTitle}
        description={copy.processDescription}
      >
        <InfoCards items={copy.process} steps />
      </PublicSection>
      <FaqSection
        description={copy.faqDescription}
        items={copy.faq}
        target="open-roles"
        action={copy.apply}
      />
    </article>
  );
}
