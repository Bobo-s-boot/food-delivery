import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateDishOrderTotal,
  findDishById,
  getDishRecommendations,
  getRestaurantRecommendations,
  normalizeDish,
} from "./dishUtils.js";

const dishes = [
  {
    id: 1,
    title: "Signature Truffle Burger",
    description: "Black Angus beef with truffle mayo.",
    price: "14.99",
    category: "fastFood",
    weight: "750g",
    calories: "850 kcal",
    rating: 4.8,
    reviews: 400,
    restaurant: "Kyo's Grill",
    imageUrl: "/img/burger.jpg",
  },
  {
    id: 2,
    title: "Kyoto Sushi Set",
    price: "29.99",
    category: "asianCuisine",
    imageUrl: "/img/sushi.jpg",
  },
  {
    id: 3,
    title: "Double Cheese BBQ",
    price: "13.50",
    category: "fastFood",
    imageUrl: "/img/cheese.jpg",
  },
];

test("findDishById returns a normalized dish matching string route params", () => {
  const dish = findDishById(dishes, "1");

  assert.equal(dish.id, "1");
  assert.equal(dish.name, "Signature Truffle Burger");
  assert.equal(dish.price, 14.99);
  assert.deepEqual(dish.gallery, ["/img/burger.jpg"]);
});

test("normalizeDish supports backend-style dish fields", () => {
  const dish = normalizeDish({
    _id: "mongo-id",
    name: "Seasonal Pasta",
    price: 15.5,
    image: "/img/pasta.jpg",
    restaurantId: { name: "Luigi's Woodfire" },
  });

  assert.equal(dish.id, "mongo-id");
  assert.equal(dish.name, "Seasonal Pasta");
  assert.equal(dish.restaurant, "Luigi's Woodfire");
  assert.equal(dish.image, "/img/pasta.jpg");
});

test("getDishRecommendations returns same-category dishes without current dish", () => {
  const dish = normalizeDish(dishes[0]);
  const recommendations = getDishRecommendations(dishes, dish, 4);

  assert.deepEqual(
    recommendations.map((item) => item.id),
    ["3"],
  );
});

test("calculateDishOrderTotal includes selected options, add-ons, and quantity", () => {
  const total = calculateDishOrderTotal({
    basePrice: 14.99,
    quantity: 2,
    optionPrices: [3, 1.5],
    addOnPrices: [3, 2.5],
  });

  assert.equal(total, 49.98);
});

test("getRestaurantRecommendations returns dishes from the current restaurant", () => {
  const dish = normalizeDish(dishes[0]);
  const fallbackDishes = [
    {
      id: "kyo-fries",
      title: "Loaded Fries",
      restaurant: "Kyo's Grill",
      price: "6.50",
    },
    {
      id: "other-fries",
      title: "Other Fries",
      restaurant: "Street Eats",
      price: "5.50",
    },
  ];

  const recommendations = getRestaurantRecommendations(
    dishes,
    dish,
    fallbackDishes,
    4,
  );

  assert.deepEqual(
    recommendations.map((item) => item.restaurant),
    ["Kyo's Grill"],
  );
  assert.equal(recommendations[0].title, "Loaded Fries");
});
