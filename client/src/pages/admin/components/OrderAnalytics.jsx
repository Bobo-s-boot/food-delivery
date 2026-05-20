import { motion, useReducedMotion } from "motion/react";
import { AdminCard } from "./AdminCard";
import { SectionHeader } from "./SectionHeader";
import "../Admin.scss";

function getOrderBarColor(orders) {
  if (orders >= 145) return "#D95032";
  if (orders >= 125) return "#EA7A32";
  if (orders >= 105) return "#F2A33A";
  if (orders >= 90) return "#F6C65A";
  return "#F8ED8C";
}

export function OrderAnalytics({ data }) {
  const reduceMotion = useReducedMotion();
  const totalOrders = data.reduce((sum, item) => sum + (item.orders || 0), 0);
  const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const maxOrders = Math.max(...data.map((item) => item.orders || 0), 1);

  return (
    <AdminCard className="order-analytics">
      <div className="order-analytics__header">
        <SectionHeader
          title="Order Analytics"
          description="Track order volume, revenue and delivery performance over time."
        />
        <div className="order-analytics__filters">
          {["Today", "7 Days", "30 Days", "Month"].map((filter) => (
            <button
              key={filter}
              className={`order-analytics__filter-btn ${
                filter === "7 Days" ? "order-analytics__filter-btn--active" : ""
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="order-analytics__chart">
        {data.length > 0 ? (
          data.map((item, index) => {
            const barHeight = `${Math.max(
              ((item.orders || 0) / maxOrders) * 100,
              16,
            )}%`;

            return (
              <div key={item.day} className="order-analytics__bar-group">
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
                <span className="order-analytics__day-label">{item.day}</span>
              </div>
            );
          })
        ) : (
          <div className="order-analytics__empty">
            Нет данных для отображения графика заказов.
          </div>
        )}
      </div>

      <motion.div
        className="order-analytics__legend"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.35 }}
      >
        <span className="order-analytics__legend-item">
          <span className="order-analytics__legend-dot order-analytics__legend-dot--orders" />
          Orders: {totalOrders}
        </span>
        <span className="order-analytics__legend-item">
          <span className="order-analytics__legend-dot order-analytics__legend-dot--revenue" />
          Revenue: ${totalRevenue.toFixed(2)}
        </span>
        <span className="order-analytics__legend-item">
          <span className="order-analytics__legend-dot order-analytics__legend-dot--cancelled" />
          Cancelled: 0
        </span>
      </motion.div>
    </AdminCard>
  );
}
