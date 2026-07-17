const normalize = (value) => String(value || "").trim().toLowerCase();

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
