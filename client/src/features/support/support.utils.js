import {
  MAX_SUPPORT_FILE_SIZE,
  SUPPORT_CATEGORIES,
  SUPPORTED_SUPPORT_FILE_EXTENSIONS,
  SUPPORTED_SUPPORT_FILE_TYPES,
} from "./support.constants";

export const isUsableEmail = (value) => /^\S+@\S+\.\S+$/.test(value || "");

export const validateSupportFile = (file, t) => {
  const extension = file.name.split(".").pop()?.toLowerCase() || "";

  if (
    !SUPPORTED_SUPPORT_FILE_TYPES.has(file.type) ||
    !SUPPORTED_SUPPORT_FILE_EXTENSIONS.has(extension)
  ) {
    return t("support.validation.unsupportedFile");
  }

  if (file.size > MAX_SUPPORT_FILE_SIZE) {
    return t("support.validation.fileTooLarge");
  }

  return "";
};

export const getSupportFormErrors = (form, t) => {
  const errors = {};
  const subject = form.subject.trim();
  const description = form.description.trim();

  if (!form.category) errors.category = t("support.validation.categoryRequired");
  if (!subject) errors.subject = t("support.validation.subjectRequired");
  else if (subject.length < 5) errors.subject = t("support.validation.subjectMin");
  else if (subject.length > 120) errors.subject = t("support.validation.subjectMax");

  if (description.length < 20) {
    errors.description = t("support.validation.descriptionMin");
  } else if (description.length > 1500) {
    errors.description = t("support.validation.descriptionMax");
  }

  return errors;
};

export const normalizeSupportContext = (context) => {
  if (typeof context === "string") return { orderId: context };
  if (!context || typeof context !== "object") {
    return {};
  }

  const recentOrders = Array.isArray(context.recentOrders)
    ? context.recentOrders.slice(0, 10).map((order) => ({
        id: String(order.id || ""),
        restaurantName: String(order.restaurantName || ""),
      }))
    : [];
  const category = SUPPORT_CATEGORIES.some((item) => item.id === context.category)
    ? context.category
    : "";

  return {
    orderId: String(context.orderId || ""),
    recentOrders,
    category,
  };
};

export const normalizeAdminSupportTicket = (ticket) => {
  const restaurant = ticket.relatedRestaurantId?.name;
  const linkedRecords = [
    ticket.relatedOrderId ? ["Order", `#${ticket.relatedOrderId}`] : null,
    restaurant ? ["Restaurant", restaurant] : null,
    ["Customer", ticket.requesterName],
    ticket.category === "student_discount"
      ? ["Student status", ticket.studentStatus]
      : null,
  ].filter(Boolean);
  const updatedAt = new Date(ticket.updatedAt || ticket.createdAt);
  const createdAt = new Date(ticket.createdAt);

  return {
    ...ticket,
    requester: ticket.requesterName,
    source: ticket.source || "User website",
    channel: "Website form",
    issueType: ticket.categoryLabel || ticket.category,
    summary: ticket.subject,
    related: ticket.relatedOrderId
      ? `Order #${ticket.relatedOrderId}${restaurant ? ` · ${restaurant}` : ""}`
      : restaurant || "No linked record",
    priority: ticket.priority || "Medium",
    status: ticket.status || "Open",
    sla: "On track",
    lastActivity: Number.isNaN(updatedAt.getTime())
      ? "Recently"
      : updatedAt.toLocaleString(),
    lastActivityRank: updatedAt.getTime() || 0,
    created: Number.isNaN(createdAt.getTime())
      ? "Recently"
      : createdAt.toLocaleString(),
    resolvedToday: false,
    linkedRecords,
    conversation: ticket.conversation?.length
      ? ticket.conversation
      : [{ author: "Customer", text: ticket.description }],
    recommendedNextStep: "Review the request context and reply to the customer.",
  };
};
