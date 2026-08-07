const normalize = (value) => String(value || "").trim().toLowerCase();

const ORDER_STATUS_LABELS = {
  pending: "New",
  preparing: "Preparing",
  delivering: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const formatOrderTimestamp = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unknown";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const getDeliveryLabel = (status, deliveryTime) => {
  if (status === "Delivered") return "Delivered";
  if (status === "Cancelled") return "Cancelled";
  if (Number(deliveryTime) > 0) return `${deliveryTime} min`;
  return status === "New" ? "Pending acceptance" : "Not available";
};

export const normalizeLiveOrders = (orders = []) =>
  orders.map((order) => {
    const status =
      ORDER_STATUS_LABELS[normalize(order?.status)] || order?.status || "New";
    const total = Number(order?.totalPrice || 0);
    const placed = formatOrderTimestamp(order?.createdAt);
    const deliveryLabel = getDeliveryLabel(status, order?.deliveryTime);
    const customerName =
      order?.userId?.fullName ||
      order?.customerName ||
      order?.userId?.username ||
      "Unknown customer";

    return {
      id: String(order?._id || order?.id || "Unknown order"),
      customer: {
        name: customerName,
        email: order?.customerEmail || order?.userId?.username || "Not provided",
        phone: order?.customerPhone || "Not provided",
      },
      restaurant: {
        name: order?.restaurantId?.name || "Unknown restaurant",
        prepTime: deliveryLabel,
      },
      status,
      issue: order?.issue || null,
      payment: {
        status: order?.paymentStatus || "Paid",
        subtotal: total,
        deliveryFee: 0,
        discount: 0,
        total,
        method: order?.paymentMethod || "Not provided",
      },
      courier: {
        name: order?.courier || "Not assigned",
        eta: deliveryLabel,
      },
      delivery: {
        address: order?.address || "Not provided",
        eta: deliveryLabel,
      },
      placed,
      createdAt: order?.createdAt || "",
      items: (order?.items || []).map((item) => ({
        name: item?.dishId?.name || item?.name || "Unknown item",
        quantity: Number(item?.quantity || 0),
        price: Number(item?.price ?? item?.dishId?.price ?? 0),
      })),
      timeline: [
        { time: placed, label: "Order placed" },
        ...(status === "New"
          ? []
          : [{ time: placed, label: `Current status: ${status}` }]),
      ],
    };
  });

export const buildOrderSummaryCards = (orders = [], cards = []) =>
  cards.map((card) => {
    const count =
      card.filter === "Issues"
        ? orders.filter((order) => Boolean(order.issue)).length
        : orders.filter((order) => order.status === card.filter).length;

    return {
      ...card,
      value: String(count),
    };
  });

export const matchesOrderStatusFilter = (order, statusFilter = "All") => {
  if (statusFilter === "All") {
    return true;
  }

  if (statusFilter === "Issues") {
    return Boolean(order?.issue);
  }

  return order?.status === statusFilter;
};

export const filterOrders = (
  orders = [],
  {
    searchValue = "",
    paymentFilter = "All payments",
    statusFilter = "All",
  } = {},
) => {
  const search = normalize(searchValue);

  return orders.filter((order) => {
    const matchesSearch =
      !search ||
      [order?.id, order?.customer?.name, order?.restaurant?.name].some((value) =>
        normalize(value).includes(search),
      );
    const matchesPayment =
      paymentFilter === "All payments" ||
      order?.payment?.status === paymentFilter;

    return (
      matchesSearch &&
      matchesPayment &&
      matchesOrderStatusFilter(order, statusFilter)
    );
  });
};

export const getOrderStatusToneClass = (value) =>
  `admin-orders-tone--${normalize(value || "all").replace(/\s+/g, "-")}`;
