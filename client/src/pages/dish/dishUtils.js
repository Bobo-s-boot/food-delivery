const toDishId = (dish) => String(dish?.id ?? dish?._id ?? "");

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const buildGallery = (dish, fallbackImage) => {
  const gallery = Array.isArray(dish?.gallery)
    ? dish.gallery
    : Array.isArray(dish?.images)
      ? dish.images
      : [];

  return [...gallery, fallbackImage].filter(Boolean);
};

export const normalizeDish = (dish) => {
  const image = dish?.image ?? dish?.imageUrl ?? "/img/burger.jpg";

  return {
    id: toDishId(dish),
    name: dish?.name ?? dish?.title ?? "Menu item",
    description: dish?.description ?? "",
    price: toNumber(dish?.price),
    image,
    gallery: buildGallery(dish, image),
    restaurant: dish?.restaurant ?? dish?.restaurantId?.name ?? "Defilicious",
    category: dish?.category ?? "Special",
    weight: dish?.weight ?? "",
    calories: dish?.calories ?? "",
    rating: toNumber(dish?.rating || 4.8),
    reviews: toNumber(dish?.reviews || 0),
    ingredients:
      dish?.ingredients ??
      "Fresh ingredients selected by the restaurant, prepared to order and packed for delivery.",
  };
};

export const findDishById = (dishes, id) => {
  const found = dishes.find((dish) => toDishId(dish) === String(id));
  return found ? normalizeDish(found) : null;
};

export const getDishRecommendations = (dishes, currentDish, limit = 4) =>
  dishes
    .filter((dish) => toDishId(dish) !== currentDish.id)
    .filter((dish) => dish.category === currentDish.category)
    .slice(0, limit)
    .map((dish) => normalizeDish(dish));

export const getRestaurantRecommendations = (
  dishes,
  currentDish,
  fallbackDishes = [],
  limit = 4,
) => {
  const seenIds = new Set([currentDish.id]);
  const sameRestaurant = [...dishes, ...fallbackDishes].filter((dish) => {
    const dishId = toDishId(dish);
    const restaurant =
      dish?.restaurant ?? dish?.restaurantId?.name ?? "Defilicious";
    const isMatch = restaurant === currentDish.restaurant && !seenIds.has(dishId);

    if (isMatch) {
      seenIds.add(dishId);
    }

    return isMatch;
  });

  return sameRestaurant.slice(0, limit);
};

export const calculateDishOrderTotal = ({
  basePrice,
  quantity,
  optionPrices = [],
  addOnPrices = [],
}) => {
  const extras = [...optionPrices, ...addOnPrices].reduce(
    (sum, price) => sum + toNumber(price),
    0,
  );

  return Math.round((toNumber(basePrice) + extras) * quantity * 100) / 100;
};
