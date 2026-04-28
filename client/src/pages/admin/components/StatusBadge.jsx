const statusStyles = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Open: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  New: "bg-sky-50 text-sky-700 border-sky-200",
  Ready: "bg-cyan-50 text-cyan-700 border-cyan-200",
  Preparing: "bg-amber-50 text-amber-700 border-amber-200",
  Busy: "bg-amber-50 text-amber-700 border-amber-200",
  "Low stock": "bg-amber-50 text-amber-700 border-amber-200",
  Scheduled: "bg-violet-50 text-violet-700 border-violet-200",
  Draft: "bg-slate-100 text-slate-600 border-slate-200",
  "On the way": "bg-violet-50 text-violet-700 border-violet-200",
  "On delivery": "bg-violet-50 text-violet-700 border-violet-200",
  "Waiting pickup": "bg-cyan-50 text-cyan-700 border-cyan-200",
  Paused: "bg-rose-50 text-rose-700 border-rose-200",
  "Stop-listed": "bg-rose-50 text-rose-700 border-rose-200",
  Offline: "bg-slate-100 text-slate-500 border-slate-200",
};

export function StatusBadge({ value }) {
  return (
    <span
      className={`inline-flex w-max items-center rounded-full border px-3 py-1 text-xs font-medium ${
        statusStyles[value] || "bg-slate-100 text-slate-600 border-slate-200"
      }`}
    >
      {value}
    </span>
  );
}
