import { motion, useReducedMotion } from "motion/react";
import { AdminCard } from "../../components/AdminCard";
import { SectionHeader } from "../../components/SectionHeader";

export function RevenueBreakdown({
  data,
  title = "Revenue Breakdown",
  description,
  activePeriod,
  periods = [],
  onPeriodChange,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <AdminCard className="revenue-breakdown">
      <div className="order-analytics__header">
        <SectionHeader title={title} description={description} />
        {onPeriodChange && periods.length > 0 && (
          <div className="order-analytics__filters">
            {periods.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => onPeriodChange?.(filter)}
                className={`order-analytics__filter-btn ${
                  filter === activePeriod
                    ? "order-analytics__filter-btn--active"
                    : ""
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="revenue-breakdown__list">
        {data.map((item, index) => (
          <div key={item.label} className="revenue-breakdown__item">
            <div className="revenue-breakdown__header">
              <span className="revenue-breakdown__label">{item.label}</span>
              <span className="revenue-breakdown__value">{item.value}</span>
            </div>

            <div className="revenue-breakdown__track">
              <motion.div
                className="revenue-breakdown__bar"
                initial={reduceMotion ? false : { width: 0 }}
                animate={
                  reduceMotion
                    ? undefined
                    : { width: `${item.progress ?? item.value}%` }
                }
                transition={{
                  duration: 0.8,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </AdminCard>
  );
}
