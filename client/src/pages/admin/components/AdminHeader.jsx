import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export function AdminHeader({ navItems, createActions }) {
  const [isCreateOpen, setCreateOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      className="min-w-0 rounded-[28px] border border-[#E3E8F0] bg-white px-4 py-3 shadow-[0_16px_55px_rgba(13,26,45,0.08)]"
      initial={reduceMotion ? false : { opacity: 0, y: -18 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex min-w-0 flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:justify-between">
        <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex h-11 w-max shrink-0 items-center rounded-full bg-[#0D1A2D] px-5 text-sm font-semibold text-white">
            Defilicious Admin
          </div>
          <nav className="flex min-w-0 max-w-full gap-2 overflow-x-auto rounded-full bg-[#EEF2F7] p-1">
            {navItems.map((item) => (
              <button
                key={item}
                className={`h-9 shrink-0 rounded-full px-4 text-sm transition ${
                  item === "Dashboard"
                    ? "bg-white text-[#0D1A2D] shadow-sm"
                    : "text-[#5E6A7A] hover:bg-white hover:text-[#0D1A2D]"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <input
            type="search"
            placeholder="Search orders, restaurants, users..."
            className="h-10 w-full rounded-full border border-[#D8DEE8] bg-[#F7F9FC] px-5 text-sm text-[#0D1A2D] outline-none placeholder:text-[#7B8794] focus:border-[#0D1A2D] sm:w-80"
          />
          <button className="h-10 rounded-full bg-[#EEF2F7] px-4 text-sm text-[#0D1A2D]">
            Today
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2F7] text-sm text-[#0D1A2D]">
            !
          </button>
          <div className="relative">
            <button
              onClick={() => setCreateOpen((value) => !value)}
              className="h-10 rounded-full bg-[#0D1A2D] px-5 text-sm font-medium text-white"
            >
              + Create
            </button>
            {isCreateOpen && (
              <div className="absolute right-0 top-12 z-20 w-48 rounded-2xl border border-[#E3E8F0] bg-white p-2 shadow-2xl">
                {createActions.map((action) => (
                  <button
                    key={action}
                    className="block w-full rounded-xl px-3 py-2 text-left text-sm text-[#5E6A7A] hover:bg-[#F4F7FB] hover:text-[#0D1A2D]"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8F0D8] text-sm font-semibold text-[#0D1A2D]">
            AD
          </div>
        </div>
      </div>
    </motion.header>
  );
}
