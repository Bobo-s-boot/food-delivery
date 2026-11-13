import fs from "fs/promises";
import { RESTAURANTS_DATA_PATH as DATA_PATH } from "../config/config.js";
import { SERVER_ERORR_MESSAGE } from "../errors/error.js";
import Restaurant from "../models/restaurant.js";
import { nextSequenceValue, synchronizeSequence } from "../utils/sequences.js";
import {
  restaurantCreateSchema,
  restaurantNumericIdSchema,
  restaurantObjectIdSchema,
  restaurantQuerySchema,
  restaurantUpdateSchema,
} from "../validation/restaurant.js";

export const initializeRestaurantsFromFile = async () => {
  const restaurantsCount = await Restaurant.countDocuments();
  if (restaurantsCount === 0) {
    const data = await fs.readFile(DATA_PATH, "utf-8");
    const restaurants = JSON.parse(data);
    await Restaurant.insertMany(restaurants);
  }

  const lastRestaurant = await Restaurant.findOne()
    .sort({ id: -1 })
    .select("id");
  await synchronizeSequence("restaurant", lastRestaurant?.id ?? 0);
};

export const createRestaurant = async (req, res) => {
  try {
    const validation = restaurantCreateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: SERVER_ERORR_MESSAGE.RESTAURANT_CREATE_ERROR,
        errors: validation.error.flatten(),
      });
    }

    const {
      name,
      cuisine,
      title,
      badge,
      description,
      category,
      rating,
      price,
      image,
      location,
      tags,
    } = validation.data;

    const newRestaurant = await Restaurant.create({
      id: await nextSequenceValue("restaurant"),
      name,
      cuisine,
      title,
      badge: badge || "New",
      description,
      category,
      rating: rating || "5.0",
      price,
      image: image || "/img/card-1.png",
      location: location || "Local",
      tags,
    });
    res.status(201).json(newRestaurant);
  } catch (error) {
    console.error(SERVER_ERORR_MESSAGE.RESTAURANT_CREATE_ERROR, error);
    res.status(400).json({
      message: SERVER_ERORR_MESSAGE.RESTAURANT_CREATE_ERROR,
    });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const validation = restaurantObjectIdSchema.safeParse(req.params.id);
    if (!validation.success) {
      return res
        .status(400)
        .json({ message: SERVER_ERORR_MESSAGE.RESTAURANT_NOT_FOUND });
    }

    const restaurant = await Restaurant.findByIdAndDelete(validation.data);

    if (!restaurant) {
      return res
        .status(404)
        .json({ message: SERVER_ERORR_MESSAGE.RESTAURANT_NOT_FOUND });
    }

    res.json({ message: SERVER_ERORR_MESSAGE.RESTAURANT_DELETE_SUCCESS });
  } catch (error) {
    res
      .status(500)
      .json({ message: SERVER_ERORR_MESSAGE.RESTAURANT_DELETE_ERROR });
  }
};

export const getAllRestaurants = async (req, res) => {
  try {
    const validation = restaurantQuerySchema.safeParse(req.query);
    if (!validation.success) {
      return res.status(400).json({
        message: SERVER_ERORR_MESSAGE.FIELD_TO_READ,
        errors: validation.error.flatten(),
      });
    }

    const { q: search, limit } = validation.data;
    const hasSearch = Boolean(search);
    const escapedSearch = search
      ? search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      : "";

    const filter = hasSearch
      ? {
          $or: [
            { name: { $regex: escapedSearch, $options: "i" } },
            { title: { $regex: escapedSearch, $options: "i" } },
            { description: { $regex: escapedSearch, $options: "i" } },
            { category: { $regex: escapedSearch, $options: "i" } },
            { tags: { $regex: escapedSearch, $options: "i" } },
          ],
        }
      : {};

    let query = Restaurant.find(filter).sort({ id: 1 });
    if (limit) {
      query = query.limit(limit);
    }

    const restaurants = await query;

    res.status(200).json(restaurants);
  } catch (error) {
    console.error(SERVER_ERORR_MESSAGE.FIELD_TO_READ, error);
    res.status(500).json({ message: SERVER_ERORR_MESSAGE.FIELD_TO_READ });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const validation = restaurantNumericIdSchema.safeParse(req.params.id);
    if (!validation.success) {
      return res.status(400).json({
        message: SERVER_ERORR_MESSAGE.NOT_FOUND,
        errors: validation.error.flatten(),
      });
    }

    const restaurant = await Restaurant.findOne({ id: validation.data });

    if (!restaurant) {
      return res.status(404).json({ message: SERVER_ERORR_MESSAGE.NOT_FOUND });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    console.error(SERVER_ERORR_MESSAGE.FIELD_TO_READ, error);
    res.status(500).json({ message: SERVER_ERORR_MESSAGE.FIELD_TO_READ });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const idValidation = restaurantObjectIdSchema.safeParse(id);
    if (!idValidation.success) {
      return res.status(400).json({
        message: SERVER_ERORR_MESSAGE.RESTAURANT_UPDATE_ERROR,
      });
    }

    const validation = restaurantUpdateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: SERVER_ERORR_MESSAGE.RESTAURANT_UPDATE_ERROR,
        errors: validation.error.flatten(),
      });
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      idValidation.data,
      validation.data,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedRestaurant) {
      return res
        .status(404)
        .json({ message: SERVER_ERORR_MESSAGE.RESTAURANT_NOT_FOUND });
    }
    res.status(200).json(updatedRestaurant);
  } catch (error) {
    console.error(SERVER_ERORR_MESSAGE.RESTAURANT_UPDATE_ERROR, error);
    res.status(400).json({
      message: SERVER_ERORR_MESSAGE.RESTAURANT_UPDATE_ERROR,
    });
  }
};
