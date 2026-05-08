import Dish from "../models/Dish.js";
import { SERVER_ERORR_MESSAGE } from "../errors/erorr.js";

export const getDishes = async (req, res) => {
  try {
    const { restaurantId, q, limit } = req.query;
    const parsedLimit = Number(limit);
    const search = typeof q === "string" ? q.trim() : "";
    const hasSearch = Boolean(search);
    const filter = {};

    if (restaurantId) {
      filter.restaurantId = restaurantId;
    }

    if (hasSearch) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    let query = Dish.find(filter).populate("restaurantId", "id name");
    if (Number.isFinite(parsedLimit) && parsedLimit > 0) {
      query = query.limit(parsedLimit);
    }
    const dishes = await query;
    res.status(200).json(dishes);
  } catch (error) {
    console.error(SERVER_ERORR_MESSAGE.DISH_FETCH_ERROR, error);
    res.status(500).json({ message: SERVER_ERORR_MESSAGE.DISH_FETCH_SERVER_ERROR });
  }
};

export const getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id).populate(
      "restaurantId",
      "name",
    );

    if (!dish) {
      return res.status(404).json({ message: SERVER_ERORR_MESSAGE.DISH_NOT_FOUND });
    }

    res.status(200).json(dish);
  } catch (error) {
    res.status(500).json({ message: SERVER_ERORR_MESSAGE.DISH_SERVER_ERROR });
  }
};

export const createDish = async (req, res) => {
  try {
    const newDish = await Dish.create(req.body);
    res.status(201).json(newDish);
  } catch (error) {
    console.error(SERVER_ERORR_MESSAGE.DISH_CREATE_ERROR, error);
    res
      .status(400)
      .json({ message: SERVER_ERORR_MESSAGE.DISH_VALIDATION_ERROR, error: error.message });
  }
};

export const deleteDish = async (req, res) => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);

    if (!dish) {
      return res.status(404).json({ message: SERVER_ERORR_MESSAGE.DISH_NOT_FOUND });
    }

    res.json({ message: SERVER_ERORR_MESSAGE.DISH_DELETE_SUCCESS });
  } catch (error) {
    console.error(SERVER_ERORR_MESSAGE.DISH_DELETE_ERROR, error);
    res.status(500).json({ message: SERVER_ERORR_MESSAGE.DISH_DELETE_SERVER_ERROR });
  }
};
