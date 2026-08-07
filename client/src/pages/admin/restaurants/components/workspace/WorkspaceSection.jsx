import { AdminCard } from "../../../components/AdminCard";

export function WorkspaceSection({ title, description, action, children, className = "" }) {
  return (
    <AdminCard className={`restaurant-workspace-card ${className}`.trim()}>
      <div className="restaurant-workspace-card__header">
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </AdminCard>
  );
}
