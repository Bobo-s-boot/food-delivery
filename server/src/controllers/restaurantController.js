import fs from "fs/promises";
import { SERVER_ERORR_MESSAGE } from "../../errors/erorr.js";

const DATA_PATH = "./data/restaurants.json";

export const getAllRestaurants = async (req, res) => {
  try {
    const data = await fs.readFile(DATA_PATH, "utf-8");

    res.json(JSON.parse(data));
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || SERVER_ERORR_MESSAGE.FIELD_TO_READ });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const data = await fs.readFile(DATA_PATH, "utf-8");
    const restaurants = JSON.parse(data);

    const restaurant = restaurants.find(
      (r) => r.id === parseInt(req.params.id),
    );

    if (!restaurant) {
      return res.status(404).json({ message: SERVER_ERORR_MESSAGE.NOT_FOUND });
    }

    res.status(201).json(restaurant);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || SERVER_ERORR_MESSAGE.FIELD_TO_READ });
  }
};

export const addRestaurant = async (req, res) => {
  try {
    const data = await fs.readFile(DATA_PATH, "utf-8");
    const restaurants = JSON.parse(data);

    const newRestaurant = { id: Date.now(), ...req.body };
    restaurants.push(newRestaurant);

    await fs.writeFile(
      DATA_PATH,
      JSON.stringify(restaurants, null, 2),
      "utf-8",
    );

    res.status(201).json(newRestaurant);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || SERVER_ERORR_MESSAGE.FIELD_TO_ADD });
  }
};
