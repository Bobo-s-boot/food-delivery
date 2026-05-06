import { motion, useReducedMotion } from "motion/react";

export function AdminIntro() {
  const reduceMotion = useReducedMotion();
  const itemMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <section className="xl:col-span-2">
      <div className="flex flex-col gap-1 py-3">
        <motion.p
          className="text-sm text-[#6B7788]"
          {...itemMotion}
          transition={{ ...itemMotion.transition, delay: 0.08 }}
        >
          Please respond to changes
        </motion.p>
        <motion.h1
          className="text-[38px] font-normal leading-none tracking-[-0.05em] text-[#0D1A2D] md:text-[56px]"
          {...itemMotion}
          transition={{ ...itemMotion.transition, delay: 0.16 }}
        >
          Good morning, <span className="text-[#8E98A6]">Admin</span>
        </motion.h1>
        <motion.p
          className="max-w-190 text-base text-[#5E6A7A]"
          {...itemMotion}
          transition={{ ...itemMotion.transition, delay: 0.24 }}
        >
          Here's what's happening with Defilicious today.
        </motion.p>
      </div>
    </section>
  );
}
