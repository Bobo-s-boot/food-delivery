import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getPublicVacancy, engagementError } from "../../api/engagementService";
import { translateEngagementMessage } from "../../features/engagement/engagement.utils";
import { PublicSectionNotFound } from "../../features/engagement/PublicSectionGate";
import { Breadcrumb } from "../../features/engagement/components/PublicPrimitives";
import { VacancyView } from "../../features/engagement/components/VacancyView";
import "../../features/engagement/Engagement.scss";

// Compatibility export; the public route and admin preview share the feature renderer.
export { VacancyView } from "../../features/engagement/components/VacancyView";

function VacancyContent({ slug }) {
  const { t, i18n } = useTranslation();
  const [record, setRecord] = useState(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [notFound, setNotFound] = useState(false);
  useEffect(() => {
    let active = true;
    let sequence = 0;
    const update = () => {
      const request = ++sequence;
      return getPublicVacancy(slug)
        .then((data) => {
          if (active && request === sequence) {
            setRecord(data);
            setError("");
            setNotFound(false);
          }
        })
        .catch((err) => {
          if (active && request === sequence) {
            setError(engagementError(err, "vacancy_load_failed"));
            if (err.response?.status === 404) { setRecord(null); setNotFound(true); }
          }
        });
    };
    update();
    window.addEventListener("engagement:updated", update);
    window.addEventListener("focus", update);
    window.addEventListener("storage", update);
    const timer = window.setInterval(update, 30000);
    return () => {
      active = false;
      clearInterval(timer);
      window.removeEventListener("engagement:updated", update);
      window.removeEventListener("focus", update);
      window.removeEventListener("storage", update);
    };
  }, [slug, attempt]);
  if (notFound) return <PublicSectionNotFound />;
  if (error && !record)
    return (
      <article
        className="eng-page eng-page--vacancy"
        lang={i18n.resolvedLanguage}
      >
        <Breadcrumb
          current={t("engagement.vacancy.unavailable")}
          parent={{ to: "/careers", label: t("footer.links.careers") }}
        />
        <h1>{t("engagement.vacancy.unavailable")}</h1>
        <p className="eng-notice" role="alert">
          {translateEngagementMessage(error, t, "vacancy.loadError")}
        </p>
        <div className="eng-actions">
          <button
            type="button"
            className="eng-button"
            onClick={() => setAttempt((value) => value + 1)}
          >
            {t("engagement.common.retry")}
          </button>
          <Link to="/careers">{t("engagement.common.allRoles")}</Link>
        </div>
      </article>
    );
  if (!record)
    return (
      <p className="eng-page" role="status">
        {t("engagement.vacancy.loading")}
      </p>
    );
  return <VacancyView record={record} loadError={error} onRetry={() => setAttempt((value) => value + 1)} />;
}

export function Vacancy() {
  const { slug } = useParams();
  return <VacancyContent key={slug} slug={slug} />;
}
