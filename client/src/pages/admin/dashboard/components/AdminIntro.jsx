import { motion, useReducedMotion } from "motion/react";

export function AdminIntro({ className = "" }) {
  const reduceMotion = useReducedMotion();
  const itemMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <section className={`admin-intro ${className}`.trim()}>
      <div className="admin-intro__container">
        <motion.h1
          className="admin-intro__title"
          {...itemMotion}
          transition={{ ...itemMotion.transition, delay: 0.08 }}
        >
          Good morning,{" "}
          <span className="admin-intro__title-highlight">Admin</span>
        </motion.h1>

        <motion.p
          className="admin-intro__description"
          {...itemMotion}
          transition={{ ...itemMotion.transition, delay: 0.16 }}
        >
          Here's today's platform overview.
        </motion.p>
      </div>
    </section>
  );
}
