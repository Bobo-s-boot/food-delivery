import axios from "axios";
import { CLIENT_ERORR_MESSAGE } from "../errors/error";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API_URL = `${API_BASE_URL}/users`;

export const getUsers = async () => {
  try {
    const admin = JSON.parse(localStorage.getItem("admin"));

    if (!admin) {
      throw new Error(CLIENT_ERORR_MESSAGE.ERROR_ROLE_ADMIN);
    }

    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error(CLIENT_ERORR_MESSAGE.ERROR_TOKEN);
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    console.error(CLIENT_ERORR_MESSAGE.ERROR_GET_USERS, error);
    return [];
  }
};
