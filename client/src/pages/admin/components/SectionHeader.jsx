import "../Admin.scss";

export function SectionHeader({ title, description, className = "" }) {
  return (
    <div className={`section-header ${className}`.trim()}>
      <h2 className="section-header__title">{title}</h2>
      {description && (
        <p className="section-header__description">{description}</p>
      )}
    </div>
  );
}
