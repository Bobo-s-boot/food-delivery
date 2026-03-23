import axios from "axios";
import { CLIENT_ERORR_MESSAGE } from "../errors/error";

const API_URL = import.meta.env.VITE_API_URL + "/auth";

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
    const repsonse = await axios.post(`${API_URL}/login`, userData);
    return repsonse.data;
  } catch (error) {
    throw error.response?.data?.message || CLIENT_ERORR_MESSAGE.FIELD_TO_LOGIN;
  }
};
