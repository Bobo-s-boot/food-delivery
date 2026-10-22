import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronRight, ArrowDown, ArrowUp } from "lucide-react";
import { useEngagement } from "../useEngagement";
import "../../../pages/home/components/HomeFaq.scss";

export function Breadcrumb({ current, parent }) {
  const { t } = useTranslation();
  return (
    <nav
      className="eng-breadcrumb"
      aria-label={t("engagement.common.breadcrumb")}
    >
      <ol>
        <li>
          <Link to="/">{t("engagement.common.home")}</Link>
        </li>
        {parent && (
          <li>
            <ChevronRight size={14} aria-hidden="true" />
            <Link to={parent.to}>{parent.label}</Link>
          </li>
        )}
        <li>
          <ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page">{current}</span>
        </li>
      </ol>
    </nav>
  );
}
export function ScrollButton({ target, children, secondary = false, up = false }) {
  return (
    <button
      type="button"
      className={"eng-button" + (secondary ? " eng-button--secondary" : "")}
      onClick={() => {
        const element = document.getElementById(target);
        element?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
          block: "start",
        });
        element?.focus({ preventScroll: true });
      }}
    >
      {children}
      {up ? <ArrowUp size={18} aria-hidden="true" /> : <ArrowDown size={18} aria-hidden="true" />}
    </button>
  );
}
export function PublicHero({
  title,
  description,
  children,
  image,
  imageAlt = "",
  caption,
  aside,
  meta,
  note,
  variant = "",
}) {
  return (
    <header
      className={
        "eng-hero" +
        (image ? " eng-hero--image" : "") +
        (variant ? " eng-hero--" + variant : "")
      }
    >
      <div className="eng-hero__copy">
        <h1>{title}</h1>
        <p>{description}</p>
        {meta}
        {children && <div className="eng-actions">{children}</div>}
        {note && <p className="eng-hero__note">{note}</p>}
      </div>
      {image && (
        <figure className="eng-hero__visual">
          <img
            src={image}
            alt={imageAlt}
            fetchPriority="high"
            width="1536"
            height="1024"
          />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      )}
      {aside && <div className="eng-hero__aside">{aside}</div>}
    </header>
  );
}
export function PublicSection({
  id,
  title,
  description,
  children,
  className = "",
  aside,
}) {
  return (
    <section id={id} tabIndex={-1} className={"eng-section " + className}>
      <div className="eng-section__heading">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
        {aside}
      </div>
      <div className="eng-section__body">{children}</div>
    </section>
  );
}
export function InfoCards({ items, steps = false, icons = [] }) {
  const Tag = steps ? "ol" : "div";
  return (
    <Tag className={steps ? "eng-steps" : "eng-benefits"}>
      {items.map(([title, body], index) => {
        const Icon = icons[index];
        const Item = steps ? "li" : "article";
        return (
          <Item className={steps ? "eng-step" : "eng-benefit"} key={title}>
            {(steps || Icon) && (
              <span className="eng-item-icon" aria-hidden="true">
                {steps ? (
                  String(index + 1).padStart(2, "0")
                ) : (
                  <Icon size={24} strokeWidth={1.6} />
                )}
              </span>
            )}
            <div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          </Item>
        );
      })}
    </Tag>
  );
}
export function Faq({ items }) {
  const [open, setOpen] = useState(0);
  const id = useId();
  return (
    <div className="home-faq__accordion">
      {items.map(([question, answer], index) => (
        <article
          key={question}
          className={
            "home-faq__item" + (open === index ? " home-faq__item--open" : "")
          }
        >
          <h3 className="home-faq__question-heading">
            <button
              className="home-faq__question"
              type="button"
              id={id + "-question-" + index}
              aria-expanded={open === index}
              aria-controls={id + "-answer-" + index}
              onClick={() => setOpen(open === index ? null : index)}
            >
              <span>{question}</span>
              <span
                className={
                  "home-faq__question-icon" +
                  (open === index ? " home-faq__question-icon--open" : "")
                }
                aria-hidden="true"
              >
                <ChevronDown size={18} strokeWidth={1.8} />
              </span>
            </button>
          </h3>
          <div
            className="home-faq__answer-panel"
            id={id + "-answer-" + index}
            role="region"
            aria-labelledby={id + "-question-" + index}
            hidden={open !== index}
          >
            <div className="home-faq__answer-content">
              <p>{answer}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
export function FaqSection({ items, description, target, action }) {
  const { t } = useTranslation();
  const id = useId();
  return (
    <section className="home-faq eng-questions" aria-labelledby={id}>
      <div className="home-faq__intro">
        <h2 id={id} className="home-faq__title">
          {t("engagement.common.faq")}
        </h2>
        <p className="home-faq__description">{description}</p>
      </div>
      <Faq items={items} />
      <div className="home-faq__support">
        <div>
          <span className="home-faq__support-label">
            {t("engagement.common.moreQuestions")}
          </span>
          <p>{t("engagement.common.questionHelp")}</p>
        </div>
        <ScrollButton target={target} up>{action}</ScrollButton>
      </div>
    </section>
  );
}
export function PublicDataNotice() {
  const { error, loading, refresh } = useEngagement();
  const { t } = useTranslation();
  if (loading)
    return (
      <p className="eng-notice" role="status">
        {t("engagement.common.loading")}
      </p>
    );
  if (!error) return null;
  return (
    <div className="eng-notice eng-notice--error" role="alert">
      {t("engagement.common.loadError")}{" "}
      <button type="button" onClick={refresh}>
        {t("engagement.common.retry")}
      </button>
    </div>
  );
}
