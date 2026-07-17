import { motion, useReducedMotion } from "motion/react";
import { AdminCard } from "../../components/AdminCard";
import { SectionHeader } from "../../components/SectionHeader";

function getOrderBarColor(orders) {
  if (orders >= 145) return "#D95032";
  if (orders >= 125) return "#EA7A32";
  if (orders >= 105) return "#F2A33A";
  if (orders >= 90) return "#F6C65A";
  return "#F8ED8C";
}

export function OrderAnalytics({
  data,
  title = "Order Analytics",
  description,
  activePeriod,
  periods = [],
  onPeriodChange,
}) {
  const reduceMotion = useReducedMotion();
  const maxOrders = Math.max(...data.map((item) => item.orders || 0), 1);

  return (
    <AdminCard className="order-analytics order-analytics--compact">
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

      <div
        className={`order-analytics__chart ${
          activePeriod === "Today" ? "order-analytics__chart--today" : ""
        }`}
      >
        {data.length > 0 ? (
          data.map((item, index) => {
            const barHeight = `${Math.max(
              ((item.orders || 0) / maxOrders) * 100,
              16,
            )}%`;

            return (
              <div
                key={item.label || item.day}
                className={`order-analytics__bar-group ${
                  activePeriod === "Today"
                    ? "order-analytics__bar-group--today"
                    : ""
                }`}
              >
                <motion.div
                  className="order-analytics__bar"
                  initial={
                    reduceMotion
                      ? { height: barHeight, opacity: 1 }
                      : { height: "18%", opacity: 0.55 }
                  }
                  animate={{ height: barHeight, opacity: 1 }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    background: `linear-gradient(180deg, ${getOrderBarColor(
                      item.orders,
                    )} 0%, #F8ED8C 100%)`,
                  }}
                />
                <span className="order-analytics__day-label">
                  {item.label || item.day}
                </span>
              </div>
            );
          })
        ) : (
          <div className="order-analytics__empty">
            Нет данных для отображения графика заказов.
          </div>
        )}
      </div>

    </AdminCard>
  );
}
