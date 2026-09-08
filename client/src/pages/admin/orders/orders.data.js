export const orderStatusFilters = [
  "All",
  "New",
  "Preparing",
  "On the way",
  "Delivered",
  "Cancelled",
  "Issues",
];

export const paymentFilters = [
  "All payments",
  "Paid",
  "Pending",
  "Failed",
  "Refunded",
];

export const dateFilters = ["Today", "Last 7 days", "Last 30 days", "Custom"];

export const orderSummaryCards = [
  {
    label: "New Orders",
    value: "12",
    helper: "waiting review",
    filter: "New",
    tone: "new",
  },
  {
    label: "Preparing",
    value: "18",
    helper: "in kitchens",
    filter: "Preparing",
    tone: "preparing",
  },
  {
    label: "On the Way",
    value: "9",
    helper: "active delivery",
    filter: "On the way",
    tone: "on-way",
  },
  {
    label: "Delivered Today",
    value: "86",
    helper: "completed",
    filter: "Delivered",
    tone: "delivered",
  },
  {
    label: "Orders with Issues",
    value: "7",
    helper: "needs attention",
    filter: "Issues",
    tone: "warning",
  },
];

export { ordersMockData } from "../shared/orders.data";
