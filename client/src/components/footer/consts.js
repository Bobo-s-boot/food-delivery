export const dataLinksForFooter = [
  {
    links: [
      { key: "restaurants", name: "Restaurants", to: "/catalog" },
      { key: "menu", name: "Menu", to: "/menu" },
      { key: "specials", name: "Specials", to: "/specials" },
      { key: "delivery", name: "Delivery", to: "/delivery" },
    ],
  },
  {
    links: [
      { key: "helpSupport", name: "Help & Support", action: "support" },
      { key: "trackOrder", name: "Track Order", action: "trackOrder" },
      {
        key: "studentDiscounts",
        name: "Student Discounts",
        action: "studentDiscounts",
      },
      { key: "faq", name: "FAQ", to: "/#faq" },
    ],
  },
  {
    links: [
      {
        key: "addRestaurant",
        name: "Add your restaurant",
        to: "/add-restaurant",
      },
      { key: "becomeCourier", name: "Become a courier", to: "/become-courier" },
      { key: "partnerPortal", name: "Partner portal", to: "/partner-portal" },
      { key: "aboutUs", name: "About Us", to: "/about" },
    ],
  },
];

export const dataSmallLinksForFooter = {
  links: [
    { key: "privacyPolicy", name: "Privacy Policy", to: "/privacy-policy" },
    {
      key: "termsOfService",
      name: "Terms of Service",
      to: "/terms-of-service",
    },
    { key: "cookiePolicy", name: "Cookie Policy", to: "/cookie-policy" },
  ],
};
