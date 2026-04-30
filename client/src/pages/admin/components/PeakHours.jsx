import { motion, useReducedMotion } from "motion/react";
import { AdminCard } from "./AdminCard";
import { SectionHeader } from "./SectionHeader";

const peakSeries = [
  18, 20, 22, 24, 25, 27, 29, 31, 33, 36, 42, 48, 54, 59, 64, 68, 72, 76, 78,
  77, 74, 70, 66, 62, 58, 55, 53, 51,
];
const peakMarkers = [10, 18, 27];

export function PeakHours({ labels }) {
  const reduceMotion = useReducedMotion();
  const peakMax = Math.max(...peakSeries);

  return (
    <AdminCard className="p-5 md:p-6">
      <SectionHeader title="Peak Hours" />
      <div className="mt-5 rounded-[22px] bg-[#F7F9FC] p-4">
        <div className="relative h-52 overflow-hidden rounded-[18px] border border-[#E3E8F0] bg-white px-3 pb-9 pt-6">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#E8EDF4_1px,transparent_1px),linear-gradient(to_bottom,#E8EDF4_1px,transparent_1px)] bg-[size:44px_44px]" />
          <div className="absolute inset-x-0 top-[52%] h-px bg-[#D8DEE8]" />

          <div className="relative flex h-full items-end gap-1.5">
            {peakSeries.map((value, index) => {
              const isMarker = peakMarkers.includes(index);
              const markerTime =
                labels[Math.min(Math.floor(index / 5), labels.length - 1)]
                  ?.time || "20:00";
              const tooltipSide =
                index > peakSeries.length / 2 ? "right-full mr-3" : "left-full ml-3";

              return (
                <div
                  key={`${value}-${index}`}
                  className="group relative flex h-full min-w-0 flex-1 items-end justify-center"
                >
                  <motion.div
                    className={`w-1 rounded-full transition duration-200 group-hover:bg-[#8BC53F] ${
                      isMarker ? "bg-[#8BC53F]" : "bg-[#0D1A2D]"
                    }`}
                    initial={reduceMotion ? false : { scaleY: 0 }}
                    animate={reduceMotion ? undefined : { scaleY: 1 }}
                    transition={{
                      duration: 0.55,
                      delay: index * 0.018,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      height: `${Math.max((value / peakMax) * 100, 18)}%`,
                      transformOrigin: "bottom",
                    }}
                  />

                  {isMarker && (
                    <>
                      <motion.div
                        className="absolute bottom-0 w-px bg-[#8BC53F]"
                        initial={reduceMotion ? false : { scaleY: 0 }}
                        animate={reduceMotion ? undefined : { scaleY: 1 }}
                        transition={{
                          duration: 0.65,
                          delay: index * 0.018 + 0.12,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{
                          height: `${
                            Math.max((value / peakMax) * 100, 18) + 4
                          }%`,
                          transformOrigin: "bottom",
                        }}
                      />
                      <motion.div
                        className="absolute z-10 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#8BC53F] shadow-md"
                        initial={reduceMotion ? false : { opacity: 0, scale: 0 }}
                        animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.35,
                          delay: index * 0.018 + 0.32,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{
                          bottom: `${Math.max((value / peakMax) * 100, 18)}%`,
                        }}
                      />
                    </>
                  )}

                  <div
                    className={`absolute bottom-1/2 z-20 hidden translate-y-1/2 rounded-2xl bg-[#0D1A2D] px-3 py-2 text-xs whitespace-nowrap text-white shadow-xl group-hover:block ${tooltipSide}`}
                  >
                    <p className="font-semibold">{value} orders</p>
                    <p className="text-white/60">at {markerTime}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute inset-x-4 bottom-3 grid grid-cols-6 text-center text-[11px] text-[#7B8794]">
            {labels.map((item) => (
              <span key={item.time}>{item.time}</span>
            ))}
          </div>
        </div>
      </div>
    </AdminCard>
  );
}
