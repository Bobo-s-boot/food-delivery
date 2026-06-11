import { motion, useReducedMotion } from "motion/react";
import { AdminCard } from "./AdminCard";
import "../Admin.scss";

export function KpiGrid({ cards }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="kpi-grid">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{
            duration: 0.42,
            delay: index * 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <AdminCard className="kpi-card">
            <p className="kpi-card__label">{card.label}</p>
            <div className="kpi-card__content">
              <strong className="kpi-card__value">{card.value}</strong>
              <span
                className={`kpi-card__trend kpi-card__trend--${
                  card.tone === "warning" ? "warning" : "success"
                }`}
                title={card.trend}
              >
                {card.trend}
              </span>
            </div>
          </AdminCard>
        </motion.div>
      ))}
    </section>
  );
}
