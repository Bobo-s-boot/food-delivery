import axios from "axios";
import { CLIENT_ERORR_MESSAGE } from "../errors/error";

const API_URL = import.meta.env.VITE_API_URL + "/restaurants";

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
