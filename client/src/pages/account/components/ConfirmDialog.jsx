export function ConfirmDialog({
  title,
  text,
  confirmLabel,
  tone = "default",
  onCancel,
  onConfirm,
}) {
  return (
    <div className="account-modal" role="dialog" aria-modal="true">
      <div className="account-modal__panel">
        <span className="account-eyebrow">Confirm action</span>
        <h2>{title}</h2>
        <p>{text}</p>
        <div className="account-actions-row">
          <button
            type="button"
            className="account-button account-button--secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`account-button ${
              tone === "danger"
                ? "account-button--danger"
                : "account-button--primary"
            }`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
