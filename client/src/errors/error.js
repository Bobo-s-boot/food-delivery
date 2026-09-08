export const CLIENT_ERROR_MESSAGES = {
  FAILED_TO_FETCH: "Error fetching restaurants:",
  FAILED_TO_FETCH_MENU: "Error fetching menu:",
  FAILED_TO_CREATE_DISH: "Error creating dish:",
  FAILED_TO_DELETE_DISH: "Error deleting dish:",
  FAILED_TO_SEARCH_DISH: "Error searching dishes:",
  FAILED_TO_REGISTER: "Error registering user:",
  FAILED_TO_LOGIN: "Error logging in user:",

  ERROR_GET_USERS: "Error getting users:",
  ERROR_ROLE_ADMIN: "You don't have admin role:",
  ERROR_TOKEN: "Your token is empty:",
  ERROR_PROFILE: "Error loading profile:",
};

export const ADMIN_ERROR_MESSAGES = {
  LOAD_ORDERS: "Error loading admin orders",
  LOAD_DISHES: "Error loading admin dishes",
  LOAD_RESTAURANTS_WORKSPACE: "Error loading admin restaurants workspace",
  LOAD_USERS_WORKSPACE: "Error loading admin users workspace",
  SAVE_DISH: "Error saving dish",
  DELETE_DISH: "Error deleting dish",
  CREATE_RESTAURANT: "Error creating restaurant",
  UPDATE_RESTAURANT: "Error updating restaurant",
  DELETE_RESTAURANT: "Error deleting restaurant",
  UPDATE_ORDER_STATUS: "Error updating order status",
};

export const ADMIN_CONFIRM_MESSAGES = {
  DELETE_DISH: "Delete this dish from the menu?",
  DELETE_RESTAURANT: "Delete this restaurant?",
};

export function buildAdminErrorMessage(messageKey, error) {
  const errorMessage =
    error?.response?.data?.message || error?.message || "Unknown error";

  const baseMessage = ADMIN_ERROR_MESSAGES[messageKey] || "Admin error";

  return `${baseMessage}: ${errorMessage}`;
}
