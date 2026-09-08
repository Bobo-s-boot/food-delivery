import "./AdminKpiCard.scss";

const getToneClass = (tone) =>
  String(tone || "neutral")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

export function AdminKpiGrid({
  children,
  className = "",
}) {
  return (
    <section className={`admin-kpi-grid ${className}`.trim()}>
      {children}
    </section>
  );
}

export function AdminKpiCard({
  label,
  value,
  helper,
  tone = "neutral",
  interactive = false,
  active = false,
  onClick,
  className = "",
}) {
  const Component = interactive ? "button" : "article";
  const toneClass = getToneClass(tone);
  const interactionClass = interactive
    ? "admin-kpi-card--interactive"
    : "admin-kpi-card--static";
  const activeClass = active ? "admin-kpi-card--active" : "";
  const hasHelper =
    typeof helper === "string" ? helper.trim().length > 0 : Boolean(helper);

  const interactionProps = interactive
    ? {
        type: "button",
        onClick,
        "aria-pressed": active,
      }
    : {};

  return (
    <Component
      className={`admin-kpi-card ${interactionClass} ${activeClass} ${className}`.trim()}
      {...interactionProps}
    >
      <span className="admin-kpi-card__label">{label}</span>
      <span className="admin-kpi-card__content">
        <strong className="admin-kpi-card__value">{value}</strong>
        {hasHelper && (
          <span
            className={`admin-kpi-card__chip admin-kpi-card__chip--${toneClass}`}
            title={helper}
          >
            {helper}
          </span>
        )}
      </span>
    </Component>
  );
}
