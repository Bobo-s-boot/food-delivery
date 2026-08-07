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

export const getPreviewOnlyMessage = () => "Preview only — no changes saved.";

export const calculateEstimatedPlatformRevenue = ({
  estimatedPlatformFees = 0,
  platformPromoCost = 0,
} = {}) => Number(estimatedPlatformFees || 0) - Number(platformPromoCost || 0);

const formatWholeMoney = (value) => `$${Number(value || 0).toLocaleString("en-US")}`;

const periodMultipliers = {
  Today: 1,
  Yesterday: 0.92,
  "Last 7 days": 6.84,
  "Last 30 days": 28.6,
  "This month": 12.4,
  "Custom range": 1,
};

export const getFinancePeriodMultiplier = (period = "Today") =>
  periodMultipliers[period] ?? 1;

export const scaleFinanceValue = (value, period = "Today") =>
  Math.round(Number(value || 0) * getFinancePeriodMultiplier(period));

export const getFinanceKpisForPeriod = (cards = [], period = "Today") => {
  const baseValues = [2430, 268, 1820, 120, 96];

  return cards.map((card, index) => ({
    ...card,
    value: formatWholeMoney(scaleFinanceValue(baseValues[index], period)),
  }));
};

export const getFinanceRecordsForPeriod = (records = [], period = "Today") => {
  if (period === "Yesterday") {
    return records.slice(Math.max(0, records.length - Math.ceil(records.length / 2)));
  }

  return records;
};

export const getFinanceTrendStats = (points = []) => {
  if (!points.length) {
    return [];
  }

  const peakPoint = points.reduce((peak, point) =>
    Number(point.grossRevenue || 0) > Number(peak.grossRevenue || 0) ? point : peak,
  );
  const todayPoint = points[points.length - 1];
  const getNetRevenue = (point) =>
    point.netPlatformRevenue ??
    calculateEstimatedPlatformRevenue({
      estimatedPlatformFees: point.estimatedPlatformFees,
      platformPromoCost: point.platformPromoCost,
    });
  const averageNetRevenue = Math.round(
    points.reduce(
      (total, point) => total + Number(getNetRevenue(point) || 0),
      0,
    ) / points.length,
  );

  return [
    {
      label: "12-week high",
      value: formatWholeMoney(peakPoint.grossRevenue),
      helper: peakPoint.label === "Current" ? "Current week" : peakPoint.label,
    },
    {
      label: "Current week",
      value: formatWholeMoney(todayPoint.grossRevenue),
      helper: `${formatWholeMoney(getNetRevenue(todayPoint))} net revenue`,
    },
    {
      label: "Avg weekly net",
      value: formatWholeMoney(averageNetRevenue),
      helper: "last 12 weeks",
    },
  ];
};

export const getFinanceTrendTooltipStyle = ({
  pointX = 0,
  pointY = 0,
  chartWidth = 0,
  chartHeight = 0,
  tooltipWidth = 228,
  tooltipHeight = 126,
  gap = 16,
} = {}) => {
  const hasRoomRight = pointX + gap + tooltipWidth <= chartWidth;
  const hasRoomLeft = pointX - gap - tooltipWidth >= gap;
  const preferredLeft =
    hasRoomRight || !hasRoomLeft ? pointX + gap : pointX - tooltipWidth - gap;
  const preferredTop = pointY - tooltipHeight / 2;
  const maxLeft = Math.max(gap, chartWidth - tooltipWidth);
  const maxTop = Math.max(gap, chartHeight - tooltipHeight);
  const left = Math.min(Math.max(gap, preferredLeft), maxLeft);
  const top = Math.min(Math.max(gap, preferredTop), maxTop);

  return {
    left: `${Math.round(left)}px`,
    top: `${Math.round(top)}px`,
  };
};

export const getFinanceTrendChartWidth = (
  containerWidth = 0,
  chartHeight = 180,
) => {
  const width = Math.max(0, Number(containerWidth) || 0);
  const height = Math.max(1, Number(chartHeight) || 180);

  if (!width) return 1320;

  const desiredHeight =
    width >= 1200
      ? Math.min(200, Math.max(182, width * 0.12))
      : Math.min(182, Math.max(108, width * 0.15));

  return Math.round((height * width) / desiredHeight);
};

const attentionShortcuts = {
  failedPayments: { tab: "Transactions", statusFilter: "Failed" },
  pendingRefunds: { tab: "Refunds", statusFilter: "Requested" },
  payoutsOnHold: { tab: "Payouts", statusFilter: "On hold" },
  expiredPromotions: { tab: "Promotions", statusFilter: "Expired" },
};

export const getFinanceAttentionShortcut = (shortcutKey) =>
  attentionShortcuts[shortcutKey] ?? { tab: "Overview", statusFilter: "All" };

export const filterFinanceTransactions = (
  transactions,
  {
    searchValue = "",
    statusFilter = "All",
    paymentMethodFilter = "All payment methods",
  } = {},
) =>
  transactions.filter((transaction) => {
    const matchesSearch = includesSearch(
      [
        transaction.transactionId,
        transaction.orderId,
        transaction.customer,
        transaction.restaurant,
      ],
      searchValue,
    );
    const matchesStatus =
      statusFilter === "All" || transaction.status === statusFilter;
    const matchesPaymentMethod =
      paymentMethodFilter === "All payment methods" ||
      transaction.paymentMethod === paymentMethodFilter;

    return matchesSearch && matchesStatus && matchesPaymentMethod;
  });

export const filterFinancePayouts = (
  payouts,
  { searchValue = "", statusFilter = "All" } = {},
) =>
  payouts.filter((payout) => {
    const matchesSearch = includesSearch([payout.restaurant], searchValue);
    const matchesStatus =
      statusFilter === "All" || payout.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

export const filterFinanceRefunds = (
  refunds,
  {
    searchValue = "",
    reasonFilter = "All reasons",
    typeFilter = "All refund types",
    statusFilter = "All",
  } = {},
) =>
  refunds.filter((refund) => {
    const matchesSearch = includesSearch(
      [refund.refundId, refund.orderId, refund.customer],
      searchValue,
    );
    const matchesReason =
      reasonFilter === "All reasons" || refund.reason === reasonFilter;
    const matchesStatus =
      statusFilter === "All" || refund.status === statusFilter;
    const matchesType =
      typeFilter === "All refund types" || refund.refundType === typeFilter;

    return matchesSearch && matchesReason && matchesStatus && matchesType;
  });

export const filterFinancePromotions = (
  promotions,
  {
    searchValue = "",
    typeFilter = "All types",
    audienceFilter = "All audiences",
    statusFilter = "All",
  } = {},
) =>
  promotions.filter((promotion) => {
    const matchesSearch = includesSearch(
      [promotion.name, promotion.code, promotion.restaurant],
      searchValue,
    );
    const matchesType = typeFilter === "All types" || promotion.type === typeFilter;
    const matchesAudience =
      audienceFilter === "All audiences" ||
      promotion.audience === audienceFilter ||
      (audienceFilter === "Restaurant customers" &&
        normalize(promotion.audience).includes("customers"));
    const matchesStatus =
      statusFilter === "All" || promotion.status === statusFilter;

    return matchesSearch && matchesType && matchesAudience && matchesStatus;
  });

export const getRefundActionLabel = (status) =>
  status === "Requested"
    ? "Review"
    : status === "Processing"
      ? "Continue review"
      : "Details";

export const getPayoutActionLabel = (status) =>
  ({
    Pending: "Review",
    Scheduled: "View",
    Paid: "Details",
    "On hold": "Resolve",
    Failed: "Retry",
  })[status] || "Details";

export const getPromotionActionLabel = (status) =>
  ({ Active: "Manage", Scheduled: "Edit", Paused: "Resume", Expired: "Details" })[
    status
  ] || "Details";

export const getFinanceConfirmationConfig = (action, item = {}) => {
  const amount = item.amount ?? item.netPayout;
  const entity = item.refundId || item.restaurant || item.name || "this record";
  const requiresReason = [
    "Reject refund",
    "Place on hold",
    "Retry payout",
    "Retry payment",
    "Cancel promotion",
    "End promotion",
  ].includes(action);

  return {
    action,
    entity,
    amount: amount == null ? null : `$${Number(amount).toFixed(2)}`,
    requiresReason,
    consequence: `${action} will update the operational finance workflow for ${entity}.`,
    reversible: ["Place on hold", "Pause promotion"].includes(action),
  };
};
