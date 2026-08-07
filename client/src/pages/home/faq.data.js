export const FAQ_ITEMS = [
  {
    id: "what-is-defilicious",
    translationKey: "whatIsDefilicious",
  },
  {
    id: "account-requirements",
    translationKey: "accountRequirements",
  },
  {
    id: "find-a-restaurant",
    translationKey: "findRestaurant",
    action: {
      type: "route",
      to: "/catalog",
      labelKey: "exploreRestaurants",
    },
  },
  {
    id: "view-restaurant-menus",
    translationKey: "viewMenus",
    action: {
      type: "route",
      to: "/menu",
      labelKey: "browseMenus",
    },
  },
  {
    id: "special-offers",
    translationKey: "specialOffers",
    action: {
      type: "route",
      to: "/specials",
      labelKey: "viewSpecialOffers",
    },
  },
  {
    id: "delivery",
    translationKey: "delivery",
  },
  {
    id: "track-an-order",
    translationKey: "trackOrder",
    action: {
      type: "account",
      section: "orders",
      labelKey: "trackOrder",
    },
  },
  {
    id: "student-discounts",
    translationKey: "studentDiscounts",
    action: {
      type: "account",
      section: "payments",
      labelKey: "viewStudentDiscounts",
    },
  },
  {
    id: "incorrect-information",
    translationKey: "incorrectInformation",
    action: {
      type: "support",
      labelKey: "contactSupport",
    },
  },
  {
    id: "contact-support",
    translationKey: "contactSupport",
    action: {
      type: "support",
      labelKey: "openSupport",
    },
  },
];
