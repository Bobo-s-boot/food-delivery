import axios from "axios";

const API_URL = "http://localhost:5000/api/restaurants";

export const getRestauranst = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return [];
  }
};
