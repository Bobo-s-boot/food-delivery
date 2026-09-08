import { useState } from "react";
import { getFinanceConfirmationConfig } from "../finance.utils";
import { useFinanceDialogFocus } from "../hooks/useFinanceDialogFocus";

export function FinanceConfirmationDialog({ request, onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  const config = request
    ? getFinanceConfirmationConfig(request.action, request.item)
    : null;
  const panelRef = useFinanceDialogFocus(Boolean(config), onClose);

  if (!config) return null;

  const canConfirm = !config.requiresReason || reason.trim().length >= 4;

  return (
    <div className="finance-confirm" role="dialog" aria-modal="true" aria-labelledby="finance-confirm-title">
      <button
        type="button"
        className="finance-confirm__backdrop"
        aria-label="Close confirmation"
        onClick={onClose}
      />
      <section className="finance-confirm__panel" ref={panelRef}>
        <p className="finance-confirm__eyebrow">Confirmation required</p>
        <h2 id="finance-confirm-title">{config.action}</h2>
        <p>{config.consequence}</p>

        <dl className="finance-confirm__summary">
          <div><dt>Affected record</dt><dd>{config.entity}</dd></div>
          {config.amount && <div><dt>Amount</dt><dd>{config.amount}</dd></div>}
          <div>
            <dt>Reversible</dt>
            <dd>{config.reversible ? "Yes, from the details panel" : "No"}</dd>
          </div>
        </dl>

        {config.requiresReason && (
          <label className="finance-confirm__reason">
            Administrative reason
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Explain why this action is required..."
              rows="3"
            />
          </label>
        )}

        <p className="finance-confirm__notice">
          This preview records intent only. No money or live record will be changed.
        </p>

        <div className="finance-confirm__actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="finance-confirm__primary"
            disabled={!canConfirm}
            onClick={() => onConfirm({ ...request, reason: reason.trim() })}
          >
            Confirm {config.action.toLowerCase()}
          </button>
        </div>
      </section>
    </div>
  );
}
