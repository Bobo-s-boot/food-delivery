import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BriefcaseBusiness, Clock3, MapPin, UsersRound, FileText } from "lucide-react";
import { eligibility } from "../../../../../shared/engagement.mjs";
import { useEngagement } from "../useEngagement";
import { localizeVacancy, translateEngagementMessage } from "../engagement.utils";
import { ApplicationForm } from "./ApplicationForm";
import { VacancyImage } from "./VacancyImage";
import { Breadcrumb, PublicSection, ScrollButton, PublicDataNotice, InfoCards, FaqSection } from "./PublicPrimitives";
import "../Engagement.scss";

export function VacancyView({ record, language, preview: adminPreview = false, loadError = "", onRetry }) {
  const { i18n } = useTranslation();
  const t = i18n.getFixedT(language || i18n.resolvedLanguage);
  const { settings, intakeReady, demo } = useEngagement();
  const preview = adminPreview || !!record.draft_preview;
  const vacancy = localizeVacancy(record, t, demo, language || i18n.resolvedLanguage);
  const reason = preview ? "" : eligibility(settings, "team", record);
  const error = loadError;
  return (
    <article
      className="eng-page eng-page--vacancy"
      lang={language || i18n.resolvedLanguage}
    >
      <Breadcrumb
        current={vacancy.title}
        parent={{ to: "/careers", label: t("footer.links.careers") }}
      />
      {record.draft_preview && <div className="eng-draft-preview" role="status"><strong>{t("engagement.hiring.draftPreview")}</strong><p>{t("engagement.hiring.draftPreviewBody")}</p></div>}
      <header className="eng-job-hero">
        <div>
          <h1>{vacancy.title}</h1>
          <div className="eng-actions">
            {!reason && !error && intakeReady && (
              <ScrollButton target="role-application">
                {t("engagement.form.submitTeam")}
              </ScrollButton>
            )}
            <Link className="eng-text-link" to="/careers">
              {t("engagement.common.allRoles")}
            </Link>
          </div>
        </div>
        <dl>
          {[
            ["department", vacancy.department, UsersRound],
            ["location", vacancy.city, MapPin],
            ["format", vacancy.employment_type, BriefcaseBusiness],
            ["schedule", vacancy.schedule, Clock3],
          ]
            .filter(([, value]) => value)
            .map(([key, value, icon]) => {
              const Icon = icon;
              return (
                <div key={key}>
                  <dt>
                    <Icon size={18} aria-hidden="true" />
                    {t("engagement.vacancy." + key)}
                  </dt>
                  <dd>{value}</dd>
                </div>
              );
            })}
        </dl>
      </header>
      <PublicDataNotice />
      {error && (
        <p className="eng-notice" role="alert">
          {translateEngagementMessage(error, t, "vacancy.loadError")}{" "}
          <button
            type="button"
            onClick={onRetry}
          >
            {t("engagement.common.retry")}
          </button>
        </p>
      )}
      {reason && (
        <p className="eng-notice">
          {translateEngagementMessage(reason, t)}{" "}
          <Link to="/careers">{t("engagement.vacancy.otherRoles")}</Link>
        </p>
      )}
      <div className="eng-role-layout">
        <div className="eng-role-content">
          <PublicSection
            title={t("engagement.vacancy.aboutTitle")}
          >
            <p className="eng-role-content__intro">{vacancy.overview}</p>
          </PublicSection>
          {[
            ["responsibilities", vacancy.responsibilities],
            ["requirements", vacancy.requirements],
          ].filter(([, items]) => items?.length).map(([key, items]) => (
            <PublicSection
              id={"role-" + key}
              key={key}
              title={t("engagement.vacancy." + key)}
            >
              <ul>
                {items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </PublicSection>
          ))}
        </div>
        <aside className="eng-role-sidebar">
          <div className="eng-role-summary">
            <VacancyImage id={record.image_mode === "separate" ? record.images?.detail : record.images?.card} alt={record.image_mode === "separate" ? vacancy.detail_image_alt : vacancy.image_alt} />
            {!!vacancy.conditions?.length && (
              <>
                <h2>{t("engagement.vacancy.conditions")}</h2>
                <ul>
                  {vacancy.conditions.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </>
            )}
            <p className="eng-role-summary__cv">
              <FileText size={18} aria-hidden="true" />
              {t(
                record.resume_required
                  ? "engagement.vacancy.cvRequired"
                  : "engagement.vacancy.cvOptional",
              )}
            </p>
            {!reason && !error && intakeReady && (
              <ScrollButton target="role-application">
                {t("engagement.form.submitTeam")}
              </ScrollButton>
            )}
            <Link className="eng-text-link" to="/careers">
              {t("engagement.common.allRoles")}
            </Link>
          </div>
        </aside>
      </div>
      <PublicSection
        className="eng-hiring-path"
        title={t("engagement.vacancy.processTitle")}
        description={t("engagement.vacancy.processDescription")}
      >
        <InfoCards
          items={t("engagement.vacancy.process", { returnObjects: true })}
          steps
        />
      </PublicSection>
      <PublicSection
        id="role-application"
        className="eng-form-section eng-section--split"
        title={t("engagement.vacancy.formTitle")}
        description={t(
          record.resume_required
            ? "engagement.vacancy.resumeRequired"
            : "engagement.vacancy.resumeOptional",
        )}
        aside={
          <div className="eng-form-section__aside">
            <p>{t("engagement.vacancy.formNote")}</p>
            <strong className="eng-form-section__role">{vacancy.title}</strong>
            <dl className="eng-application-help">
              {t("engagement.vacancy.applicationHelp", { returnObjects: true }).map(([title, body]) => (
                <div key={title}><dt>{title}</dt><dd>{body}</dd></div>
              ))}
            </dl>
          </div>
        }
      >
        <ApplicationForm
          kind="team"
          vacancy={record}
          unavailable={error || reason}
          preview={preview}
        />
      </PublicSection>
      {record.faq_enabled && vacancy.faq.length > 0 && <FaqSection
        items={vacancy.faq}
        description={t("engagement.careers.faqDescription")}
        target="role-application"
        action={t("engagement.form.submitTeam")}
      />}
    </article>
  );
}
