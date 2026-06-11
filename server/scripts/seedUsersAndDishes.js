import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "../db/connection.js";
import User from "../src/models/User.js";
import Dish from "../src/models/Dish.js";
import Restaurant from "../src/models/Restaurant.js";
import { MOCK_MENU_ITEMS } from "../../client/src/pages/menu/const.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersPath = path.resolve(__dirname, "../data/users.json");

const normalizeName = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const findRestaurantId = (dishRestaurantName, restaurants) => {
  const normalizedDishRestaurant = normalizeName(dishRestaurantName);
  if (!normalizedDishRestaurant) {
    return restaurants[0]?._id || null;
  }

  const exactMatch = restaurants.find(
    (restaurant) =>
      normalizeName(restaurant.name) === normalizedDishRestaurant ||
      normalizeName(restaurant.title) === normalizedDishRestaurant,
  );
  if (exactMatch) {
    return exactMatch._id;
  }

  const partialMatch = restaurants.find((restaurant) => {
    const names = [
      normalizeName(restaurant.name),
      normalizeName(restaurant.title),
    ].filter(Boolean);
    return names.some(
      (name) =>
        name.includes(normalizedDishRestaurant) ||
        normalizedDishRestaurant.includes(name),
    );
  });
  return partialMatch?._id || restaurants[0]?._id || null;
};

const seedUsers = async () => {
  const rawUsers = await fs.readFile(usersPath, "utf-8");
  const users = JSON.parse(rawUsers);
  let created = 0;
  let updated = 0;

  for (const user of users) {
    const role = user.role || "user";
    const provider = user.provider || "local";
    const fullName = user.fullName || user.username;
    const providerId = user.providerId || null;
    const password = user.password || null;

    const existing = await User.findOne({ username: user.username });
    if (existing) {
      existing.id = user.id || existing.id;
      existing.role = role;
      existing.provider = provider;
      existing.fullName = fullName;
      existing.providerId = providerId;
      if (password) {
        existing.password = password;
      }
      await existing.save();
      updated += 1;
    } else {
      await User.create({
        id: user.id || Date.now(),
        username: user.username,
        password,
        role,
        provider,
        fullName,
        providerId,
      });
      created += 1;
    }
  }

  return { created, updated, total: users.length };
};

const seedDishes = async () => {
  const restaurants = await Restaurant.find({}, { _id: 1, name: 1, title: 1 });
  if (!restaurants.length) {
    throw new Error("Restaurants collection is empty. Seed restaurants first.");
  }

  let created = 0;
  let skipped = 0;

  for (const item of MOCK_MENU_ITEMS) {
    const restaurantId = findRestaurantId(item.restaurant, restaurants);
    if (!restaurantId) {
      skipped += 1;
      continue;
    }

    const existingDish = await Dish.findOne({
      name: item.title,
      restaurantId,
    });
    if (existingDish) {
      skipped += 1;
      continue;
    }

    await Dish.create({
      name: item.title,
      description: item.description || "",
      price: Number(item.price) || 0,
      image: item.imageUrl || "",
      category: item.category || "",
      restaurantId,
    });
    created += 1;
  }

  return { created, skipped, total: MOCK_MENU_ITEMS.length };
};

const run = async () => {
  try {
    await connectDB();
    const usersResult = await seedUsers();
    const dishesResult = await seedDishes();

    console.log("Users seeded:", usersResult);
    console.log("Dishes seeded:", dishesResult);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

run();
