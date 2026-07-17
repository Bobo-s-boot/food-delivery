export const formatRestaurantMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

export const formatRestaurantKpiMoney = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
