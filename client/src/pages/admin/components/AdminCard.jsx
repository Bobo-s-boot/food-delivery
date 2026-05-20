import "../Admin.scss";

export function AdminCard({ children, className = "" }) {
  return (
    <section className={`admin-card ${className}`.trim()}>{children}</section>
  );
}
