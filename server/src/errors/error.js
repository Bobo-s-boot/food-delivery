export const SERVER_ERORR_MESSAGE = {
  FIELD_TO_READ: "Failed to read restaurants data",
  NOT_FOUND: "Restaurant not found",
  FIELD_TO_ADD: "Failed to add restaurant",
  FIELD_TO_WRITE_LOG: "Failed to write to log file:",

  USERS_NOT_FOUND: "Users not found",
  USER_NOT_FOUND: "User not found",
  PROFILE_NOT_FOUND: "Profile not found",

  FIELD_REGISTER_EMPTY: "Please fill in all fields",

  USERER_ALREADY_EXISTS: "A user with this username already exists",

  ERROR_IN_LOGIN: "Error during login",
  INVALID_CREDENTIALS: "Invalid username or password",

  DB_URI_ERROR: "MONGO_URI is not set",
  DB_CONNECTION_ERROR: "Error connect to data base",

  AUTH_TOKEN_FAILED_ERROR: "Not authorized, token failed",
  AUTH_TOKEN_EMPTY_ERROR: "Not authorized, no token",
  ADMIN_ACCESS_REQUIRED: "Access denied. Admin role required.",
  DISH_FETCH_ERROR: "Error fetching dishes",
  DISH_FETCH_SERVER_ERROR: "Server error while loading dishes",
  DISH_NOT_FOUND: "Dish not found",
  DISH_SERVER_ERROR: "Server error",
  DISH_CREATE_ERROR: "Error creating dish",
  DISH_VALIDATION_ERROR: "Data validation error",
  DISH_DELETE_SUCCESS: "Dish deleted successfully",
  DISH_DELETE_ERROR: "Error deleting dish",
  DISH_DELETE_SERVER_ERROR: "Server error while deleting dish",

  RESTAURANT_CREATE_ERROR: "Error creating restaurant",
  RESTAURANT_DELETE_ERROR: "Error deleting restaurant",
  RESTAURANT_DELETE_SUCCESS: "Restaurant deleted successfully",
  RESTAURANT_UPDATE_ERROR: "Error updating restaurant",
  RESTAURANT_NOT_FOUND: "Restaurant not found",

  ORDER_FETCH_ERROR: "Error fetching orders",
  ORDER_STATS_ERROR: "Error calculating order statistics",
  ORDER_ANALYTICS_ERROR: "Error fetching order analytics",
  ORDER_TOP_DISHES_ERROR: "Error fetching top dishes",
  ORDER_CREATE_ERROR: "Error creating order",
  ORDER_UPDATE_ERROR: "Error updating order",
  ORDER_STATUS_INVALID: "Invalid order status",
  ORDER_NOT_FOUND: "Order not found",
  ORDER_SEED_ERROR:
    "Not enough data to generate a sample order. Add a user, restaurant, and dishes.",
  ORDER_CART_EMPTY: "Cart is empty",
  ORDER_NAME_REQUIRED: "Please provide your name",
  ORDER_PHONE_REQUIRED: "Please provide your phone number",
  ORDER_ADDRESS_REQUIRED: "Please provide your delivery address",
  ORDER_INVALID_CART:
    "Unable to create order: cart items do not map to a valid restaurant or dish.",

  STRIPE_SECRET_KEY_ERROR: "STRIPE_SECRET_KEY is not configured",
  STRIPE_AMOUNT_ERROR: "Amount must be a positive number",
  STRIPE_INTENT_ERROR: "Stripe payment intent error:",

  STRIPE_SIGNATURE_ERROR: "Missing Stripe signature",
  STRIPE_MISSING_WEBHOOK_ERROR: "Missing STRIPE_WEBHOOK_SECRET",
  STRIPE_WEBHOOK_ERROR: "Stripe webhook error:",
};
