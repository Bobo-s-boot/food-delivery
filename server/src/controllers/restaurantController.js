import fs from "fs/promises";
import { RESTAURANTS_DATA_PATH as DATA_PATH } from "../config/config.js";
import { SERVER_ERORR_MESSAGE } from "../errors/erorr.js";
import Restaurant from "../models/Restaurant.js";

export const initializeRestaurantsFromFile = async () => {
  const restaurantsCount = await Restaurant.countDocuments();
  if (restaurantsCount > 0) {
    return;
  }

  const data = await fs.readFile(DATA_PATH, "utf-8");
  const restaurants = JSON.parse(data);
  await Restaurant.insertMany(restaurants);
};

export const getAllRestaurants = async (req, res) => {
  try {
    const { q, limit } = req.query;
    const parsedLimit = Number(limit);
    const search = typeof q === "string" ? q.trim() : "";
    const hasSearch = Boolean(search);
    const filter = hasSearch
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { tags: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    let query = Restaurant.find(filter).sort({ id: 1 });
    if (Number.isFinite(parsedLimit) && parsedLimit > 0) {
      query = query.limit(parsedLimit);
    }

    const restaurants = await query;

    res.status(200).json(restaurants);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || SERVER_ERORR_MESSAGE.FIELD_TO_READ });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ id: parseInt(req.params.id) });

    if (!restaurant) {
      return res.status(404).json({ message: SERVER_ERORR_MESSAGE.NOT_FOUND });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || SERVER_ERORR_MESSAGE.FIELD_TO_READ });
  }
};

export const addRestaurant = async (req, res) => {
  try {
    const lastRestaurant = await Restaurant.findOne().sort({ id: -1 });
    const nextId = lastRestaurant ? lastRestaurant.id + 1 : 1;
    const newRestaurant = await Restaurant.create({ id: nextId, ...req.body });

    res.status(201).json(newRestaurant);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || SERVER_ERORR_MESSAGE.FIELD_TO_ADD });
  }
};
