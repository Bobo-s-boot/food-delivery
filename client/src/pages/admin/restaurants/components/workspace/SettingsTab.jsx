import { useEffect, useMemo, useRef, useState } from "react";
import { StatusBadge } from "../../../components/StatusBadge";
import { WorkspaceSection } from "./WorkspaceSection";

export function SettingsTab({
  restaurant,
  onConfirm,
  focusDetails,
  onDetailsFocused,
  onUpdateRestaurant,
  onDeleteRestaurant,
}) {
  const initialForm = useMemo(
    () => ({
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      location: restaurant.location,
      email: restaurant.email || `partner@${restaurant.id}.com`,
      description:
        restaurant.description ||
        `${restaurant.name} partner profile and customer-facing restaurant description.`,
    }),
    [restaurant],
  );

  const [form, setForm] = useState(initialForm);
  const [savedForm, setSavedForm] = useState(initialForm);
  const [saveMessage, setSaveMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firstFieldRef = useRef(null);
  const isDirty = JSON.stringify(form) !== JSON.stringify(savedForm);

  useEffect(() => {
    if (!focusDetails) return;
    firstFieldRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    firstFieldRef.current?.focus({ preventScroll: true });
    onDetailsFocused();
  }, [focusDetails, onDetailsFocused]);

  const updateField = (field) => (event) => {
    setSaveMessage("");
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const saveDetails = async (event) => {
    event.preventDefault();
    if (!isDirty || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const restaurantId = restaurant.id || restaurant._id;

      const updatedData = {
        ...restaurant,
        name: form.name,
        cuisine: form.cuisine,
        location: form.location,
        email: form.email,
        description: form.description,
      };

      await onUpdateRestaurant?.(restaurantId, updatedData);
      setSavedForm(form);
      setSaveMessage("Ресторан успешно обновлен в базе данных!");
    } catch (error) {
      console.error("Ошибка при сохранении деталей ресторана:", error);
      setSaveMessage("Не удалось сохранить изменения.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔥 Используем onDeleteRestaurant при удалении или архивации
  const handleDangerAction = async (actionType) => {
    const restaurantId = restaurant._id || restaurant.id;

    if (
      actionType === "End partnership" ||
      actionType === "Archive restaurant"
    ) {
      try {
        await onDeleteRestaurant?.(restaurantId);
      } catch (error) {
        console.error("Ошибка при удалении ресторана:", error);
      }
    } else if (actionType === "Suspend restaurant") {
      await onUpdateRestaurant?.(restaurantId, {
        ...restaurant,
        partnershipStatus: "Suspended",
      });
    } else {
      onConfirm(actionType);
    }
  };

  return (
    <div className="restaurant-workspace-columns">
      <WorkspaceSection
        title="Restaurant Details"
        className="restaurant-workspace-card--details"
      >
        {saveMessage && (
          <div className="restaurants-success" role="status">
            {saveMessage}
          </div>
        )}
        <form className="restaurant-settings-grid" onSubmit={saveDetails}>
          <label>
            Restaurant name
            <input
              ref={firstFieldRef}
              value={form.name}
              onChange={updateField("name")}
              disabled={isSubmitting}
            />
          </label>
          <label>
            Cuisine
            <input
              value={form.cuisine}
              onChange={updateField("cuisine")}
              disabled={isSubmitting}
            />
          </label>
          <label>
            Location
            <input
              value={form.location}
              onChange={updateField("location")}
              disabled={isSubmitting}
            />
          </label>
          <label>
            Contact email
            <input
              type="email"
              value={form.email}
              onChange={updateField("email")}
              disabled={isSubmitting}
            />
          </label>
          <label className="restaurant-settings-grid__wide">
            Description
            <textarea
              value={form.description}
              onChange={updateField("description")}
              disabled={isSubmitting}
            />
          </label>
          <button
            type="submit"
            className="restaurants-primary-action"
            disabled={!isDirty || isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save details"}
          </button>
        </form>
      </WorkspaceSection>
      <WorkspaceSection
        title="Partnership Details"
        className="restaurant-workspace-card--partnership"
      >
        <div className="restaurant-state-summary">
          <div>
            <span>Status</span>
            <StatusBadge value={restaurant.partnershipStatus} />
          </div>
          <div>
            <span>Commission</span>
            <strong>15% platform fee</strong>
          </div>
          <div>
            <span>Documents</span>
            <strong>
              {restaurant.issueStatus === "Missing documents"
                ? "Review required"
                : "Complete"}
            </strong>
          </div>
        </div>
      </WorkspaceSection>
      <WorkspaceSection
        title="Danger Zone"
        description="Orders, transactions and refunds remain available after these changes."
        className="restaurant-workspace-card--danger"
      >
        <div className="restaurant-danger-actions">
          <button
            type="button"
            className="is-warning"
            onClick={() => handleDangerAction("Suspend restaurant")}
          >
            Suspend restaurant
          </button>
          <button
            type="button"
            className="is-danger"
            onClick={() => handleDangerAction("End partnership")}
          >
            End partnership
          </button>
          <button
            type="button"
            onClick={() => handleDangerAction("Archive restaurant")}
          >
            Archive restaurant
          </button>
        </div>
      </WorkspaceSection>
    </div>
  );
}
