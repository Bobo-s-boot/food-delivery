export const DISH_REVIEWS = [
  {
    id: "review-1",
    author: "Mia Carter",
    rating: 5,
    text: "Arrived warm, packed neatly, and tasted exactly like the photo promised.",
    time: "2 days ago",
  },
  {
    id: "review-2",
    author: "Daniel Brooks",
    rating: 4.8,
    text: "Great balance of flavor and portion size. I would order it again.",
    time: "1 week ago",
  },
  {
    id: "review-3",
    author: "Emma Wilson",
    rating: 4.9,
    text: "The truffle mayo was rich without being too heavy. Fries on the side made it a perfect meal.",
    time: "2 weeks ago",
  },
];

export const CUSTOMIZATION_GROUPS = [
  {
    id: "patty",
    title: "Patty",
    options: [
      { id: "single", label: "Single", price: 0 },
      { id: "double", label: "Double +$3", price: 3 },
    ],
  },
  {
    id: "cheese",
    title: "Cheese",
    options: [
      { id: "aged-cheddar", label: "Aged cheddar", price: 0 },
      { id: "no-cheese", label: "No cheese", price: 0 },
      { id: "extra-cheese", label: "Extra cheese +$1.50", price: 1.5 },
    ],
  },
  {
    id: "sauce",
    title: "Sauce",
    options: [
      { id: "truffle-mayo", label: "Truffle mayo", price: 0 },
      { id: "bbq", label: "BBQ", price: 0 },
      { id: "spicy-mayo", label: "Spicy mayo", price: 0 },
    ],
  },
];

export const COMBO_ADD_ONS = [
  { id: "fries", label: "Fries", price: 3 },
  { id: "drink", label: "Drink", price: 2.5 },
  { id: "buffalo-wings", label: "Buffalo wings", price: 5 },
];

export const DETAIL_CARDS = [
  {
    id: "ingredients",
    title: "Ingredients",
    text: "Black Angus beef patty, brioche bun, aged cheddar, smoked bacon, truffle mayo, lettuce, tomato, pickles and red onion.",
    chips: [
      "Black Angus beef",
      "Brioche bun",
      "Aged cheddar",
      "Smoked bacon",
      "Truffle mayo",
      "Lettuce",
      "Pickles",
      "Red onion",
    ],
  },
  {
    id: "nutrition",
    title: "Nutrition & allergens",
    rows: [
      ["Calories", "850 kcal"],
      ["Portion", "750g"],
      ["Allergens", "Gluten, dairy, eggs, mustard"],
    ],
    note: "Nutrition may vary based on selected extras.",
  },
  {
    id: "delivery",
    title: "Delivery details",
    rows: [
      ["Estimated delivery", "25-40 min"],
      ["Delivery fee", "Calculated at checkout"],
      ["Pickup", "Available after confirmation"],
      ["Courier notes", "Available at checkout"],
    ],
    note: "Orders are prepared after confirmation and packed for delivery.",
  },
  {
    id: "restaurant",
    title: "Kyo's Grill",
    rows: [
      ["Restaurant rating", "4.7 ★"],
      ["Distance", "1.2 km away"],
      ["Status", "Open until 11:00 PM"],
      ["Packaging", "Sealed delivery bag"],
    ],
    action: "View restaurant",
  },
];

export const RATING_DISTRIBUTION = [
  ["5 stars", 84],
  ["4 stars", 12],
  ["3 stars", 3],
  ["2 stars", 1],
  ["1 star", 0.5],
];

export const CATEGORY_RATINGS = [
  ["Taste", 4.9],
  ["Packaging", 4.8],
  ["Delivery", 4.7],
  ["Value", 4.6],
];

export const RESTAURANT_RELATED_ITEMS = [
  {
    id: "kyo-loaded-fries",
    title: "Loaded Fries",
    description: "Crispy fries with cheddar sauce, bacon crumbs and herbs.",
    price: "6.50",
    category: "fastFood",
    weight: "320g",
    calories: "520 kcal",
    rating: 4.7,
    reviews: 188,
    restaurant: "Kyo's Grill",
    imageUrl:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80",
  },
  {
    id: "kyo-onion-rings",
    title: "Crispy Onion Rings",
    description: "Golden onion rings with smoked paprika dip.",
    price: "5.90",
    category: "fastFood",
    weight: "260g",
    calories: "430 kcal",
    rating: 4.6,
    reviews: 142,
    restaurant: "Kyo's Grill",
    imageUrl:
      "https://images.unsplash.com/photo-1639024471283-03518883512d?w=800&q=80",
  },
  {
    id: "kyo-cola",
    title: "Craft Cola",
    description: "Chilled craft cola with citrus notes.",
    price: "3.50",
    category: "beverages",
    weight: "330ml",
    calories: "130 kcal",
    rating: 4.8,
    reviews: 96,
    restaurant: "Kyo's Grill",
    imageUrl:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80",
  },
  {
    id: "kyo-buffalo-wings",
    title: "Buffalo Wings",
    description: "Spicy glazed wings with ranch dip.",
    price: "12.00",
    category: "fastFood",
    weight: "400g",
    calories: "600 kcal",
    rating: 4.7,
    reviews: 215,
    restaurant: "Kyo's Grill",
    imageUrl:
      "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&q=80",
  },
];
