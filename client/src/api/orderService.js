import axios from "axios";
import { createAuthConfig } from "./authConfig";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const API_URL = `${API_BASE_URL}/orders`;

export const adminGetOrders = async () => {
  const response = await axios.get(API_URL, createAuthConfig());
  return response.data;
};

export const adminGetOrderStats = async () => {
  const response = await axios.get(`${API_URL}/stats`, createAuthConfig());
  return response.data;
};

export const adminGetOrderAnalytics = async () => {
  const response = await axios.get(`${API_URL}/analytics`, createAuthConfig());
  return response.data;
};

export const adminGetTopDishes = async () => {
  const response = await axios.get(`${API_URL}/top-dishes`, createAuthConfig());
  return response.data;
};

export const adminSeedOrders = async () => {
  const response = await axios.post(`${API_URL}/seed`, null, createAuthConfig());
  return response.data;
};

export const createOrder = async (orderData) => {
  const config = createAuthConfig();
  // We don't want to fail if the user is a guest, so if no token is present, we still send the request
  const response = await axios.post(API_URL, orderData, config);
  return response.data;
};
