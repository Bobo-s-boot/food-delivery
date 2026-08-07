import { useState } from "react";

export function SupportTicketComposer({ ticket, onAddTimelineEntry }) {
  const [composerMode, setComposerMode] = useState("reply");
  const [draft, setDraft] = useState("");

  const submitComposer = (event) => {
    event.preventDefault();
    const message = draft.trim();
    if (!message) return;

    onAddTimelineEntry(ticket.ticketId, {
      author: composerMode === "reply" ? "Support" : "Support note",
      timestamp: "Just now",
      text: message,
    });
    setDraft("");
  };

  return (
    <footer className="support-drawer__composer-footer">
      <div className="support-drawer__composer-tabs" role="group" aria-label="Composer mode">
        <button
          type="button"
          className={composerMode === "reply" ? "is-active" : ""}
          aria-pressed={composerMode === "reply"}
          onClick={() => setComposerMode("reply")}
        >
          Reply
        </button>
        <button
          type="button"
          className={composerMode === "note" ? "is-active" : ""}
          aria-pressed={composerMode === "note"}
          onClick={() => setComposerMode("note")}
        >
          Internal note
        </button>
      </div>
      <form className="support-drawer__composer" onSubmit={submitComposer}>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={
            composerMode === "reply"
              ? "Write a reply to the customer..."
              : "Write an internal note..."
          }
          aria-label={composerMode === "reply" ? "Reply to customer" : "Internal note"}
          rows="2"
        />
        <button type="submit" disabled={!draft.trim()}>
          {composerMode === "reply" ? "Send reply" : "Add internal note"}
        </button>
      </form>
      <p className="support-drawer__composer-note">
        {composerMode === "reply"
          ? "Replies are visible to the customer."
          : "Internal notes stay private to the administrator."}
      </p>
    </footer>
  );
}
