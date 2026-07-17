import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  AdminKpiCard,
  AdminKpiGrid,
} from "../components/ui/AdminKpiCard/AdminKpiCard";
import {
  supportSummaryCards,
  supportTicketsMockData,
} from "./support.data";
import {
  applySupportSummaryFilter,
  defaultSupportFilters,
  filterSupportTickets,
  sortSupportTickets,
} from "./support.utils";
import { SupportFilters } from "./components/SupportFilters";
import { SupportTicketDrawer } from "./components/SupportTicketDrawer";
import { SupportTicketsTable } from "./components/SupportTicketsTable";
import { getAdminBasePath } from "../admin.routes";
import "./SupportPage.scss";

export function AdminSupportPage() {
  const location = useLocation();
  const adminBasePath = getAdminBasePath(location.pathname);
  const [tickets, setTickets] = useState(() => supportTicketsMockData);
  const [filters, setFilters] = useState(defaultSupportFilters);
  const [page, setPage] = useState(1);
  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [mockActionMessage, setMockActionMessage] = useState("");

  const filteredTickets = useMemo(
    () => sortSupportTickets(filterSupportTickets(tickets, filters)),
    [filters, tickets],
  );
  const selectedTicket = tickets.find((ticket) => ticket.ticketId === selectedTicketId);
  const totalTicketCount =
    filters.summaryFilter === "Open Tickets" ? 24 : filteredTickets.length;
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / pageSize));
  const visibleTickets = filteredTickets.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const setManualFilter = (partialFilters) => {
    setPage(1);
    setFilters((currentFilters) => ({
      ...currentFilters,
      ...partialFilters,
      summaryFilter: "",
    }));
  };

  const handleSummaryFilter = (cardLabel) => {
    setPage(1);
    setFilters((currentFilters) =>
      currentFilters.summaryFilter === cardLabel
        ? { ...defaultSupportFilters, statusFilter: "All", summaryFilter: "" }
        : applySupportSummaryFilter(cardLabel),
    );
  };

  const updateTicket = (ticketId, updater) => {
    setTickets((currentTickets) =>
      currentTickets.map((ticket) =>
        ticket.ticketId === ticketId ? updater(ticket) : ticket,
      ),
    );
  };

  const handleResolve = (ticketId) => {
    // TODO(support-api): persist the resolved status and resolution event.
    updateTicket(ticketId, (ticket) => ({
      ...ticket,
      status: "Resolved",
      sla: "On track",
      resolvedToday: true,
      lastActivity: "Just now",
      conversation: [
        ...(ticket.conversation || []),
        {
          author: "Support note",
          timestamp: "Just now",
          text: "Ticket marked as resolved by the administrator.",
        },
      ],
    }));
    setMockActionMessage(`${ticketId} is resolved in this preview. Backend integration is still required.`);
  };

  const handleReopen = (ticketId) => {
    // TODO(support-api): persist the reopened ticket status.
    updateTicket(ticketId, (ticket) => ({
      ...ticket,
      status: "Open",
      resolvedToday: false,
      lastActivity: "Just now",
    }));
    setMockActionMessage(`${ticketId} is reopened in this preview. Backend integration is still required.`);
  };

  const handleAddTimelineEntry = (ticketId, entry) => {
    // TODO(support-api): send the reply or store the private internal note.
    updateTicket(ticketId, (ticket) => ({
      ...ticket,
      lastActivity: "Just now",
      conversation: [...(ticket.conversation || []), entry],
    }));
    setMockActionMessage(
      entry.author === "Support note"
        ? "Internal note added to this preview."
        : "Reply added to this preview; it was not sent to the customer.",
    );
  };

  return (
    <div className="admin-support">
      <div className="admin-support__intro admin-page-intro">
        <h1>Support</h1>
        <p>Resolve customer complaints, order issues and partner requests.</p>
      </div>

      <AdminKpiGrid>
        {supportSummaryCards.map((card) => (
          <AdminKpiCard
            key={card.label}
            label={card.label}
            value={card.value}
            helper={card.helper}
            tone={card.tone}
            interactive
            active={filters.summaryFilter === card.label}
            onClick={() => handleSummaryFilter(card.label)}
          />
        ))}
      </AdminKpiGrid>

      <SupportFilters filters={filters} onChange={setManualFilter} />

      <SupportTicketsTable
        tickets={tickets}
        filters={filters}
        filteredTickets={filteredTickets}
        visibleTickets={visibleTickets}
        totalTicketCount={totalTicketCount}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        onOpenTicket={setSelectedTicketId}
        onPageChange={setPage}
      />

      {mockActionMessage && (
        <div className="admin-support__mock-notice" role="status">
          <span>{mockActionMessage}</span>
          <button type="button" onClick={() => setMockActionMessage("")}>Dismiss</button>
        </div>
      )}

      <SupportTicketDrawer
        key={selectedTicket?.ticketId || "closed"}
        ticket={selectedTicket}
        adminBasePath={adminBasePath}
        onAddTimelineEntry={handleAddTimelineEntry}
        onClose={() => setSelectedTicketId("")}
        onMockAction={setMockActionMessage}
        onResolve={handleResolve}
        onReopen={handleReopen}
      />
    </div>
  );
}
