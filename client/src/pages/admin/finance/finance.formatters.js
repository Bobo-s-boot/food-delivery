export const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

export const formatWholeMoney = (value) =>
  `$${Number(value || 0).toLocaleString("en-US")}`;
