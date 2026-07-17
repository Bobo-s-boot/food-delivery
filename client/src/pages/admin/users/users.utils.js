const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const ISSUE_PRIORITY = [
  "Payment issue",
  "Refund request",
  "Open support ticket",
  "Late delivery complaint",
  "Verification issue",
];

export const defaultUserFilters = {
  searchValue: "",
  statusFilter: "All",
  studentFilter: "All verification statuses",
  issueFilter: "All issue states",
  newOnly: false,
  summaryFilter: "",
};

export const hasPrimaryIssue = (user) => Boolean(getPrimaryIssue(user));

export const getPrimaryIssue = (user) => {
  if (user?.primaryIssue) {
    return user.primaryIssue;
  }

  const issueTypes = Array.isArray(user?.issues)
    ? user.issues.map((issue) => issue.type)
    : [];

  return ISSUE_PRIORITY.find((issueType) => issueTypes.includes(issueType)) || null;
};

export const filterUsers = (
  users,
  {
    searchValue = "",
    statusFilter = "All",
    studentFilter = "All verification statuses",
    issueFilter = "All issue states",
    newOnly = false,
  } = {},
) => {
  const normalizedSearch = normalize(searchValue);

  return users.filter((user) => {
    const primaryIssue = getPrimaryIssue(user);
    const matchesSearch =
      !normalizedSearch ||
      normalize(user.name).includes(normalizedSearch) ||
      normalize(user.email).includes(normalizedSearch);
    const matchesStatus =
      statusFilter === "All" || user.status === statusFilter;
    const matchesStudent =
      studentFilter === "All verification statuses" ||
      user.studentStatus === studentFilter;
    const matchesIssue =
      issueFilter === "All issue states" ||
      (issueFilter === "Has open issues" && Boolean(primaryIssue)) ||
      (issueFilter === "No open issues" && !primaryIssue) ||
      primaryIssue === issueFilter;
    const matchesNew = !newOnly || Boolean(user.isNew);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesStudent &&
      matchesIssue &&
      matchesNew
    );
  });
};

export const applyUserSummaryFilter = (summaryLabel) => {
  const nextFilters = {
    ...defaultUserFilters,
    summaryFilter: summaryLabel,
  };

  if (summaryLabel === "Active Accounts") {
    nextFilters.statusFilter = "Active";
  }

  if (summaryLabel === "New This Week") {
    nextFilters.newOnly = true;
  }

  if (summaryLabel === "Verified Students") {
    nextFilters.studentFilter = "Verified";
  }

  if (summaryLabel === "Open Issues") {
    nextFilters.issueFilter = "Has open issues";
  }

  return nextFilters;
};

export const getUserInitials = (name) =>
  String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

export const getAverageOrderValue = (user) => {
  const orders = Number(user?.orders || 0);

  if (!orders) {
    return "-";
  }

  return `$${(Number(user?.totalSpent || 0) / orders).toFixed(2)}`;
};

export const getUserTableActionLabel = (user) => {
  if (["Suspended", "Deactivated"].includes(user?.status)) {
    return "Details";
  }

  const primaryIssue = getPrimaryIssue(user);
  if (primaryIssue === "Verification issue") return "Resolve";
  if (primaryIssue) return "Review";

  return "View";
};

export const getPreviewActions = (user) => {
  const actionsByStatus = {
    Active: [
      "Suspend user",
      "Open support ticket",
      "View all orders",
      "Add internal note",
    ],
    Suspended: [
      "Reactivate user",
      "View suspension reason",
      "Open support ticket",
      "Add internal note",
    ],
    Deactivated: ["View account history", "Add internal note"],
  };

  const actions = [...(actionsByStatus[user?.status] || [])];

  if (user?.studentStatus === "Pending") {
    actions.push(
      "Approve verification",
      "Reject verification",
      "Request more info",
    );
  }

  return actions;
};
