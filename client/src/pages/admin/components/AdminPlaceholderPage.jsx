import { AdminCard } from "./AdminCard";

export function AdminPlaceholderPage({ title, description }) {
  return (
    <AdminCard style={{ padding: "24px" }}>
      <div className="admin-section-header">
        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: "700",
            color: "var(--color-text-strong)",
          }}
        >
          {title}
        </h2>
        <p style={{ color: "var(--color-text-tertiary)" }}>{description}</p>
      </div>
    </AdminCard>
  );
}
