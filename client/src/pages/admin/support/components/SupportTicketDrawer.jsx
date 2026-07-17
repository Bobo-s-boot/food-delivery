import { useState } from "react";
import { ExternalLink, X } from "lucide-react";
import { Link } from "react-router-dom";
import { StatusBadge } from "../../components/StatusBadge";
import {
  getSupportActionKind,
  getSupportEventType,
  getSupportRecordRoute,
  getSupportTimelineTimestamp,
  getWorkflowActionsForTicket,
} from "../support.utils";
import { SupportResolveConfirmation } from "./SupportResolveConfirmation";
import { SupportTicketComposer } from "./SupportTicketComposer";

const isUsableRecord = ([, value]) =>
  value && !String(value).toLowerCase().startsWith("no linked");

function SupportRecordLink({ adminBasePath, label, value, compact = false }) {
  const route = getSupportRecordRoute(label, adminBasePath);

  if (!route || !isUsableRecord([label, value])) {
    return <span>{value}</span>;
  }

  return (
    <Link
      to={route}
      className={`support-record-link ${
        compact ? "support-record-link--compact" : ""
      }`}
      aria-label={`Open ${label.toLowerCase()}: ${value}`}
    >
      <span>{value}</span>
      <ExternalLink aria-hidden="true" size={13} strokeWidth={2} />
    </Link>
  );
}

export function SupportTicketDrawer({
  ticket,
  adminBasePath,
  onAddTimelineEntry,
  onClose,
  onMockAction,
  onResolve,
  onReopen,
}) {
  const [isResolveConfirmationOpen, setIsResolveConfirmationOpen] = useState(false);
  const workflowActions = getWorkflowActionsForTicket(ticket);

  if (!ticket) return null;

  const headerRecords = (ticket.linkedRecords || [])
    .filter(([label]) => ["Order", "Restaurant"].includes(label))
    .filter(isUsableRecord);

  const handleWorkflowAction = (action) => {
    if (action === "Mark resolved") {
      setIsResolveConfirmationOpen(true);
      return;
    }

    if (action === "Reopen ticket") {
      onReopen(ticket.ticketId);
      return;
    }

    onMockAction(`${action} is a preview action until the Support API is connected.`);
  };

  const getActionRoute = (action) => {
    if (action.includes("transaction") || action.includes("refund")) {
      return `${adminBasePath}/finance`;
    }
    if (action.includes("order")) return `${adminBasePath}/orders`;
    if (action.includes("restaurant")) return `${adminBasePath}/restaurants`;
    if (action.includes("customer") || action.includes("verification")) {
      return `${adminBasePath}/users`;
    }
    return "";
  };

  return (
    <div className="support-drawer" role="dialog" aria-modal="true" aria-labelledby="support-drawer-title">
      <button
        type="button"
        className="support-drawer__backdrop"
        aria-label="Close ticket details"
        onClick={onClose}
      />
      <aside className="support-drawer__panel">
        <header className="support-drawer__header">
          <div className="support-drawer__header-copy">
            <p className="support-drawer__eyebrow">Support ticket</p>
            <div className="support-drawer__title-row">
              <h2 id="support-drawer-title" className="support-drawer__title">
                {ticket.ticketId}
              </h2>
              <span className="support-drawer__issue">{ticket.issueType}</span>
            </div>
            <div className="support-drawer__context">
              <strong>{ticket.requester}</strong>
              {headerRecords.map(([label, value]) => (
                <SupportRecordLink
                  key={`${ticket.ticketId}-header-${label}`}
                  adminBasePath={adminBasePath}
                  label={label}
                  value={value}
                  compact
                />
              ))}
            </div>
            <div className="support-drawer__badges">
              <StatusBadge value={ticket.priority} />
              <StatusBadge value={ticket.status} />
              <StatusBadge value={ticket.sla} />
            </div>
          </div>
          <button
            type="button"
            className="support-drawer__close"
            aria-label="Close ticket details"
            onClick={onClose}
          >
            <X aria-hidden="true" size={18} strokeWidth={2} />
          </button>
        </header>

        <div className="support-drawer__scroll-region">
          <section className="support-drawer__recommendation" aria-labelledby="support-recommendation-title">
            <p className="support-drawer__section-label" id="support-recommendation-title">
              Recommended Resolution
            </p>
            <p>{ticket.recommendedNextStep}</p>
          </section>

          <DrawerSection title="Case Context" tone="light">
            <dl className="support-drawer__context-list">
              <DrawerContextRow label="Created" value={ticket.created} />
              <DrawerContextRow label="Last activity" value={ticket.lastActivity} />
              <DrawerContextRow label="Origin" value={ticket.channel || ticket.source} />
              {(ticket.linkedRecords || []).map(([label, value]) => (
                <DrawerContextRow
                  key={`${ticket.ticketId}-${label}-${value}`}
                  label={label}
                  value={
                    <SupportRecordLink
                      adminBasePath={adminBasePath}
                      label={label}
                      value={value}
                    />
                  }
                />
              ))}
            </dl>
          </DrawerSection>

          <DrawerSection title="Conversation / Timeline" tone="timeline">
            {ticket.conversation?.length ? (
              <ol className="support-drawer__timeline">
                {ticket.conversation.map((entry, index) => {
                  const eventType = getSupportEventType(entry.author);
                  return (
                    <li
                      key={`${ticket.ticketId}-${entry.timestamp || index}-${entry.text}`}
                      className={`support-drawer__timeline-entry ${
                        eventType === "Internal note"
                          ? "support-drawer__timeline-entry--internal"
                          : ""
                      }`}
                    >
                      <div className="support-drawer__timeline-meta">
                        <time>{getSupportTimelineTimestamp(entry, index, ticket)}</time>
                        <span aria-hidden="true">·</span>
                        <strong>{eventType}</strong>
                      </div>
                      <p>{entry.text}</p>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="support-drawer__muted">No conversation yet.</p>
            )}
          </DrawerSection>

          <DrawerSection title="Actions" tone="actions">
            <div className="support-drawer__actions">
              {workflowActions.map((action) => {
                const kind = getSupportActionKind(action);
                const route = getActionRoute(action.toLowerCase());
                const className = `support-drawer__action support-drawer__action--${kind}`;

                if (kind === "navigation" && route) {
                  return (
                    <Link key={action} to={route} className={className}>
                      {action}
                      <ExternalLink aria-hidden="true" size={14} />
                    </Link>
                  );
                }

                return (
                  <button
                    key={action}
                    type="button"
                    className={className}
                    onClick={() => handleWorkflowAction(action)}
                  >
                    {action}
                  </button>
                );
              })}
            </div>
          </DrawerSection>
        </div>

        <SupportTicketComposer
          ticket={ticket}
          onAddTimelineEntry={onAddTimelineEntry}
        />

        {isResolveConfirmationOpen && (
          <SupportResolveConfirmation
            ticket={ticket}
            onCancel={() => setIsResolveConfirmationOpen(false)}
            onResolve={() => {
              onResolve(ticket.ticketId);
              setIsResolveConfirmationOpen(false);
            }}
          />
        )}
      </aside>
    </div>
  );
}

function DrawerSection({ title, tone = "default", children }) {
  return (
    <section className={`support-drawer__section support-drawer__section--${tone}`}>
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function DrawerContextRow({ label, value }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
