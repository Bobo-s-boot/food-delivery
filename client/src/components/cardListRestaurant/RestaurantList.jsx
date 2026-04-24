import { useEffect, useState } from "react";
import { RestaurantCard } from "./RestaurantCard";
import { getRestaurants } from "../../api/restaurantService";
import { CLIENT_ERORR_MESSAGE } from "../../errors/error";

export function RestaurantList({ searchQuery = "", activeCategory = "All" }) {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const normalizeImage = (image, index) => {
    if (typeof image !== "string" || image.trim() === "") {
      return `/img/card-${(index % 8) + 1}.png`;
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    if (image.startsWith("/img/")) {
      return image;
    }

    return `/img/card-${(index % 8) + 1}.png`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRestaurants();
        const formattedData = data.map((restaurant, index) => ({
          ...restaurant,
          id: restaurant.id || `rest-${index}`,
          name: restaurant.name || restaurant.title || "Restaurant",
          badge:
            restaurant.badge ||
            (index % 2 === 0 ? "Free Delivery" : "20-30 min"),
          image: normalizeImage(restaurant.image, index),
          location: restaurant.location || "Unknown location",
          category: restaurant.category || "Category",
          rating: restaurant.rating || (4 + (index % 10) / 10).toFixed(1),
        }));

        setRestaurants(formattedData);
        setLoading(false);
      } catch (error) {
        console.error(CLIENT_ERORR_MESSAGE.FIELD_TO_FETCH, error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "All" || restaurant.tags?.includes(activeCategory);
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="text-center text-gray-500 text-xl mt-20">
        Download restaurants...
      </div>
    );
  }

  if (filteredRestaurants.length === 0) {
    return (
      <div className="text-center text-gray-500 text-xl mt-20">
        Nothing found 😔
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {filteredRestaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} data={restaurant} />
      ))}
    </div>
  );
}
