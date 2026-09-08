import "../Admin.scss";

// Теперь мы маппим статусы на короткие названия модификаторов цвета
const statusColorMap = {
  pending: "sky",
  preparing: "amber",
  delivering: "blue",
  "on the way": "blue",
  delivered: "emerald",
  cancelled: "rose",
  issue: "rose",
  problem: "rose",
  paid: "emerald",
  failed: "rose",
  high: "rose",
  medium: "amber",
  low: "slate-muted",
  "on track": "emerald",
  "due soon": "amber",
  overdue: "rose",
  "waiting for customer": "amber",
  "waiting for restaurant": "amber",
  suspended: "rose",
  deactivated: "slate-muted",
  verified: "emerald",
  "not verified": "slate-muted",
  eligible: "emerald",
  used: "slate",
  "pending verification": "amber",
  refunded: "violet",
  "partially refunded": "violet",
  processing: "amber",
  requested: "sky",
  completed: "emerald",
  expired: "slate-muted",
  "on hold": "rose",
  "platform-covered": "sky",
  "restaurant-covered": "amber",
  shared: "violet",
  "platform-funded": "sky",
  "restaurant-funded": "amber",
  "late delivery": "rose",
  "late delivery complaint": "amber",
  "missing item": "amber",
  "wrong item": "amber",
  "payment issue": "rose",
  "refund request": "violet",
  "refund requested": "violet",
  "open support ticket": "sky",
  "verification issue": "amber",
  rejected: "rose",
  "low availability": "amber",
  "low item availability": "amber",
  "many cancellations": "rose",
  "missing menu images": "amber",
  "missing documents": "amber",
  "low rating": "rose",
  "late preparation": "amber",
  "missing image": "amber",
  "10% off": "violet",
  "15% off": "violet",
  ready: "cyan",
  active: "emerald",
  approved: "emerald",
  "pending approval": "amber",
  "temporarily paused": "slate-muted",
  "closed by schedule": "slate-muted",
  "no active issues": "slate-muted",
  complete: "emerald",
  "content issues": "amber",
  "missing description": "amber",
  "missing category": "amber",
  "sold out": "rose",
  visible: "emerald",
  hidden: "slate-muted",
  archived: "slate-muted",
  "partnership ended": "slate-muted",
  "accepting orders": "emerald",
  "under review": "amber",
  "temporarily offline": "slate-muted",
  "not approved": "rose",
  available: "emerald",
  unavailable: "rose",
  open: "emerald",
  new: "sky",
  busy: "amber",
  "low stock": "amber",
  scheduled: "violet",
  draft: "slate",
  "on delivery": "blue",
  "waiting pickup": "cyan",
  "picking up": "cyan",
  "near customer": "blue",
  paused: "rose",
  "stop-listed": "rose",
  offline: "slate-muted", // Отдельный модификатор для offline
};

const normalizeStatus = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

export function StatusBadge({ value }) {
  const normalized = normalizeStatus(value);
  // Если статус не найден, используем 'slate' по умолчанию
  const colorVariant = statusColorMap[normalized] || "slate";

  return (
    <span className={`status-badge status-badge--${colorVariant}`}>
      {value}
    </span>
  );
}
