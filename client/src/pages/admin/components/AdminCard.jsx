import "../Admin.scss";

export function AdminCard({ children, className = "", style }) {
  return (
    <section className={`admin-card ${className}`.trim()} style={style}>
      {children}
    </section>
  );
}
