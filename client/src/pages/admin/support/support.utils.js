const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const includesSearch = (values, searchValue) => {
  const normalizedSearch = normalize(searchValue);

  if (!normalizedSearch) {
    return true;
  }

  return values.some((value) => normalize(value).includes(normalizedSearch));
};

export const defaultSupportFilters = {
  searchValue: "",
  issueTypeFilter: "All issue types",
  priorityFilter: "All priorities",
  slaFilter: "All SLA",
  statusFilter: "Open",
  summaryFilter: "Open Tickets",
};

const isWaitingStatus = (status) =>
  [
    "Waiting for customer",
    "Waiting for restaurant",
    "Waiting for internal action",
  ].includes(status);

const matchesStatusFilter = (ticket, statusFilter) => {
  if (statusFilter === "All") {
    return true;
  }

  if (statusFilter === "Active") {
    return ticket.status !== "Resolved";
  }

  if (statusFilter === "Waiting") {
    return isWaitingStatus(ticket.status);
  }

  return ticket.status === statusFilter;
};

export const filterSupportTickets = (
  tickets,
  {
    searchValue = "",
    issueTypeFilter = "All issue types",
    priorityFilter = "All priorities",
    slaFilter = "All SLA",
    statusFilter = "All",
    resolvedTodayOnly = false,
  } = {},
) =>
  tickets.filter((ticket) => {
    const matchesSearch = includesSearch(
      [
        ticket.ticketId,
        ticket.requester,
        ticket.related,
        ticket.issueType,
        ticket.summary,
        ticket.channel,
      ],
      searchValue,
    );
    const matchesIssueType =
      issueTypeFilter === "All issue types" || ticket.issueType === issueTypeFilter;
    const matchesPriority =
      priorityFilter === "All priorities" || ticket.priority === priorityFilter;
    const matchesSla = slaFilter === "All SLA" || ticket.sla === slaFilter;
    const matchesStatus = matchesStatusFilter(ticket, statusFilter);
    const matchesResolvedToday =
      !resolvedTodayOnly ||
      (ticket.status === "Resolved" && Boolean(ticket.resolvedToday));

    return (
      matchesSearch &&
      matchesIssueType &&
      matchesPriority &&
      matchesSla &&
      matchesStatus &&
      matchesResolvedToday
    );
  });

export const applySupportSummaryFilter = (summaryLabel) => {
  const filters = {
    ...defaultSupportFilters,
    summaryFilter: summaryLabel,
    statusFilter: "All",
  };

  if (summaryLabel === "Open Tickets") {
    filters.statusFilter = "Open";
  }

  if (summaryLabel === "New Tickets") {
    filters.statusFilter = "New";
  }

  if (summaryLabel === "High Priority") {
    filters.priorityFilter = "High";
  }

  if (summaryLabel === "Overdue") {
    filters.slaFilter = "Overdue";
  }

  if (summaryLabel === "Resolved Today") {
    filters.statusFilter = "Resolved";
    filters.resolvedTodayOnly = true;
  }

  return filters;
};

const priorityWeight = {
  High: 0,
  Medium: 1,
  Low: 2,
};

const statusWeight = {
  New: 0,
  Open: 1,
  "Waiting for customer": 2,
  "Waiting for restaurant": 2,
  Resolved: 9,
};

export const sortSupportTickets = (tickets = []) =>
  [...tickets].sort((a, b) => {
    if (a.status === "Resolved" && b.status !== "Resolved") return 1;
    if (b.status === "Resolved" && a.status !== "Resolved") return -1;
    if (a.sla === "Overdue" && b.sla !== "Overdue") return -1;
    if (b.sla === "Overdue" && a.sla !== "Overdue") return 1;

    const priorityDelta =
      (priorityWeight[a.priority] ?? 5) - (priorityWeight[b.priority] ?? 5);
    if (priorityDelta) return priorityDelta;

    const statusDelta =
      (statusWeight[a.status] ?? 5) - (statusWeight[b.status] ?? 5);
    if (statusDelta) return statusDelta;

    return Number(b.lastActivityRank || 0) - Number(a.lastActivityRank || 0);
  });

export const getSupportTicketActionLabel = (status) =>
  ({
    New: "Review",
    Open: "Continue",
    "Waiting for customer": "View",
    "Waiting for restaurant": "View",
    "Waiting for internal action": "Continue",
    Resolved: "Details",
  })[status] || "Review";

export const getSupportFooterLabel = ({
  visibleCount = 0,
  totalCount = visibleCount,
  summaryFilter = "",
  page = 1,
  pageSize = 10,
} = {}) => {
  const start = visibleCount > 0 ? (page - 1) * pageSize + 1 : 0;
  const end = visibleCount > 0 ? start + visibleCount - 1 : 0;
  const labelPrefix =
    summaryFilter && summaryFilter !== "Open Tickets"
      ? `${normalize(summaryFilter)} `
      : "";

  return `Showing ${start}-${end} of ${totalCount} ${labelPrefix}tickets`;
};

export const getWorkflowActionsForTicket = (ticket) => {
  if (ticket?.status === "Resolved") {
    return ["View resolution", "Reopen ticket"];
  }

  const actionsByIssueType = {
    "Payment issue": [
      "Open transaction",
      "Open refund",
      "Escalate",
      "Mark resolved",
    ],
    "Late delivery": [
      "Open order",
      "Contact restaurant",
      "Contact courier",
      "Escalate",
    ],
    "Missing item": [
      "Open order",
      "Request restaurant response",
      "Start refund review",
      "Mark resolved",
    ],
    "Wrong item": [
      "Open order",
      "Request restaurant response",
      "Start refund review",
      "Mark resolved",
    ],
    "Refund request": [
      "Open order",
      "Open refund",
      "Start refund review",
      "Mark resolved",
    ],
    "Restaurant issue": [
      "Open restaurant",
      "Open related order",
      "Request restaurant update",
      "Escalate",
    ],
    "Verification issue": [
      "Open customer profile",
      "Review verification",
      "Request information",
      "Mark resolved",
    ],
  };

  return actionsByIssueType[ticket?.issueType] || [
    "Continue review",
    "Escalate",
    "Mark resolved",
  ];
};

export const getSupportActionKind = (action) => {
  if (action === "Mark resolved") return "resolve";
  if (action.startsWith("Open") || action === "View resolution") {
    return "navigation";
  }

  return "secondary";
};

export const getSupportEventType = (author) =>
  ({
    System: "System event",
    Customer: "Customer message",
    Support: "Admin reply",
    "Support note": "Internal note",
    Restaurant: "Restaurant message",
  })[author] || author || "Update";

export const getSupportTimelineTimestamp = (entry, index, ticket) => {
  if (entry?.timestamp) return entry.timestamp;
  if (index === 0) return ticket?.created || "Earlier";
  if (index === (ticket?.conversation?.length || 0) - 1) {
    return ticket?.lastActivity || "Recently";
  }

  return "Earlier today";
};

export const getSupportRecordRoute = (label, adminBasePath = "/admin") => {
  if (label === "Order") return `${adminBasePath}/orders`;
  if (label === "Restaurant") return `${adminBasePath}/restaurants`;
  if (label === "Customer" || label === "Student status") {
    return `${adminBasePath}/users`;
  }
  if (label === "Transaction" || label === "Refund") {
    return `${adminBasePath}/finance`;
  }

  return "";
};

export const getSupportEmptyMessage = ({
  ticketCount = 0,
  filters = defaultSupportFilters,
} = {}) => {
  if (filters.resolvedTodayOnly) {
    return "No tickets were resolved during the selected period.";
  }

  if (ticketCount === 0) {
    return "No support tickets found.";
  }

  const hasFilters =
    Boolean(filters.searchValue) ||
    filters.issueTypeFilter !== "All issue types" ||
    filters.priorityFilter !== "All priorities" ||
    filters.slaFilter !== "All SLA" ||
    !["All", "Active"].includes(filters.statusFilter);

  return hasFilters
    ? "No tickets match the current filters."
    : "No support tickets found.";
};
