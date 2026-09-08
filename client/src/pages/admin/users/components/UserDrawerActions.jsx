import { useState } from "react";
import { Link } from "react-router-dom";

export function UserDrawerActions({
  user,
  hasSupportIssue,
  ordersRoute,
  supportRoute,
  onAddInternalNote,
  onStatusChange,
}) {
  const [actionMessage, setActionMessage] = useState("");
  const [isInternalNoteOpen, setIsInternalNoteOpen] = useState(false);
  const [internalNote, setInternalNote] = useState("");
  const [isSuspendConfirmationOpen, setIsSuspendConfirmationOpen] = useState(false);

  const submitInternalNote = (event) => {
    event.preventDefault();
    const message = internalNote.trim();
    if (!message) return;

    onAddInternalNote(user.id, message);
    setInternalNote("");
    setIsInternalNoteOpen(false);
    setActionMessage(
      "Internal note added locally. Users mutation API is not connected yet.",
    );
  };

  const handleMockAction = (message) => {
    setActionMessage(
      `${message} is local only. Users mutation API is not connected yet.`,
    );
  };

  return (
    <>
      <section className="user-drawer__section user-drawer__actions-section">
        <h3>Actions</h3>
        <div className="user-drawer__actions user-drawer__actions--common">
          <Link to={ordersRoute} className="user-drawer__action user-drawer__action--primary">
            View all orders
          </Link>
          <button
            type="button"
            className="user-drawer__action"
            onClick={() => setIsInternalNoteOpen((open) => !open)}
          >
            Add internal note
          </button>
        </div>

        {isInternalNoteOpen && (
          <form className="user-drawer__note-form" onSubmit={submitInternalNote}>
            <label htmlFor={`internal-note-${user.id}`}>Private administrator note</label>
            <textarea
              id={`internal-note-${user.id}`}
              value={internalNote}
              onChange={(event) => setInternalNote(event.target.value)}
              placeholder="Write an internal note..."
              rows="3"
            />
            <div>
              <button type="button" onClick={() => setIsInternalNoteOpen(false)}>Cancel</button>
              <button type="submit" disabled={!internalNote.trim()}>Add note</button>
            </div>
          </form>
        )}

        <div className="user-drawer__support-action">
          {hasSupportIssue ? (
            <Link to={supportRoute} className="user-drawer__action">Open support ticket</Link>
          ) : (
            <button
              type="button"
              className="user-drawer__action"
              onClick={() => handleMockAction("Create support ticket")}
            >
              Create support ticket
            </button>
          )}
        </div>

        <div className="user-drawer__account-control">
          <p>Account control</p>
          {user.status === "Active" && (
            <button
              type="button"
              className="user-drawer__action user-drawer__action--danger"
              onClick={() => setIsSuspendConfirmationOpen(true)}
            >
              Suspend user
            </button>
          )}
          {user.status === "Suspended" && (
            <button
              type="button"
              className="user-drawer__action"
              onClick={() => {
                onStatusChange(user.id, "Active");
                setActionMessage(
                  "User reactivated locally. Users mutation API is not connected yet.",
                );
              }}
            >
              Reactivate user
            </button>
          )}
          {user.status === "Deactivated" && (
            <button
              type="button"
              className="user-drawer__action"
              onClick={() => handleMockAction("View account history")}
            >
              View account history
            </button>
          )}
        </div>

        {user.notes?.length > 0 && (
          <p className="user-drawer__latest-note">
            Latest internal note · {user.notes[user.notes.length - 1].timestamp}<br />
            {user.notes[user.notes.length - 1].message}
          </p>
        )}
        {actionMessage && <p className="user-drawer__preview-message">{actionMessage}</p>}
      </section>

      {isSuspendConfirmationOpen && (
        <div className="user-confirm" role="alertdialog" aria-modal="true" aria-labelledby="user-confirm-title">
          <button
            type="button"
            className="user-confirm__backdrop"
            aria-label="Cancel suspension"
            onClick={() => setIsSuspendConfirmationOpen(false)}
          />
          <section className="user-confirm__panel">
            <p className="user-confirm__eyebrow">Confirmation required</p>
            <h3 id="user-confirm-title">Suspend {user.name}?</h3>
            <p>The user will no longer be able to place orders.</p>
            <p>Their order, payment and support history will remain available. This action can be reversed.</p>
            <div className="user-confirm__actions">
              <button type="button" onClick={() => setIsSuspendConfirmationOpen(false)}>Cancel</button>
              <button
                type="button"
                className="user-confirm__primary"
                onClick={() => {
                  // TODO(users-api): persist the reversible account suspension.
                  onStatusChange(user.id, "Suspended");
                  setIsSuspendConfirmationOpen(false);
                  setActionMessage(
                    "User suspended locally. Users mutation API is not connected yet.",
                  );
                }}
              >
                Suspend user
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
