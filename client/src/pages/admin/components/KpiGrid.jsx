import { motion, useReducedMotion } from "motion/react";
import { AdminCard } from "./AdminCard";

export function KpiGrid({ cards }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="grid min-w-0 grid-cols-1 gap-4 xl:col-span-2 md:grid-cols-2 xl:grid-cols-5">
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
          <AdminCard className="p-5">
            <p className="text-sm font-medium text-[#6B7788]">{card.label}</p>
            <div className="mt-4 flex min-w-0 items-end justify-between gap-3">
              <strong className="shrink-0 text-4xl font-normal tracking-[-0.05em] text-[#0D1A2D]">
                {card.value}
              </strong>
              <span
                className={`min-w-0 truncate rounded-full px-3 py-1 text-xs ${
                  card.tone === "warning"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
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
