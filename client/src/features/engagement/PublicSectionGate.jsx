import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { isEngagementSectionEnabled } from "../../../../shared/engagement.mjs";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { PublicDataNotice } from "./components/PublicPrimitives";
import { useEngagement } from "./useEngagement";
import "./Engagement.scss";
import "./PublicSectionGate.scss";

function PublicSectionLoading() {
  const { t } = useTranslation();
  return (
    <section className="eng-page eng-section-state" aria-busy="true">
      <p className="eng-notice" role="status">
        {t("engagement.common.loading")}
      </p>
    </section>
  );
}

export function PublicSectionNotFound() {
  const { t } = useTranslation();
  const { userBasePath } = useCurrentUser();
  return (
    <section
      className="eng-page eng-section-state"
      aria-labelledby="eng-section-not-found"
    >
      <span className="eng-section-state__code">404</span>
      <h1 id="eng-section-not-found">
        {t("engagement.notFound.title")}
      </h1>
      <p>{t("engagement.notFound.description")}</p>
      <div className="eng-actions">
        <Link className="eng-button" to={userBasePath || "/"}>
          <ArrowLeft size={18} aria-hidden="true" />
          {t("engagement.notFound.home")}
        </Link>
        <Link
          className="eng-button eng-button--secondary"
          to={`${userBasePath}/catalog`}
        >
          {t("engagement.notFound.restaurants")}
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

export function PublicSectionGate({ section, children }) {
  const { settings, loading, hasLoaded } = useEngagement();

  if (loading) return <PublicSectionLoading />;
  if (!hasLoaded) {
    return (
      <section className="eng-page eng-section-state">
        <PublicDataNotice />
      </section>
    );
  }
  if (!isEngagementSectionEnabled(settings, section)) {
    return <PublicSectionNotFound />;
  }

  return (
    <Suspense fallback={<PublicSectionLoading />}>
      {children}
    </Suspense>
  );
}
