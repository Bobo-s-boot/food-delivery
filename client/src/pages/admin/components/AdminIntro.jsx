import { motion, useReducedMotion } from "motion/react";
import "../Admin.scss";

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
        <motion.p
          className="admin-intro__subtitle"
          {...itemMotion}
          transition={{ ...itemMotion.transition, delay: 0.08 }}
        >
          Please respond to changes
        </motion.p>

        <motion.h1
          className="admin-intro__title"
          {...itemMotion}
          transition={{ ...itemMotion.transition, delay: 0.16 }}
        >
          Good morning,{" "}
          <span className="admin-intro__title-highlight">Admin</span>
        </motion.h1>

        <motion.p
          className="admin-intro__description"
          {...itemMotion}
          transition={{ ...itemMotion.transition, delay: 0.24 }}
        >
          Here's what's happening with Defilicious today.
        </motion.p>
      </div>
    </section>
  );
}
