import axios from "axios";
import { CLIENT_ERORR_MESSAGE } from "../errors/error";
import { createAuthConfig, getAuthToken, getStoredUser } from "./authConfig";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API_URL = `${API_BASE_URL}/users`;

export const getUsers = async () => {
  try {
    const user = getStoredUser();

    if (user?.role !== "admin") {
      throw new Error(CLIENT_ERORR_MESSAGE.ERROR_ROLE_ADMIN);
    }

    const token = getAuthToken();

    if (!token) {
      throw new Error(CLIENT_ERORR_MESSAGE.ERROR_TOKEN);
    }

    const response = await axios.get(API_URL, createAuthConfig());
    return response.data;
  } catch (error) {
    console.error(CLIENT_ERORR_MESSAGE.ERROR_GET_USERS, error);
    return [];
  }
};

export const getUserProfile = async () => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error(CLIENT_ERORR_MESSAGE.ERROR_TOKEN);
    }

    const response = await axios.get(`${API_URL}/profile`, createAuthConfig());
    return response.data;
  } catch (error) {
    console.error(CLIENT_ERORR_MESSAGE.ERROR_PROFILE, error);
    throw error;
  }
};
