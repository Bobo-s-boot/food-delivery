const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const USER_ORDER_STATUS_LABELS = {
  pending: "New",
  preparing: "Preparing",
  delivering: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const formatDate = (value, fallback = "Not available") => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return fallback;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const formatOrderDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "No orders yet";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const getEntityId = (entity) =>
  String(entity?._id || entity?.id || entity?.username || "");

const getOrderUserId = (order) =>
  String(order?.userId?._id || order?.userId || "");

export const normalizeLiveUsers = (users = [], orders = [], now = Date.now()) =>
  users.map((user) => {
    const id = getEntityId(user);
    const email = user?.email || user?.username || "Not provided";
    const userOrders = orders.filter((order) => {
      const matchesUserId = id && getOrderUserId(order) === id;
      const matchesEmail =
        email !== "Not provided" &&
        normalize(order?.customerEmail) === normalize(email);

      return matchesUserId || matchesEmail;
    });
    const totalSpent = userOrders.reduce(
      (total, order) => total + Number(order?.totalPrice || 0),
      0,
    );
    const recentOrders = userOrders.slice(0, 3).map((order) => ({
      id: String(order?._id || order?.id || "Unknown order"),
      restaurant: order?.restaurantId?.name || "Unknown restaurant",
      total: Number(order?.totalPrice || 0),
      status:
        USER_ORDER_STATUS_LABELS[normalize(order?.status)] ||
        order?.status ||
        "New",
    }));
    const createdAt = new Date(user?.createdAt);
    const isNew =
      !Number.isNaN(createdAt.getTime()) &&
      now - createdAt.getTime() <= 7 * 24 * 60 * 60 * 1000;
    const lastOrder = userOrders[0];

    return {
      id,
      name: user?.fullName || user?.name || user?.username || "Unknown user",
      email,
      phone: user?.phone || lastOrder?.customerPhone || "Not provided",
      joined: formatDate(user?.createdAt),
      isNew,
      status: user?.status || "Active",
      studentStatus: user?.studentStatus || "Not verified",
      orders: userOrders.length,
      totalSpent,
      lastOrder: lastOrder
        ? formatOrderDate(lastOrder.createdAt)
        : "No orders yet",
      primaryIssue: null,
      issues: [],
      recentOrders,
      discounts:
        user?.studentStatus === "Verified"
          ? [{ name: "Student Deal", status: "Eligible" }]
          : [],
      notes: [],
      role: user?.role || "user",
    };
  });

export const buildUserSummaryCards = (users = [], cards = []) =>
  cards.map((card) => {
    const valuesByLabel = {
      "Total Users": users.length,
      "Active Accounts": users.filter((user) => user.status === "Active").length,
      "New This Week": users.filter((user) => user.isNew).length,
      "Verified Students": users.filter(
        (user) => user.studentStatus === "Verified",
      ).length,
      "Open Issues": users.filter((user) => hasPrimaryIssue(user)).length,
    };

    return {
      ...card,
      value: String(valuesByLabel[card.label] ?? 0),
    };
  });

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
