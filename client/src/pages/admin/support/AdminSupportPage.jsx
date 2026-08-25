import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  adminAddSupportTimelineEntry,
  adminGetSupportTickets,
  adminUpdateSupportTicketStatus,
} from "../../../api/supportService";
import { normalizeAdminSupportTicket } from "../../../features/support/support.utils";
import {
  AdminKpiCard,
  AdminKpiGrid,
} from "../components/ui/AdminKpiCard/AdminKpiCard";
import {
  supportSummaryCards,
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
  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState(defaultSupportFilters);
  const [page, setPage] = useState(1);
  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [mockActionMessage, setMockActionMessage] = useState("");
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    adminGetSupportTickets()
      .then((data) => {
        if (!isActive) return;
        setTickets((Array.isArray(data) ? data : []).map(normalizeAdminSupportTicket));
        setLoadError("");
      })
      .catch(() => {
        if (isActive) setLoadError("Unable to load live support tickets.");
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const filteredTickets = useMemo(
    () => sortSupportTickets(filterSupportTickets(tickets, filters)),
    [filters, tickets],
  );
  const selectedTicket = tickets.find((ticket) => ticket.ticketId === selectedTicketId);
  const totalTicketCount = filteredTickets.length;
  const summaryCards = useMemo(() => {
    const today = new Date().toDateString();
    return supportSummaryCards.map((card) => {
      const value = {
        "Open Tickets": tickets.filter((ticket) => ticket.status !== "Resolved").length,
        "New Tickets": tickets.filter((ticket) => ticket.status === "New").length,
        "High Priority": tickets.filter((ticket) => ticket.priority === "High").length,
        Overdue: tickets.filter((ticket) => ticket.sla === "Overdue").length,
        "Resolved Today": tickets.filter(
          (ticket) =>
            ticket.status === "Resolved" &&
            new Date(ticket.updatedAt).toDateString() === today,
        ).length,
      }[card.label];
      return { ...card, value: String(value ?? 0) };
    });
  }, [tickets]);
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

  const handleResolve = async (ticketId) => {
    try {
      await adminUpdateSupportTicketStatus(ticketId, "Resolved");
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
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            text: "Ticket marked as resolved by the administrator.",
          },
        ],
      }));
      setMockActionMessage(`Ticket ${ticketId} has been marked as resolved in the database.`);
    } catch (error) {
      console.error("Error resolving ticket:", error);
      setMockActionMessage(`Failed to update ${ticketId} in database.`);
    }
  };

  const handleReopen = async (ticketId) => {
    try {
      await adminUpdateSupportTicketStatus(ticketId, "Open");
      updateTicket(ticketId, (ticket) => ({
        ...ticket,
        status: "Open",
        resolvedToday: false,
        lastActivity: "Just now",
      }));
      setMockActionMessage(`Ticket ${ticketId} has been reopened in the database.`);
    } catch (error) {
      console.error("Error reopening ticket:", error);
      setMockActionMessage(`Failed to reopen ${ticketId} in database.`);
    }
  };

  const handleAddTimelineEntry = async (ticketId, entry) => {
    try {
      await adminAddSupportTimelineEntry(ticketId, entry);
      updateTicket(ticketId, (ticket) => ({
        ...ticket,
        lastActivity: "Just now",
        conversation: [...(ticket.conversation || []), entry],
      }));
      setMockActionMessage(
        entry.author === "Support note"
          ? "Internal note saved to database."
          : "Reply saved to database.",
      );
    } catch (error) {
      console.error("Error adding timeline entry:", error);
      setMockActionMessage(`Failed to save timeline entry to database.`);
    }
  };

  return (
    <div className="admin-support">
      <div className="admin-support__intro admin-page-intro">
        <h1>Support</h1>
        <p>Resolve customer complaints, order issues and partner requests.</p>
      </div>

      <AdminKpiGrid>
        {summaryCards.map((card) => (
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

      {isLoading && <div className="admin-support__mock-notice" role="status">Loading live support tickets...</div>}
      {loadError && <div className="admin-support__mock-notice" role="alert">{loadError}</div>}

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
