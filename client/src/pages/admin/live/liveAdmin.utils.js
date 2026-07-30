export const initialDishFormData = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "",
  restaurantId: "",
};

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

export const formatOrderTime = (createdAt, now = Date.now()) => {
  const diffMinutes = Math.floor((now - new Date(createdAt).getTime()) / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  return `${Math.floor(diffMinutes / 60)}h ago`;
};

export const buildMenuAvailability = (dishesData) =>
  dishesData.map((dish) => ({
    id: dish._id,
    item: dish.name,
    restaurant: dish.restaurantId?.name || "Unknown restaurant",
    category: dish.category || "Unspecified",
    price: formatCurrency(dish.price),
    status: "Available",
    action: "Delete",
  }));

export const buildLiveOrderRows = (orders = []) =>
  orders.map((order) => ({
    id: order._id || order.id,
    customer:
      order.userId?.fullName ||
      order.userId?.username ||
      order.customerName ||
      "Unknown customer",
    restaurant: order.restaurantId?.name || "Unknown restaurant",
    status: order.status,
    payment: order.paymentMethod,
    courier: order.courier,
    total: `$${order.totalPrice?.toFixed(2) || "0.00"}`,
    time: formatOrderTime(order.createdAt),
    items: order.items || [],
    address: order.address || "",
  }));

export const formatDishPayload = (formData) => {
  // Достаем ID ресторана
  const restaurantId =
    typeof formData.restaurantId === "object"
      ? formData.restaurantId?._id || formData.restaurantId?.id
      : formData.restaurantId || formData.restaurant;

  return {
    name: formData.name?.trim() || "",
    description: formData.description?.trim() || "",
    price: Number(formData.price) || 0,
    image: formData.image?.trim() || "",
    // Выбираем правильную категорию
    category:
      formData.category ||
      formData.restaurantCategory ||
      formData.platformCategory ||
      "",
    // Передаем ID ресторана (и как restaurant, и как restaurantId на случай разных моделей на бэкенде)
    restaurant: restaurantId,
    restaurantId: restaurantId,
  };
};
