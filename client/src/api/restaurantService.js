import axios from "axios";
import { CLIENT_ERORR_MESSAGE } from "../errors/error";
import { createAuthConfig } from "./authConfig";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_URL = `${API_BASE_URL}/restaurants`;

export const getRestaurants = async () => {
  try {
    const response = await axios.get(API_URL, createAuthConfig());
    return response.data;
  } catch (error) {
    console.error(CLIENT_ERORR_MESSAGE.FIELD_TO_FETCH, error);
    return [];
  }
};

export const searchRestaurants = async (query, limit = 5) => {
  try {
    const config = {
      ...createAuthConfig(),
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
  const response = await axios.delete(`${API_URL}/${id}`, createAuthConfig());
  return response.data;
};

export const adminCreateRestaurant = async (restaurantData) => {
  const response = await axios.post(API_URL, restaurantData, createAuthConfig());
  return response.data;
};

export const adminUpdateRestaurant = async (id, restaurantData) => {
  const response = await axios.put(`${API_URL}/${id}`, restaurantData, createAuthConfig());
  return response.data;
};
