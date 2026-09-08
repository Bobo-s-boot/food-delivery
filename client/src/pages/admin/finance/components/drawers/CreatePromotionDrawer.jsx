import { useState } from "react";
import { useFinanceDialogFocus } from "../../hooks/useFinanceDialogFocus";

const createFormFields = [
  ["Promotion name", "WELCOME10"],
  ["Promo code", "WELCOME10"],
  ["Type", "Promo code"],
  ["Value type", "Percent"],
  ["Value", "10"],
  ["Minimum order", "$20"],
  ["Maximum discount", "$10"],
  ["Audience", "New users"],
  ["Restaurant optional", "—"],
  ["Funding", "Platform-funded"],
  ["Start date", "Jun 1, 2026"],
  ["End date", "Jun 30, 2026"],
  ["Status", "Active"],
];

export function CreatePromotionDrawer({ onClose }) {
  const [previewMessage, setPreviewMessage] = useState("");
  const panelRef = useFinanceDialogFocus(true, onClose);

  return (
    <div className="finance-drawer" role="dialog" aria-modal="true">
      <button
        type="button"
        className="finance-drawer__backdrop"
        aria-label="Close create promotion"
        onClick={onClose}
      />
      <aside className="finance-drawer__panel" ref={panelRef}>
        <div className="finance-drawer__header">
          <div>
            <p className="finance-drawer__eyebrow">Preview only</p>
            <h2 className="finance-drawer__title">Create Promotion</h2>
          </div>
          <button
            type="button"
            className="finance-drawer__close"
            aria-label="Close create promotion"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <form
          className="finance-drawer__form"
          onSubmit={(event) => {
            event.preventDefault();
            setPreviewMessage("Preview only — no promotion was created.");
          }}
        >
          {createFormFields.map(([label, placeholder]) => (
            <label key={label}>
              {label}
              <input type="text" placeholder={placeholder} />
            </label>
          ))}
          <div className="finance-drawer__form-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Preview Create</button>
          </div>
        </form>
        {previewMessage && (
          <p className="finance-drawer__preview-message">{previewMessage}</p>
        )}
      </aside>
    </div>
  );
}
