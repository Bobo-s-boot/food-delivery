const statusStyles = {
  pending: "bg-sky-50 text-sky-700 border-sky-200",
  preparing: "bg-amber-50 text-amber-700 border-amber-200",
  delivering: "bg-blue-50 text-blue-700 border-blue-200",
  "on the way": "bg-blue-50 text-blue-700 border-blue-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  ready: "bg-cyan-50 text-cyan-700 border-cyan-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  open: "bg-emerald-50 text-emerald-700 border-emerald-200",
  new: "bg-sky-50 text-sky-700 border-sky-200",
  busy: "bg-amber-50 text-amber-700 border-amber-200",
  "low stock": "bg-amber-50 text-amber-700 border-amber-200",
  scheduled: "bg-violet-50 text-violet-700 border-violet-200",
  draft: "bg-slate-100 text-slate-600 border-slate-200",
  "on delivery": "bg-blue-50 text-blue-700 border-blue-200",
  "waiting pickup": "bg-cyan-50 text-cyan-700 border-cyan-200",
  paused: "bg-rose-50 text-rose-700 border-rose-200",
  "stop-listed": "bg-rose-50 text-rose-700 border-rose-200",
  offline: "bg-slate-100 text-slate-500 border-slate-200",
};

const normalizeStatus = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

export function StatusBadge({ value }) {
  const normalized = normalizeStatus(value);
  const badgeStyles =
    statusStyles[normalized] || "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <span
      className={`inline-flex w-max items-center rounded-full border px-3 py-1 text-xs font-medium ${badgeStyles}`}
    >
      {value}
    </span>
  );
}
