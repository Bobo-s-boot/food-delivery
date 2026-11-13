import Dish from "../models/dish.js";
import Restaurant from "../models/restaurant.js";
import { SERVER_ERORR_MESSAGE } from "../errors/error.js";
import {
  createDishSchema,
  dishesQuerySchema,
  dishIdSchema,
  updateDishSchema,
} from "../validation/dish.js";

export const getDishes = async (req, res) => {
  try {
    const validation = dishesQuerySchema.safeParse(req.query);
    if (!validation.success) {
      return res.status(400).json({
        message: SERVER_ERORR_MESSAGE.DISH_FETCH_SERVER_ERROR,
        errors: validation.error.flatten(),
      });
    }

    const { restaurantId, q: search, limit } = validation.data;
    const filter = {};

    if (restaurantId) {
      const numericRestaurantId = Number(restaurantId);
      if (Number.isSafeInteger(numericRestaurantId)) {
        const restaurant = await Restaurant.findOne({
          id: numericRestaurantId,
        });
        if (restaurant) {
          filter.restaurantId = restaurant._id;
        } else {
          return res.status(200).json([]);
        }
      } else {
        filter.restaurantId = restaurantId;
      }
    }

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
        { category: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    let query = Dish.find(filter).populate("restaurantId", "id name");
    if (limit) {
      query = query.limit(limit);
    }
    const dishes = await query;
    res.status(200).json(dishes);
  } catch (error) {
    console.error(SERVER_ERORR_MESSAGE.DISH_FETCH_ERROR, error);
    res
      .status(500)
      .json({ message: SERVER_ERORR_MESSAGE.DISH_FETCH_SERVER_ERROR });
  }
};

export const getDishById = async (req, res) => {
  try {
    const validation = dishIdSchema.safeParse(req.params.id);
    if (!validation.success) {
      return res.status(400).json({
        message: SERVER_ERORR_MESSAGE.DISH_NOT_FOUND,
        errors: validation.error.flatten(),
      });
    }

    const dish = await Dish.findById(validation.data).populate(
      "restaurantId",
      "name id",
    );

    if (!dish) {
      return res
        .status(404)
        .json({ message: SERVER_ERORR_MESSAGE.DISH_NOT_FOUND });
    }

    res.status(200).json(dish);
  } catch (error) {
    console.error(SERVER_ERORR_MESSAGE.DISH_SERVER_ERROR, error);
    res.status(500).json({ message: SERVER_ERORR_MESSAGE.DISH_SERVER_ERROR });
  }
};

export const createDish = async (req, res) => {
  try {
    const validation = createDishSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: SERVER_ERORR_MESSAGE.DISH_VALIDATION_ERROR,
        errors: validation.error.flatten(),
      });
    }

    const restaurantExists = await Restaurant.exists({
      _id: validation.data.restaurantId,
    });
    if (!restaurantExists) {
      return res.status(400).json({
        message: SERVER_ERORR_MESSAGE.DISH_VALIDATION_ERROR,
      });
    }

    const newDish = await Dish.create(validation.data);
    res.status(201).json(newDish);
  } catch (error) {
    console.error(SERVER_ERORR_MESSAGE.DISH_CREATE_ERROR, error);
    res.status(400).json({
      message: SERVER_ERORR_MESSAGE.DISH_VALIDATION_ERROR,
    });
  }
};

export const deleteDish = async (req, res) => {
  try {
    const validation = dishIdSchema.safeParse(req.params.id);
    if (!validation.success) {
      return res.status(400).json({
        message: SERVER_ERORR_MESSAGE.DISH_NOT_FOUND,
        errors: validation.error.flatten(),
      });
    }

    const dish = await Dish.findByIdAndDelete(validation.data);

    if (!dish) {
      return res
        .status(404)
        .json({ message: SERVER_ERORR_MESSAGE.DISH_NOT_FOUND });
    }

    res.json({ message: SERVER_ERORR_MESSAGE.DISH_DELETE_SUCCESS });
  } catch (error) {
    console.error(SERVER_ERORR_MESSAGE.DISH_DELETE_ERROR, error);
    res
      .status(500)
      .json({ message: SERVER_ERORR_MESSAGE.DISH_DELETE_SERVER_ERROR });
  }
};

export const updateDish = async (req, res) => {
  try {
    const idValidation = dishIdSchema.safeParse(req.params.id);
    if (!idValidation.success) {
      return res.status(400).json({
        message: SERVER_ERORR_MESSAGE.DISH_NOT_FOUND,
        errors: idValidation.error.flatten(),
      });
    }

    const validation = updateDishSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: SERVER_ERORR_MESSAGE.DISH_VALIDATION_ERROR,
        errors: validation.error.flatten(),
      });
    }

    if (validation.data.restaurantId) {
      const restaurantExists = await Restaurant.exists({
        _id: validation.data.restaurantId,
      });
      if (!restaurantExists) {
        return res.status(400).json({
          message: SERVER_ERORR_MESSAGE.DISH_VALIDATION_ERROR,
        });
      }
    }

    const dish = await Dish.findByIdAndUpdate(idValidation.data, validation.data, {
      new: true,
      runValidators: true,
    });

    if (!dish) {
      return res
        .status(404)
        .json({ message: SERVER_ERORR_MESSAGE.DISH_NOT_FOUND });
    }

    res.status(200).json(dish);
  } catch (error) {
    console.error(SERVER_ERORR_MESSAGE.DISH_CREATE_ERROR, error);
    res.status(400).json({
      message: SERVER_ERORR_MESSAGE.DISH_VALIDATION_ERROR,
    });
  }
};
