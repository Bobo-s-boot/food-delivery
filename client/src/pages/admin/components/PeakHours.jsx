import { motion, useReducedMotion } from "motion/react";
import { AdminCard } from "./AdminCard";
import { SectionHeader } from "./SectionHeader";

export function PeakHours({ data }) {
  const reduceMotion = useReducedMotion();
  const maxOrders = Math.max(...data.map((item) => item.orders || 0), 1);

  return (
    <AdminCard className="p-5 md:p-6">
      <SectionHeader title="Peak Hours" />
      <div className="mt-5 rounded-[22px] bg-[#F7F9FC] p-4">
        <div className="relative h-52 overflow-hidden rounded-[18px] border border-[#E3E8F0] bg-white px-3 pb-9 pt-6">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#E8EDF4_1px,transparent_1px),linear-gradient(to_bottom,#E8EDF4_1px,transparent_1px)] bg-size-[44px_44px]" />
          <div className="absolute inset-x-0 top-[52%] h-px bg-[#D8DEE8]" />

          <div className="relative flex h-full items-end gap-2">
            {data.length > 0 ? (
              data.map((item, index) => {
                const barHeight = `${Math.max(
                  ((item.orders || 0) / maxOrders) * 100,
                  18,
                )}%`;

                return (
                  <div
                    key={`${item.time}-${index}`}
                    className="group relative flex h-full min-w-0 flex-1 items-end justify-center"
                  >
                    <motion.div
                      className="w-2 rounded-full bg-[#0D1A2D] transition duration-200 group-hover:bg-[#8BC53F]"
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
                    <div className="absolute bottom-full mb-2 hidden rounded-2xl bg-[#0D1A2D] px-3 py-2 text-xs text-white shadow-xl group-hover:block">
                      <p className="font-semibold">{item.orders} orders</p>
                      <p className="text-white/60">at {item.time}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex min-h-48 flex-1 items-center justify-center text-sm text-[#5E6A7A]">
                Нет данных для пиковых часов.
              </div>
            )}
          </div>

          <div className="absolute inset-x-4 bottom-3 grid grid-cols-6 text-center text-[11px] text-[#7B8794]">
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
