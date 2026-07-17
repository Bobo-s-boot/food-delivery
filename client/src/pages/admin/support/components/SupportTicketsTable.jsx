import { AdminCard } from "../../components/AdminCard";
import { AdminTable } from "../../components/AdminTable";
import { SectionHeader } from "../../components/SectionHeader";
import { StatusBadge } from "../../components/StatusBadge";
import {
  getSupportEmptyMessage,
  getSupportFooterLabel,
  getSupportTicketActionLabel,
} from "../support.utils";
import { SupportSlaIndicator } from "./SupportSlaIndicator";

const supportColumns = [
  "Ticket",
  "Issue",
  "Priority",
  "Status",
  "Updated",
  "SLA",
  "Action",
];

export function SupportTicketsTable({
  tickets,
  filters,
  filteredTickets,
  visibleTickets,
  totalTicketCount,
  page,
  pageSize,
  totalPages,
  onOpenTicket,
  onPageChange,
}) {
  return (
    <AdminCard className="admin-support-table-card">
      <div className="admin-support-table-card__header">
        <SectionHeader title="Support Tickets" />
      </div>

      <div className="admin-support-table-card__table">
        <AdminTable
          columns={supportColumns}
          rows={visibleTickets}
          renderRow={(ticket) => (
            <tr key={ticket.ticketId} className="admin-support-row">
              <td className="admin-support-row__cell admin-support-row__cell--first">
                <strong>{ticket.ticketId}</strong>
                <span>{ticket.requester} · {ticket.channel}</span>
              </td>
              <td className="admin-support-row__cell admin-support-row__issue">
                <strong>{ticket.issueType}</strong>
                <span>{ticket.summary}</span>
              </td>
              <td className="admin-support-row__cell admin-support-row__priority">
                <StatusBadge value={ticket.priority} />
                <span className="admin-support-row__compact-state">
                  <StatusBadge value={ticket.status} />
                </span>
              </td>
              <td className="admin-support-row__cell admin-support-row__status">
                <StatusBadge value={ticket.status} />
              </td>
              <td className="admin-support-row__cell admin-support-row__updated">
                <strong>{ticket.lastActivity}</strong>
                <span className="admin-support-row__compact-sla">
                  <SupportSlaIndicator value={ticket.sla} compact />
                </span>
              </td>
              <td className="admin-support-row__cell admin-support-row__sla">
                <SupportSlaIndicator value={ticket.sla} />
              </td>
              <td className="admin-support-row__cell admin-support-row__cell--action admin-support-row__cell--last">
                <button
                  type="button"
                  className="live-orders-btn"
                  onClick={() => onOpenTicket(ticket.ticketId)}
                >
                  {getSupportTicketActionLabel(ticket.status)}
                </button>
              </td>
            </tr>
          )}
        />
      </div>

      {filteredTickets.length === 0 && (
        <div className="admin-support-empty">
          {getSupportEmptyMessage({ ticketCount: tickets.length, filters })}
        </div>
      )}

      <div className="admin-support-table-card__footer">
        <p>{getSupportFooterLabel({
          visibleCount: visibleTickets.length,
          totalCount: totalTicketCount,
          summaryFilter: filters.summaryFilter,
          page,
          pageSize,
        })}</p>
        <div className="admin-support-table-card__pagination">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => onPageChange((currentPage) => Math.max(1, currentPage - 1))}
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange((currentPage) => Math.min(totalPages, currentPage + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </AdminCard>
  );
}
