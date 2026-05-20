import { motion, useReducedMotion } from "motion/react";
import { AdminCard } from "./AdminCard";
import { SectionHeader } from "./SectionHeader";
import "../Admin.scss";

export function PeakHours({ data }) {
  const reduceMotion = useReducedMotion();
  const maxOrders = Math.max(...data.map((item) => item.orders || 0), 1);

  return (
    <AdminCard className="peak-hours">
      <SectionHeader title="Peak Hours" />
      <div className="peak-hours__wrapper">
        <div className="peak-hours__chart-box">
          {/* Сетка на фоне и центральная линия */}
          <div className="peak-hours__grid-bg" />
          <div className="peak-hours__mid-line" />

          {/* Столбики графика */}
          <div className="peak-hours__bars-container">
            {data.length > 0 ? (
              data.map((item, index) => {
                const barHeight = `${Math.max(
                  ((item.orders || 0) / maxOrders) * 100,
                  18,
                )}%`;

                return (
                  <div
                    key={`${item.time}-${index}`}
                    className="peak-hours__bar-group"
                  >
                    <motion.div
                      className="peak-hours__bar"
                      initial={reduceMotion ? false : { scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{
                        duration: 0.55,
                        delay: index * 0.02,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{
                        height: barHeight,
                        transformOrigin: "bottom",
                      }}
                    />

                    {/* Tooltip (подсказка при наведении) */}
                    <div className="peak-hours__tooltip">
                      <p className="peak-hours__tooltip-orders">
                        {item.orders} orders
                      </p>
                      <p className="peak-hours__tooltip-time">at {item.time}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="peak-hours__empty">
                Нет данных для пиковых часов.
              </div>
            )}
          </div>

          {/* Метки времени (Ось X) */}
          <div className="peak-hours__x-axis">
            {data.length > 0
              ? data.map((item) => <span key={item.time}>{item.time}</span>)
              : Array.from({ length: 6 }).map((_, index) => (
                  <span key={index}>--:--</span>
                ))}
          </div>
        </div>
      </div>
    </AdminCard>
  );
}
