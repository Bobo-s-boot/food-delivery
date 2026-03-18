import fs from "fs/promises";

const DATA_PATH = "./data/restaurants.json";

export const getAllRestaurants = async (req, res) => {
  try {
    const data = await fs.readFile(DATA_PATH, "utf-8");

    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ message: "Failed to read restaurants data" });
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
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Failed to read restaurants data" });
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
    res.status(500).json({ message: "Failed to add restaurant" });
  }
};
