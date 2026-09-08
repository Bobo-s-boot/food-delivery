const dangerousActions = ["Archive restaurant", "End partnership", "Suspend restaurant"];

const getActionConsequences = (action, restaurantName) => {
  const consequences = {
    "Suspend restaurant": `${restaurantName} will become unavailable to customers. Orders and history remain preserved, and this action can be reversed.`,
    "End partnership": `${restaurantName} will no longer operate as a platform partner and its menu items will become unavailable. Historical records remain preserved.`,
    "Archive restaurant": `${restaurantName} will be removed from active admin lists. Historical records remain accessible, and no orders or financial records will be deleted.`,
  };

  return consequences[action] || `This updates the current operational state for ${restaurantName}.`;
};

export function RestaurantConfirmationDialog({ action, restaurant, onClose, onConfirm }) {
  if (!action) return null;

  const dangerous = dangerousActions.includes(action);

  return (
    <div className="restaurants-dialog" role="dialog" aria-modal="true" aria-labelledby="restaurant-confirm-title">
      <button
        type="button"
        className="restaurants-dialog__backdrop"
        aria-label="Close confirmation"
        onClick={onClose}
      />
      <div className="restaurants-dialog__panel">
        <h2 id="restaurant-confirm-title">{action}?</h2>
        <p>{getActionConsequences(action, restaurant.name)}</p>
        <div className="restaurants-dialog__actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className={action === "End partnership" ? "is-danger" : dangerous ? "is-warning" : "is-primary"}
            onClick={() => onConfirm(action)}
          >
            {action}
          </button>
        </div>
      </div>
    </div>
  );
}
