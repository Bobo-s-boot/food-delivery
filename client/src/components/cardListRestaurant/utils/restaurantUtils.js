import { normalizeImage } from "./normalizeImage";

export const formatRestaurant = (restaurant, index) => ({
  ...restaurant,
  id: restaurant.id || `rest-${index}`,
  name: restaurant.name || restaurant.title || "Restaurant",
  badge: restaurant.badge || (index % 2 === 0 ? "Free Delivery" : "20-30 min"),
  image: normalizeImage(restaurant.image, index),
  location: restaurant.location || "Unknown location",
  category: restaurant.category || "Category",
  rating: restaurant.rating || (4 + (index % 10) / 10).toFixed(1),
});

export const filterRestaurants = (
  restaurants,
  searchQuery = "",
  activeCategory = "All",
) => {
  const query = searchQuery.trim().toLowerCase();

  return restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(query);
    const matchesCategory =
      activeCategory === "All" ||
      restaurant.category === activeCategory ||
      restaurant.tags?.includes(activeCategory);

    return matchesSearch && matchesCategory;
  });
};
