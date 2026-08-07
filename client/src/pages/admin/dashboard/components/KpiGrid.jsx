import { motion, useReducedMotion } from "motion/react";
import {
  AdminKpiCard,
  AdminKpiGrid,
} from "../../components/ui/AdminKpiCard/AdminKpiCard";

export function KpiGrid({ cards }) {
  const reduceMotion = useReducedMotion();

  return (
    <AdminKpiGrid className="admin-kpi-grid--dashboard">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          className="admin-kpi-grid__item"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{
            duration: 0.42,
            delay: index * 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <AdminKpiCard
            label={card.label}
            value={card.value}
            helper={card.trend}
            tone={card.tone === "warning" ? "warning" : "success"}
          />
        </motion.div>
      ))}
    </AdminKpiGrid>
  );
}
