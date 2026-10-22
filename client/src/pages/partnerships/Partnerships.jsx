import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, CookingPot, Bike } from "lucide-react";
import { ApplicationForm } from "../../features/engagement/components/ApplicationForm";
import {
  PublicSection,
  ScrollButton,
  InfoCards,
  FaqSection,
  PublicDataNotice,
} from "../../features/engagement/components/PublicPrimitives";
import "../../features/engagement/Engagement.scss";

export function Partnerships() {
  const { t, i18n } = useTranslation();
  const copy = t("engagement.partnership", { returnObjects: true });
  return (
    <article
      className="eng-page eng-page--partnership"
      lang={i18n.resolvedLanguage}
    >
      <header className="eng-partner-hero">
        <h1>
          <span className="eng-partner-hero__lead">{copy.title}</span>
          <span className="eng-partner-hero__accent">{copy.titleAccent}</span>
        </h1>
        <div className="eng-partner-hero__intro">
          <p>{copy.description}</p>
          <div className="eng-actions">
            <ScrollButton target="partnership-application">
              {copy.apply}
            </ScrollButton>
            <ScrollButton target="partnership-process" secondary>
              {copy.how}
            </ScrollButton>
          </div>
        </div>
        <figure>
          <img
            src="/img/engagement/restaurant-handoff.webp"
            alt={copy.imageAlt}
            width="1536"
            height="1024"
            fetchPriority="high"
          />
        </figure>
      </header>
      <PublicDataNotice />
      <section
        className="eng-partner-benefits"
        aria-labelledby="partner-benefits-title"
      >
        <div className="eng-partner-benefits__heading">
          <h2 id="partner-benefits-title">{copy.benefitsTitle}</h2>
          <p>{copy.benefitsDescription}</p>
          <ScrollButton target="partnership-application">{copy.apply}</ScrollButton>
        </div>
        <div className="eng-partner-benefits__body">
          <div className="eng-partner-benefits__responsibilities">
            {copy.benefits.map(([title, body], index) => {
              const Icon = [CookingPot, Bike][index];
              return (
                <article key={title}>
                  <Icon size={32} strokeWidth={1.4} aria-hidden="true" />
                  <div><h3>{title}</h3><p>{body}</p></div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section
        className="eng-shared-order"
        aria-labelledby="shared-order-title"
      >
        <figure className="eng-shared-order__visual">
          <img
            src="/img/engagement/shared-table.webp"
            alt={copy.sharedAlt}
            loading="lazy"
            width="1536"
            height="1024"
          />
        </figure>
        <div className="eng-shared-order__copy">
          <h2 id="shared-order-title">
            {copy.sharedTitle}
            <span>{copy.sharedAccent}</span>
          </h2>
          <p>{copy.sharedDescription}</p>
          <p>{copy.sharedDetail}</p>
          <ScrollButton target="partnership-application">
            {copy.apply}
          </ScrollButton>
          <Link to="/catalog" className="eng-text-link">
            {copy.explore}<ArrowUpRight size={20} aria-hidden="true" />
          </Link>
        </div>
      </section>
      <PublicSection
        id="partnership-process"
        className="eng-process eng-process--light eng-partner-process"
        title={copy.processTitle}
        description={copy.processDescription}
        aside={
          <ScrollButton target="partnership-application">
            {copy.processAction}
          </ScrollButton>
        }
      >
        <InfoCards items={copy.steps} steps />
      </PublicSection>
      <PublicSection
        id="partnership-application"
        className="eng-form-section eng-section--split"
        title={copy.formTitle}
        description={copy.formDescription}
        aside={
          <div className="eng-form-section__aside">
            <p>{copy.formNote}</p>
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
        <ApplicationForm kind="partnership" />
      </PublicSection>
      <FaqSection
        description={copy.faqDescription}
        items={copy.faq}
        target="partnership-application"
        action={copy.faqAction}
      />
    </article>
  );
}
