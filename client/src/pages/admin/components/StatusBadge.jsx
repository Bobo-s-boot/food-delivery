import "../Admin.scss";

// Теперь мы маппим статусы на короткие названия модификаторов цвета
const statusColorMap = {
  pending: "sky",
  preparing: "amber",
  delivering: "blue",
  "on the way": "blue",
  delivered: "emerald",
  cancelled: "rose",
  ready: "cyan",
  active: "emerald",
  available: "emerald",
  open: "emerald",
  new: "sky",
  busy: "amber",
  "low stock": "amber",
  scheduled: "violet",
  draft: "slate",
  "on delivery": "blue",
  "waiting pickup": "cyan",
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
