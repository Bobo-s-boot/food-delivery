import axios from "axios";
import { CLIENT_ERORR_MESSAGE } from "../errors/error";

const API_URL = import.meta.env.VITE_API_URL;

export const getRestauranst = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error(CLIENT_ERORR_MESSAGE.FIELD_TO_FETCH, error);
    return [];
  }
};
