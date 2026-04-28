import { motion, useReducedMotion } from "motion/react";
import { AdminCard } from "./AdminCard";
import { SectionHeader } from "./SectionHeader";

function getOrderBarColor(orders) {
  if (orders >= 145) return "#D95032";
  if (orders >= 125) return "#EA7A32";
  if (orders >= 105) return "#F2A33A";
  if (orders >= 90) return "#F6C65A";
  return "#F8ED8C";
}

export function OrderAnalytics({ data }) {
  const reduceMotion = useReducedMotion();

  return (
    <AdminCard className="flex flex-col p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <SectionHeader
          title="Order Analytics"
          description="Track order volume, revenue and delivery performance over time."
        />
        <div className="flex shrink-0 flex-wrap gap-2">
          {["Today", "7 Days", "30 Days", "Month"].map((filter) => (
            <button
              key={filter}
              className={`rounded-full px-3 py-1.5 text-xs ${
                filter === "7 Days"
                  ? "bg-[#0D1A2D] text-white"
                  : "bg-[#EEF2F7] text-[#5E6A7A]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 flex min-h-96 flex-1 items-end gap-3">
        {data.map((item, index) => {
          const barHeight = `${(item.orders / 156) * 100}%`;

          return (
          <div
            key={item.day}
            className="flex h-full min-w-0 flex-1 flex-col justify-end gap-3"
          >
            <motion.div
              className="rounded-t-[18px]"
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
            <span className="text-center text-xs text-[#7B8794]">
              {item.day}
            </span>
          </div>
          );
        })}
      </div>
      <motion.div
        className="mt-4 flex flex-wrap gap-4 text-xs text-[#6B7788]"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.35 }}
      >
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#EA7A32]" />
          Orders: 822
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#0D1A2D]" />
          Revenue: $4,280
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#C9D3DF]" />
          Cancelled: 14
        </span>
      </motion.div>
    </AdminCard>
  );
}
