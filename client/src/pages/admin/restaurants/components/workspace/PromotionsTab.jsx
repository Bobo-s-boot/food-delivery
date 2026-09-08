import { Plus } from "lucide-react";
import { StatusBadge } from "../../../components/StatusBadge";
import { WorkspaceSection } from "./WorkspaceSection";

export function PromotionsTab({ promotions, onOpenFinance }) {
  return (
    <WorkspaceSection
      title="Restaurant Promotions"
      action={(
        <button
          type="button"
          className="restaurants-primary-action restaurant-promotions-create"
          onClick={onOpenFinance}
        >
          <Plus size={16} /> Create promotion
        </button>
      )}
    >
      {promotions.length ? (
        <div className="restaurant-promotions-list">
          <div className="restaurant-promotions-list__header">
            <span>Promotion</span>
            <span>Status</span>
            <span>Period</span>
            <span>Funding</span>
            <span>Usage</span>
            <span>Cost</span>
            <span>Action</span>
          </div>
          {promotions.map((promotion) => (
            <article key={promotion.code}>
              <div><strong>{promotion.name}</strong><span>{promotion.value} · {promotion.type}</span></div>
              <StatusBadge value={promotion.status} />
              <span>{promotion.validity}</span>
              <span>{promotion.funding}</span>
              <span>{promotion.usageTotal} uses</span>
              <strong>{promotion.costToday}</strong>
              <button type="button" className="restaurants-action">View promotion</button>
            </article>
          ))}
        </div>
      ) : (
        <div className="restaurants-empty">
          <strong>No active promotions</strong>
          <span>Create a promotion for this restaurant.</span>
        </div>
      )}
    </WorkspaceSection>
  );
}
