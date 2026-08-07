import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useAccountNavigation } from "../../../hooks/useAccountNavigation";
import { useSupport } from "../../../features/support/useSupport";
import { useLandingMotion } from "../../../motion/safeMotion";
import { FAQ_ITEMS } from "../faq.data";
import "./HomeFaq.scss";

const getInitialOpenItem = () => {
  if (typeof window === "undefined") return null;

  return window.matchMedia("(min-width: 900px)").matches
    ? FAQ_ITEMS[0].id
    : null;
};

export function HomeFaq({ isContentReady = true }) {
  const { t } = useTranslation();
  const location = useLocation();
  const landingMotion = useLandingMotion();
  const { openAccountSection } = useAccountNavigation();
  const { openSupport } = useSupport();
  const [openItemId, setOpenItemId] = useState(getInitialOpenItem);

  useEffect(() => {
    if (location.hash !== "#faq" || !isContentReady) return undefined;

    const animationFrame = window.requestAnimationFrame(() => {
      const faqSection = document.getElementById("faq");
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      faqSection?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [isContentReady, location.hash]);

  const renderAction = (action) => {
    if (!action) return null;

    const label = t(`home.faq.actions.${action.labelKey}`);

    if (action.type === "route") {
      return (
        <Link className="home-faq__answer-action" to={action.to}>
          {label}
        </Link>
      );
    }

    const handleClick =
      action.type === "support"
        ? openSupport
        : () => openAccountSection(action.section);

    return (
      <button
        type="button"
        className="home-faq__answer-action"
        onClick={handleClick}
      >
        {label}
      </button>
    );
  };

  return (
    <motion.section
      id="faq"
      className="home-faq"
      aria-labelledby="home-faq-title"
      variants={landingMotion.sectionHeader}
      initial="hidden"
      whileInView="visible"
      viewport={landingMotion.viewport}
    >
      <div className="home-faq__intro">
        <h2 id="home-faq-title" className="home-faq__title">
          {t("home.faq.title")}
        </h2>
        <p className="home-faq__description">{t("home.faq.description")}</p>
      </div>

      <div className="home-faq__accordion">
        {FAQ_ITEMS.map((item) => {
          const isOpen = openItemId === item.id;
          const triggerId = `faq-trigger-${item.id}`;
          const panelId = `faq-panel-${item.id}`;

          return (
            <article
              key={item.id}
              className={`home-faq__item ${
                isOpen ? "home-faq__item--open" : ""
              }`}
            >
              <h3 className="home-faq__question-heading">
                <button
                  id={triggerId}
                  type="button"
                  className="home-faq__question"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenItemId(isOpen ? null : item.id)}
                >
                  <span>
                    {t(`home.faq.items.${item.translationKey}.question`)}
                  </span>
                  <span
                    className={`home-faq__question-icon ${
                      isOpen ? "home-faq__question-icon--open" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <ChevronDown size={18} strokeWidth={1.8} />
                  </span>
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    className="home-faq__answer-panel"
                    role="region"
                    aria-labelledby={triggerId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={
                      landingMotion.reduced
                        ? { duration: 0 }
                        : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }
                    }
                  >
                    <div className="home-faq__answer-content">
                      <p>
                        {t(`home.faq.items.${item.translationKey}.answer`)}
                      </p>
                      {renderAction(item.action)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          );
        })}
      </div>

      <div className="home-faq__support">
        <div>
          <span className="home-faq__support-label">
            {t("home.faq.supportPrompt")}
          </span>
          <p>{t("home.faq.supportDescription")}</p>
        </div>
        <button
          type="button"
          className="home-faq__support-action"
          onClick={openSupport}
        >
          {t("home.faq.supportAction")}
        </button>
      </div>
    </motion.section>
  );
}
