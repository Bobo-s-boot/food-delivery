import { motion } from "motion/react";
import { useLandingMotion } from "../../motion/safeMotion";

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
      className={`bg-gray-900 text-white/90 px-4 py-3 rounded-full font-normal text-base hover:bg-gray-800 transition-colors ${buttonClassName}`.trim()}
    >
      {actionContent}
    </a>
  ) : (
    <button
      type="button"
      onClick={onActionClick}
      className={`bg-gray-900 text-white/90 px-4 py-3 rounded-full font-normal text-base hover:bg-gray-800 transition-colors ${buttonClassName}`.trim()}
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
    <section className={`w-full px-4 pt-4 ${sectionClassName}`.trim()}>
      <div
        className={`relative w-full h-150 rounded-4xl overflow-hidden flex flex-col justify-center px-12 ${containerClassName}`.trim()}
      >
        {backgroundImage ? (
          <motion.div
            aria-hidden
            className="absolute inset-0 z-0 origin-center"
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
          className={`relative z-10 flex flex-col items-center text-white/90 mb-72 ${contentClassName}`.trim()}
          variants={lm.heroContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-center font-normal leading-tight mb-5 text-black"
            variants={lm.heroItem}
          >
            {renderLines(titleLines)}
          </motion.h1>
          <motion.p
            className="text-base text-white/90 mb-8 w-full text-center mx-auto"
            variants={lm.heroItem}
          >
            {description}
          </motion.p>
          <motion.div variants={lm.heroCta}>{actionElement}</motion.div>
        </motion.div>

        {socialLinks.length > 0 && (
          <motion.div
            className={`absolute right-3 bottom-3 flex gap-2 z-10 ${rightPanelClassName}`.trim()}
            variants={lm.heroPanel}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center gap-3 justify-end">
              {socialLinks.map((link, index) => {
                const label = typeof link === "string" ? link : link.label;
                return (
                  <motion.span
                    key={`${label}-${index}`}
                    className="px-4 py-2 text-white text-sm bg-white/20 backdrop-blur-sm cursor-pointer hover:bg-white/40 rounded-lg"
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
          className={`absolute left-3 bottom-3 flex gap-2 z-10 ${bottomPanelClassName}`.trim()}
          variants={lm.heroPanel}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-start">
            <p className="font-normal text-white text-base drop-shadow-md leading-snug text-left">
              {renderLines(noteLines)}
            </p>
          </div>

          <div className="flex items-center bg-white/20 backdrop-blur-md rounded-full px-2 py-1.6 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-gray-200/90 z-30" />
            <div className="w-7 h-7 rounded-full bg-gray-200/90 -ml-3 z-20" />
            <div className="w-7 h-7 rounded-full bg-gray-200/90 -ml-3 z-10" />
          </div>
        </motion.div>

        {children}
      </div>
    </section>
  );
}
