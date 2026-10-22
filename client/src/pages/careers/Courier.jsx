import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bike, MapPin, Check } from "lucide-react";
import { eligibility } from "../../../../shared/engagement.mjs";
import { useEngagement } from "../../features/engagement/useEngagement";
import { displayCity } from "../../features/engagement/engagement.utils";
import { ApplicationForm } from "../../features/engagement/components/ApplicationForm";
import {
  Breadcrumb,
  PublicHero,
  PublicSection,
  ScrollButton,
  InfoCards,
  FaqSection,
  PublicDataNotice,
} from "../../features/engagement/components/PublicPrimitives";
import "../../features/engagement/Engagement.scss";

export function Courier() {
  const { t, i18n } = useTranslation();
  const copy = t("engagement.courier", { returnObjects: true });
  const { settings, intakeReady, loading, error, demo } = useEngagement();
  const reason = eligibility(settings, "courier");
  return (
    <article
      className="eng-page eng-page--courier"
      lang={i18n.resolvedLanguage}
    >
      <Breadcrumb
        current={copy.crumb}
        parent={{ to: "/careers", label: t("footer.links.careers") }}
      />
      <PublicHero
        title={
          <>
            {copy.title}
            <span>{copy.titleAccent}</span>
          </>
        }
        description={copy.description}
        image="/img/engagement/courier-in-city.webp"
        imageAlt={copy.imageAlt}
      >
        {!reason && intakeReady && !loading && !error && (
          <ScrollButton target="courier-application">{copy.apply}</ScrollButton>
        )}
        <Link className="eng-button eng-button--secondary" to="/careers">
          {t("engagement.common.allRoles")}
        </Link>
      </PublicHero>
      <PublicDataNotice />
      <PublicSection
        className="eng-section--benefits"
        title={copy.tasksTitle}
        description={copy.tasksDescription}
      >
        <InfoCards items={copy.tasks} steps />
      </PublicSection>
      <section
        className="eng-courier-details"
        aria-label={copy.conditionsTitle}
      >
        <div>
          <h2>{copy.conditionsTitle}</h2>
          <p>{copy.conditions}</p>
          <p className="eng-courier-details__cities">
            <MapPin size={20} aria-hidden="true" />
            <span>
              {settings.hiring.courier_cities.length > 0 ? (
                <>
                  {copy.cities}:{" "}
                  {settings.hiring.courier_cities
                    .map((city) => displayCity(city, t, demo))
                    .join(", ")}
                </>
              ) : (
                copy.noCities
              )}
            </span>
          </p>
        </div>
        <div>
          <h2>{copy.audienceTitle}</h2>
          <p>{copy.audience}</p>
        </div>
      </section>
      <PublicSection
        className="eng-process eng-process--light"
        title={copy.processTitle}
      >
        <InfoCards items={copy.process} steps />
      </PublicSection>
      <PublicSection
        id="courier-application"
        className="eng-form-section eng-section--split"
        title={copy.formTitle}
        description={copy.formDescription}
        aside={
          <div className="eng-form-section__aside">
            <Bike size={32} strokeWidth={1.5} aria-hidden="true" />
            <ul>
              {copy.formReassurance.map((item) => (
                <li key={item}>
                  <Check size={18} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        }
      >
        <ApplicationForm kind="courier" unavailable={reason} />
      </PublicSection>
      <FaqSection
        items={copy.faq}
        description={copy.faqDescription}
        target="courier-application"
        action={copy.apply}
      />
    </article>
  );
}
