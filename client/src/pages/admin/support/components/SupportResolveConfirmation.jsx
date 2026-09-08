export function SupportResolveConfirmation({ ticket, onCancel, onResolve }) {
  return (
    <div className="support-confirm" role="alertdialog" aria-modal="true" aria-labelledby="support-confirm-title">
      <button
        type="button"
        className="support-confirm__backdrop"
        aria-label="Cancel resolution"
        onClick={onCancel}
      />
      <section className="support-confirm__panel">
        <p className="support-confirm__eyebrow">Confirmation required</p>
        <h3 id="support-confirm-title">Mark {ticket.ticketId} as resolved?</h3>
        <p>The ticket will move to the resolved state.</p>
        <div className="support-confirm__actions">
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="support-confirm__primary"
            onClick={onResolve}
          >
            Mark resolved
          </button>
        </div>
      </section>
    </div>
  );
}
