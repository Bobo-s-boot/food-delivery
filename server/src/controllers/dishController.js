import Dish from "../models/Dish.js";

export const getDishes = async (req, res) => {
  try {
    const { restaurantId } = req.query;
    const filter = restaurantId ? { restaurantId } : {};

    // .populate() автоматически подтянет имя ресторана по его ID
    const dishes = await Dish.find(filter).populate("restaurantId", "name");
    res.status(200).json(dishes);
  } catch (error) {
    console.error("Ошибка при получении блюд:", error);
    res.status(500).json({ message: "Ошибка сервера при загрузке блюд" });
  }
};

export const getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id).populate(
      "restaurantId",
      "name",
    );

    if (!dish) {
      return res.status(404).json({ message: "Блюдо не найдено" });
    }

    res.status(200).json(dish);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const createDish = async (req, res) => {
  try {
    const newDish = await Dish.create(req.body);
    res.status(201).json(newDish);
  } catch (error) {
    console.error("Ошибка при создании блюда:", error);
    res
      .status(400)
      .json({ message: "Ошибка валидации данных", error: error.message });
  }
};

export const deleteDish = async (req, res) => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);

    if (!dish) {
      return res.status(404).json({ message: "Блюдо не найдено" });
    }

    res.json({ message: "Блюдо успешно удалено" });
  } catch (error) {
    console.error("Ошибка при удалении блюда:", error);
    res.status(500).json({ message: "Ошибка сервера при удалении блюда" });
  }
};
