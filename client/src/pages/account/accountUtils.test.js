import test from "node:test";
import assert from "node:assert/strict";
import {
  filterOrders,
  getOrderItemsSummary,
  getOrderMeta,
  getRepeatOrderLabel,
  removeAddressById,
  setDefaultAddress,
} from "./accountUtils.js";

const orders = [
  {
    id: "DF-2048",
    restaurantName: "Kyoto Sushi & Wok",
    status: "active",
    items: [{ name: "Sushi Set" }],
  },
  {
    id: "DF-2035",
    restaurantName: "The Burger Joint",
    status: "delivered",
    items: [{ name: "Signature Truffle Burger" }],
  },
  {
    id: "DF-2029",
    restaurantName: "Fresh Poke Bowls",
    status: "cancelled",
    items: [{ name: "Salmon Poke" }],
  },
];

const addresses = [
  { id: "home", title: "Home", isDefault: true },
  { id: "university", title: "University", isDefault: false },
];

test("filterOrders combines status filters with restaurant, item, and order search", () => {
  assert.deepEqual(
    filterOrders(orders, "Delivered", "burger").map((order) => order.id),
    ["DF-2035"],
  );

  assert.deepEqual(
    filterOrders(orders, "All", "df-2048").map((order) => order.id),
    ["DF-2048"],
  );
});

test("order helpers format repeat labels and compact summaries", () => {
  const deliveredOrder = {
    date: "May 24",
    time: "18:42",
    total: 24.99,
    items: [{ name: "Burger" }, { name: "Fries" }],
  };

  assert.equal(getRepeatOrderLabel("cancelled"), "Try again");
  assert.equal(getRepeatOrderLabel("delivered"), "Order again");
  assert.equal(getOrderItemsSummary(deliveredOrder), "Burger - Fries");
  assert.equal(getOrderMeta(deliveredOrder), "May 24, 18:42 - 2 items - $24.99");
});

test("setDefaultAddress makes exactly one address the default", () => {
  const nextAddresses = setDefaultAddress(addresses, "university");

  assert.equal(nextAddresses.find((address) => address.id === "home").isDefault, false);
  assert.equal(
    nextAddresses.find((address) => address.id === "university").isDefault,
    true,
  );
});

test("removeAddressById reports when a default address needs replacement", () => {
  const result = removeAddressById(addresses, "home");

  assert.equal(result.needsDefaultReplacement, true);
  assert.deepEqual(
    result.addresses.map((address) => address.id),
    ["university"],
  );
});
