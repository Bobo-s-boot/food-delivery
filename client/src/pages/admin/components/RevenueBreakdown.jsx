import { motion, useReducedMotion } from "motion/react";
import { AdminCard } from "./AdminCard";
import { SectionHeader } from "./SectionHeader";

export function RevenueBreakdown({ data }) {
  const reduceMotion = useReducedMotion();

  return (
    <AdminCard className="p-5 md:p-6">
      <SectionHeader title="Revenue Breakdown" />
      <div className="mt-6 space-y-4">
        {data.map((item, index) => (
          <div key={item.label}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-[#5E6A7A]">{item.label}</span>
              <span className="font-medium">{item.value}%</span>
            </div>
            
            <div className="h-3 overflow-hidden rounded-full bg-[#E8EDF4]">
              <motion.div
                className="h-full rounded-full bg-[#0D1A2D]"
                initial={reduceMotion ? false : { width: 0 }}
                animate={reduceMotion ? undefined : { width: `${item.value}%` }}
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
