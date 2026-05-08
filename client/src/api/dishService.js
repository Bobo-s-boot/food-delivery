import axios from "axios";
import { CLIENT_ERORR_MESSAGE } from "../errors/error";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_URL = `${API_BASE_URL}/dishes`;

export const getDishesByRestaurant = async (restaurantId) => {
  try {
    // Передаем ID ресторана в строке запроса (query parameter)
    const response = await axios.get(`${API_URL}?restaurantId=${restaurantId}`);
    
    return response.data;
  } catch (error) {
    console.error(CLIENT_ERORR_MESSAGE.FIELD_TO_FETCH_MENU, error);
    return [];
  }
};

export const createDish = async (dishData) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const response = await axios.post(API_URL, dishData, config);
    return response.data;
  } catch (error) {
    console.error(CLIENT_ERORR_MESSAGE.FIELD_TO_CREATE_DISH, error);
    throw error;
  }
};

export const deleteDish = async (dishId) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const response = await axios.delete(`${API_URL}/${dishId}`, config);
    return response.data;
  } catch (error) {
    console.error(CLIENT_ERORR_MESSAGE.FIELD_TO_DELETE_DISH, error);
    throw error;
  }
};

export const searchDishes = async (query, limit = 5) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        q: query,
        limit,
      },
    });

    return response.data;
  } catch (error) {
    console.error(CLIENT_ERORR_MESSAGE.FIELD_TO_SEARCH_DISH, error);
    return [];
  }
};
