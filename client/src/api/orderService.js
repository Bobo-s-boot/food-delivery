import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_URL = `${API_BASE_URL}/orders`;

const createConfig = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

export const adminGetOrders = async () => {
  const response = await axios.get(API_URL, createConfig());
  return response.data;
};

export const adminGetOrderStats = async () => {
  const response = await axios.get(`${API_URL}/stats`, createConfig());
  return response.data;
};

export const adminGetOrderAnalytics = async () => {
  const response = await axios.get(`${API_URL}/analytics`, createConfig());
  return response.data;
};

export const adminGetTopDishes = async () => {
  const response = await axios.get(`${API_URL}/top-dishes`, createConfig());
  return response.data;
};

export const adminSeedOrders = async () => {
  const response = await axios.post(`${API_URL}/seed`, null, createConfig());
  return response.data;
};
