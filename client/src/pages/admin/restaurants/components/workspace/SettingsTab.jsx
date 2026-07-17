import { useEffect, useMemo, useRef, useState } from "react";
import { StatusBadge } from "../../../components/StatusBadge";
import { WorkspaceSection } from "./WorkspaceSection";

export function SettingsTab({ restaurant, onConfirm, focusDetails, onDetailsFocused }) {
  const initialForm = useMemo(() => ({
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    location: restaurant.location,
    email: `partner@${restaurant.id}.com`,
    description: `${restaurant.name} partner profile and customer-facing restaurant description.`,
  }), [restaurant]);
  const [form, setForm] = useState(initialForm);
  const [savedForm, setSavedForm] = useState(initialForm);
  const [saveMessage, setSaveMessage] = useState("");
  const firstFieldRef = useRef(null);
  const isDirty = JSON.stringify(form) !== JSON.stringify(savedForm);

  useEffect(() => {
    if (!focusDetails) return;
    firstFieldRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    firstFieldRef.current?.focus({ preventScroll: true });
    onDetailsFocused();
  }, [focusDetails, onDetailsFocused]);

  const updateField = (field) => (event) => {
    setSaveMessage("");
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const saveDetails = (event) => {
    event.preventDefault();
    if (!isDirty) return;
    // TODO(restaurants-api): persist edited restaurant details.
    setSavedForm(form);
    setSaveMessage("Restaurant details saved in this preview.");
  };

  return (
    <div className="restaurant-workspace-columns">
      <WorkspaceSection title="Restaurant Details" className="restaurant-workspace-card--details">
        {saveMessage && <div className="restaurants-success" role="status">{saveMessage}</div>}
        <form className="restaurant-settings-grid" onSubmit={saveDetails}>
          <label>
            Restaurant name
            <input ref={firstFieldRef} value={form.name} onChange={updateField("name")} />
          </label>
          <label>Cuisine<input value={form.cuisine} onChange={updateField("cuisine")} /></label>
          <label>Location<input value={form.location} onChange={updateField("location")} /></label>
          <label>Contact email<input type="email" value={form.email} onChange={updateField("email")} /></label>
          <label className="restaurant-settings-grid__wide">
            Description
            <textarea value={form.description} onChange={updateField("description")} />
          </label>
          <button type="submit" className="restaurants-primary-action" disabled={!isDirty}>Save details</button>
        </form>
      </WorkspaceSection>
      <WorkspaceSection title="Partnership Details" className="restaurant-workspace-card--partnership">
        <div className="restaurant-state-summary">
          <div><span>Status</span><StatusBadge value={restaurant.partnershipStatus} /></div>
          <div><span>Commission</span><strong>15% platform fee</strong></div>
          <div>
            <span>Documents</span>
            <strong>{restaurant.issueStatus === "Missing documents" ? "Review required" : "Complete"}</strong>
          </div>
        </div>
      </WorkspaceSection>
      <WorkspaceSection
        title="Danger Zone"
        description="Orders, transactions and refunds remain available after these changes."
        className="restaurant-workspace-card--danger"
      >
        <div className="restaurant-danger-actions">
          <button type="button" className="is-warning" onClick={() => onConfirm("Suspend restaurant")}>
            Suspend restaurant
          </button>
          <button type="button" className="is-danger" onClick={() => onConfirm("End partnership")}>
            End partnership
          </button>
          <button type="button" onClick={() => onConfirm("Archive restaurant")}>Archive restaurant</button>
        </div>
      </WorkspaceSection>
    </div>
  );
}
