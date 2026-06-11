import { motion } from "motion/react";
import { useLandingMotion } from "../../motion/safeMotion";
import "./HeroBlock.scss";

export function HeroBlock({
  titleLines = [],
  description = "",
  actionLabel = "",
  actionHref,
  onActionClick,
  backgroundImage,
  socialLinks = [],
  noteLines = [],
  sectionClassName = "",
  containerClassName = "",
  buttonClassName = "",
  contentClassName = "",
  rightPanelClassName = "",
  bottomPanelClassName = "",
  children,
}) {
  const lm = useLandingMotion();

  const actionContent = <span>{actionLabel}</span>;

  const actionElement = actionHref ? (
    <a
      href={actionHref}
      className={`hero-block__cta-button ${buttonClassName}`.trim()}
    >
      {actionContent}
    </a>
  ) : (
    <button
      type="button"
      onClick={onActionClick}
      className={`hero-block__cta-button ${buttonClassName}`.trim()}
    >
      {actionContent}
    </button>
  );

  const renderLines = (lines) =>
    lines.map((line, index) => (
      <span key={`${line}-${index}`}>
        {line}
        {index < lines.length - 1 ? <br /> : null}
      </span>
    ));

  return (
    <section className={`hero-block ${sectionClassName}`.trim()}>
      <div className={`hero-block__container ${containerClassName}`.trim()}>
        {backgroundImage ? (
          <motion.div
            aria-hidden
            className="hero-block__background"
            style={{
              backgroundImage: `url("${backgroundImage}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            initial={{ scale: 1 }}
            animate={lm.reduced ? { scale: 1 } : { scale: [1, 1.06, 1] }}
            transition={
              lm.reduced
                ? { duration: 0 }
                : {
                    duration: 24,
                    repeat: Infinity,
                    ease: "linear",
                    times: [0, 0.5, 1],
                  }
            }
          />
        ) : null}

        <motion.div
          className={`hero-block__content ${contentClassName}`.trim()}
          variants={lm.heroContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="hero-block__heading" variants={lm.heroItem}>
            {renderLines(titleLines)}
          </motion.h1>
          <motion.p className="hero-block__description" variants={lm.heroItem}>
            {description}
          </motion.p>
          <motion.div variants={lm.heroCta}>{actionElement}</motion.div>
        </motion.div>

        {socialLinks.length > 0 && (
          <motion.div
            className={`hero-block__side-panel ${rightPanelClassName}`.trim()}
            variants={lm.heroPanel}
            initial="hidden"
            animate="visible"
          >
            <div className="hero-block__social-list">
              {socialLinks.map((link, index) => {
                const label = typeof link === "string" ? link : link.label;
                return (
                  <motion.span
                    key={`${label}-${index}`}
                    className="hero-block__social-pill"
                    whileHover={lm.reduced ? undefined : { scale: 1.04, y: -2 }}
                    whileTap={lm.reduced ? undefined : { scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  >
                    {label}
                  </motion.span>
                );
              })}
            </div>
          </motion.div>
        )}

        <motion.div
          className={`hero-block__bottom-panel ${bottomPanelClassName}`.trim()}
          variants={lm.heroPanel}
          initial="hidden"
          animate="visible"
        >
          <div className="hero-block__note-wrapper">
            <p className="hero-block__note">{renderLines(noteLines)}</p>
          </div>

          <div className="hero-block__dots">
            <span className="hero-block__dot"></span>
            <span className="hero-block__dot hero-block__dot--overlap"></span>
            <span className="hero-block__dot hero-block__dot--overlap-second"></span>
          </div>
        </motion.div>

        {children}
      </div>
    </section>
  );
}
