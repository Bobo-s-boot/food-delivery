import axios from "axios";
import { CLIENT_ERORR_MESSAGE } from "../errors/error";
import { getAuthToken } from "./authConfig";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_URL = `${API_BASE_URL}/auth`;

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message || CLIENT_ERORR_MESSAGE.FIELD_TO_REGISTER
    );
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || CLIENT_ERORR_MESSAGE.FIELD_TO_LOGIN;
  }
};

export const isTokenActive = () => {
  try {
    const token = getAuthToken();
    if (!token) return false;

    const parts = token.split(".");
    if (parts.length < 2) return false;

    const payload = JSON.parse(atob(parts[1]));
    if (!payload) return false;

    // If token has exp (in seconds) check it, otherwise treat as inactive
    if (payload.exp && typeof payload.exp === "number") {
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    }

    return false;
  } catch {
    return false;
  }
};
