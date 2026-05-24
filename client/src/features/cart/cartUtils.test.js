import test from "node:test";
import assert from "node:assert/strict";
import {
  addCartItem,
  calculateCartTotals,
  decreaseCartItem,
  getPreviewCartItems,
  removeCartItem,
} from "./cartUtils.js";

const burger = {
  id: 1,
  title: "Signature Truffle Burger",
  price: "14.99",
  imageUrl: "/img/burger.jpg",
  restaurant: "Kyo's Grill",
  category: "fastFood",
};

test("addCartItem increases quantity when the same dish is added twice", () => {
  const cart = addCartItem(addCartItem([], burger), burger);

  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 2);
  assert.equal(cart[0].name, "Signature Truffle Burger");
});

test("decreaseCartItem removes an item when quantity reaches zero", () => {
  const cart = addCartItem([], burger);

  assert.deepEqual(decreaseCartItem(cart, "1"), []);
});

test("removeCartItem removes only the selected dish", () => {
  const sushi = {
    id: 2,
    title: "Kyoto Sushi Set",
    price: "29.99",
  };
  const cart = [burger, sushi].reduce(addCartItem, []);

  assert.deepEqual(
    removeCartItem(cart, "1").map((item) => item.id),
    ["2"],
  );
});

test("calculateCartTotals returns subtotal, delivery fee, and total", () => {
  const cart = addCartItem(addCartItem([], burger), burger);

  assert.deepEqual(calculateCartTotals(cart), {
    itemCount: 2,
    subtotal: 29.98,
    deliveryFee: 2.99,
    total: 32.97,
  });
});

test("getPreviewCartItems returns seven demo dishes for cart preview", () => {
  const previewItems = getPreviewCartItems();

  assert.equal(previewItems.length, 7);
  assert.equal(previewItems.every((item) => item.quantity >= 1), true);
  assert.equal(previewItems.every((item) => item.image), true);
});
