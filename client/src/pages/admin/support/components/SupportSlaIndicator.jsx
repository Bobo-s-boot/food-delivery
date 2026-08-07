export function SupportSlaIndicator({ value, compact = false }) {
  const tone = String(value || "on-track")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <span
      className={`admin-support-sla admin-support-sla--${tone} ${
        compact ? "admin-support-sla--compact" : ""
      }`}
      aria-label={`SLA: ${value}`}
    >
      <span aria-hidden="true" />
      {value}
    </span>
  );
}
