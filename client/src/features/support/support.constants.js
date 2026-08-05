export const SUPPORT_CATEGORIES = [
  { id: "account_profile", labelKey: "accountProfile" },
  { id: "order_delivery", labelKey: "orderDelivery" },
  { id: "restaurant_information", labelKey: "restaurantInformation" },
  { id: "offer_discount", labelKey: "offerDiscount" },
  { id: "student_discount", labelKey: "studentDiscount" },
  { id: "payment_refund", labelKey: "paymentRefund" },
  { id: "technical_problem", labelKey: "technicalProblem" },
  { id: "other", labelKey: "other" },
];

export const SUPPORT_FEATURES = [
  { id: "homepage", labelKey: "homepage" },
  { id: "restaurants", labelKey: "restaurants" },
  { id: "menu", labelKey: "menu" },
  { id: "cart", labelKey: "cart" },
  { id: "checkout", labelKey: "checkout" },
  { id: "user_account", labelKey: "userAccount" },
  { id: "student_discount", labelKey: "studentDiscount" },
  { id: "other", labelKey: "other" },
];

export const MAX_SUPPORT_FILES = 3;
export const MAX_SUPPORT_FILE_SIZE = 10 * 1024 * 1024;
export const SUPPORTED_SUPPORT_FILE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);
export const SUPPORTED_SUPPORT_FILE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "pdf",
]);

export const EMPTY_SUPPORT_FORM = {
  category: "",
  subject: "",
  description: "",
  relatedOrderId: "",
  relatedRestaurantId: "",
  relatedOfferId: "",
  affectedFeature: "",
};
