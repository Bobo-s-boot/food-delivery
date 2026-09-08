import { Plus } from "lucide-react";
import { StatusBadge } from "../../../components/StatusBadge";
import { WorkspaceSection } from "./WorkspaceSection";

export function OperationsTab({ restaurant }) {
  return (
    <div className="restaurant-workspace-columns">
      <WorkspaceSection title="Order Acceptance">
        <div className="restaurant-operation-hero">
          <StatusBadge
            value={restaurant.operationalAvailability === "Accepting orders" ? "Accepting orders" : "Orders paused"}
          />
          <p>
            {restaurant.operationalAvailability === "Accepting orders"
              ? "Customers can place orders."
              : "Customers cannot currently place new orders."}
          </p>
        </div>
      </WorkspaceSection>
      <WorkspaceSection
        title="Regular Opening Hours"
        action={<button type="button" className="restaurants-link-action">Edit hours</button>}
      >
        <div className="restaurant-hours">
          {[
            ["Monday – Thursday", "10:00 AM – 10:00 PM"],
            ["Friday – Saturday", "10:00 AM – 11:30 PM"],
            ["Sunday", "11:00 AM – 9:00 PM"],
          ].map(([days, hours]) => (
            <div key={days}><span>{days}</span><strong>{hours}</strong></div>
          ))}
        </div>
      </WorkspaceSection>
      <WorkspaceSection
        title="Scheduled Closures"
        className="restaurant-workspace-card--closures"
        action={(
          <button type="button" className="restaurants-link-action">
            <Plus size={15} /> Add temporary closure
          </button>
        )}
      >
        <div className="restaurants-empty restaurants-empty--compact">
          <strong>No scheduled closures</strong>
          <span>Regular hours are currently active.</span>
        </div>
      </WorkspaceSection>
      <WorkspaceSection title="Operational Issues">
        <div className="restaurant-state-summary">
          <div>
            <span>Current issue</span>
            {restaurant.issueStatus === "No active issues"
              ? <strong>No active issues</strong>
              : <StatusBadge value={restaurant.issueStatus} />}
          </div>
          <div>
            <span>Cancellation rate</span>
            <strong>{restaurant.issueStatus === "Many cancellations" ? "8.4% · elevated" : "1.8% · normal"}</strong>
          </div>
        </div>
      </WorkspaceSection>
    </div>
  );
}
