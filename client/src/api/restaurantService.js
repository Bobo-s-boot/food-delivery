import axios from "axios";
import { CLIENT_ERORR_MESSAGE } from "../errors/error";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_URL = `${API_BASE_URL}/restaurants`;

export const getRestaurants = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const config = {
      headers: {
        Authorization: user?.token ? `Bearer ${user.token}` : "",
      },
    };

    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    console.error(CLIENT_ERORR_MESSAGE.FIELD_TO_FETCH, error);
    return [];
  }
};

export const searchRestaurants = async (query, limit = 5) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const config = {
      headers: {
        Authorization: user?.token ? `Bearer ${user.token}` : "",
      },
      params: {
        q: query,
        limit,
      },
    };

    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    console.error(CLIENT_ERORR_MESSAGE.FIELD_TO_FETCH, error);
    return [];
  }
};

export const adminGetRestaurants = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const adminDeleteRestaurant = async (id) => {
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const response = await axios.delete(`${API_URL}/${id}`, config);
  return response.data;
};

export const adminCreateRestaurant = async (restaurantData) => {
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const response = await axios.post(API_URL, restaurantData, config);
  return response.data;
};
