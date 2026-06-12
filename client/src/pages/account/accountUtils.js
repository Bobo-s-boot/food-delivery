const normalizeText = (value) => String(value || "").trim().toLowerCase();

export const filterOrders = (orders, activeFilter = "All", searchQuery = "") => {
  const normalizedFilter = normalizeText(activeFilter);
  const normalizedSearch = normalizeText(searchQuery);

  return orders.filter((order) => {
    const matchesFilter =
      normalizedFilter === "all" ||
      normalizeText(order.status) === normalizedFilter;

    const searchable = [
      order.id,
      order.restaurantName,
      order.status,
      ...(order.items || []).map((item) => item.name),
    ]
      .map(normalizeText)
      .join(" ");

    return matchesFilter && searchable.includes(normalizedSearch);
  });
};

export const getRepeatOrderLabel = (status) =>
  status === "cancelled" ? "Try again" : "Order again";

export const getOrderItemsSummary = (order) =>
  order.items.map((item) => item.name).join(" - ");

export const getOrderMeta = (order) =>
  `${order.date}, ${order.time} - ${order.items.length} ${
    order.items.length === 1 ? "item" : "items"
  } - $${order.total.toFixed(2)}`;

export const setDefaultAddress = (addresses, addressId) =>
  addresses.map((address) => ({
    ...address,
    isDefault: address.id === addressId,
  }));

export const removeAddressById = (addresses, addressId) => {
  const addressToRemove = addresses.find((address) => address.id === addressId);
  const nextAddresses = addresses.filter((address) => address.id !== addressId);

  return {
    addresses: nextAddresses,
    needsDefaultReplacement:
      Boolean(addressToRemove?.isDefault) && nextAddresses.length > 0,
  };
};

export const createAddressId = (title) =>
  `${normalizeText(title).replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
