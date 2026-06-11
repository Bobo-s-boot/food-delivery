export const MENU_CATEGORIES = [
  {
    key: "fastFood",
    name: "Fast Food",
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
  },
  {
    key: "asianCuisine",
    name: "Asian Cuisine",
    imageUrl:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80",
  },
  {
    key: "european",
    name: "European",
    imageUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80",
  },
  {
    key: "healthyDiet",
    name: "Healthy & Diet",
    imageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
  },
  {
    key: "comfortFood",
    name: "Comfort Food",
    imageUrl:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&q=80",
  },
  {
    key: "bakerySweets",
    name: "Bakery & Sweets",
    imageUrl:
      "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&q=80",
  },
  {
    key: "beverages",
    name: "Beverages",
    imageUrl:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80",
  },
];

export const MOCK_MENU_ITEMS = [
  // --- FAST FOOD ---
  {
    id: 1,
    title: "Signature Truffle Burger",
    description:
      "100% Black Angus beef patty, melted aged cheddar, smoked bacon, and truffle mayo.",
    price: "14.99",
    category: "fastFood",
    weight: "750g",
    calories: "850 kcal",
    rating: 4.8,
    reviews: 400,
    restaurant: "Kyo's Grill",
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
  },
  {
    id: 9,
    title: "Crispy Buffalo Wings",
    description:
      "Jumbo wings tossed in spicy buffalo sauce, served with celery and blue cheese dip.",
    price: "12.00",
    category: "fastFood",
    weight: "400g",
    calories: "600 kcal",
    rating: 4.7,
    reviews: 215,
    restaurant: "Burger Joint",
    imageUrl:
      "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&q=80",
  },
  {
    id: 14,
    title: "Double Cheese BBQ",
    description:
      "Two patties, double cheddar, caramelized onions and spicy BBQ sauce.",
    price: "13.50",
    category: "fastFood",
    weight: "550g",
    calories: "950 kcal",
    rating: 4.6,
    reviews: 180,
    restaurant: "Burger Joint",
    imageUrl:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",
  },
  {
    id: 22,
    title: "Classic Hot Dog",
    description: "Beef sausage, mustard, ketchup and relish in a toasted bun.",
    price: "8.99",
    category: "fastFood",
    weight: "300g",
    calories: "450 kcal",
    rating: 4.5,
    reviews: 120,
    restaurant: "Street Eats",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1731060034920-6c10381d7731?q=80&w=800&auto=format&fit=crop",
  },

  // --- ASIAN CUISINE ---
  {
    id: 2,
    title: "Kyoto Sushi Set",
    description:
      "Premium salmon, tuna, and avocado rolls topped with spicy mayo.",
    price: "29.99",
    category: "asianCuisine",
    weight: "800g",
    calories: "650 kcal",
    rating: 4.9,
    reviews: 630,
    restaurant: "Oasis Sushi",
    imageUrl:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
  },
  {
    id: 6,
    title: "Spicy Ramen",
    description: "Rich pork broth, soft boiled egg, and spicy garlic oil.",
    price: "16.00",
    category: "asianCuisine",
    weight: "600g",
    calories: "700 kcal",
    rating: 4.9,
    reviews: 512,
    restaurant: "Tokyo Ramen",
    imageUrl:
      "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=800&q=80",
  },
  {
    id: 15,
    title: "Dragon Roll Special",
    description: "Unagi and avocado with traditional eel sauce and sesame.",
    price: "18.00",
    category: "asianCuisine",
    weight: "320g",
    calories: "450 kcal",
    rating: 4.8,
    reviews: 320,
    restaurant: "Oasis Sushi",
    imageUrl:
      "https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=800&q=80",
  },
  {
    id: 24,
    title: "Shrimp Pad Thai",
    description:
      "Traditional rice noodles with shrimp, sprouts, and crushed peanuts.",
    price: "15.50",
    category: "asianCuisine",
    weight: "500g",
    calories: "550 kcal",
    rating: 4.7,
    reviews: 145,
    restaurant: "Wok Express",
    imageUrl:
      "https://images.unsplash.com/photo-1742646803135-062f43c4e4ee?q=80&w=800&auto=format&fit=crop",
  },

  // --- EUROPEAN ---
  {
    id: 4,
    title: "Pizza Amiza",
    description:
      "Authentic Italian square pizza with pepperoni, fresh basil, and mozzarella.",
    price: "17.99",
    category: "european",
    weight: "900g",
    calories: "1200 kcal",
    rating: 4.8,
    reviews: 215,
    restaurant: "Luigi's Woodfire",
    imageUrl:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 10,
    title: "Pasta Carbonara",
    description: "Classic creamy pasta with guanciale and pecorino romano.",
    price: "15.50",
    category: "european",
    weight: "450g",
    calories: "780 kcal",
    rating: 4.6,
    reviews: 180,
    restaurant: "Luigi's Woodfire",
    imageUrl:
      "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80",
  },
  {
    id: 31,
    title: "Greek Salad",
    description:
      "Fresh cucumbers, tomatoes, olives, and feta cheese with oregano.",
    price: "10.99",
    category: "european",
    weight: "350g",
    calories: "280 kcal",
    rating: 4.7,
    reviews: 190,
    restaurant: "Aegean Flavors",
    imageUrl:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
  },

  // --- HEALTHY & DIET ---
  {
    id: 3,
    title: "Green Bowl Oasis",
    description:
      "A mix of quinoa, fresh greens, edamame, avocado, and vinaigrette.",
    price: "15.99",
    category: "healthyDiet",
    weight: "450g",
    calories: "350 kcal",
    rating: 4.7,
    reviews: 400,
    restaurant: "Fresh Oasis",
    imageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
  },
  {
    id: 7,
    title: "Caesar Salad",
    description: "Crispy romaine, parmesan cheese, and grilled chicken breast.",
    price: "11.00",
    category: "healthyDiet",
    weight: "350g",
    calories: "450 kcal",
    rating: 4.5,
    reviews: 320,
    restaurant: "Green Leaf",
    imageUrl:
      "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&q=80",
  },
  {
    id: 17,
    title: "Avocado Toast Max",
    description: "Multigrain bread, smashed avocado, and poached eggs.",
    price: "9.99",
    category: "healthyDiet",
    weight: "300g",
    calories: "380 kcal",
    rating: 4.8,
    reviews: 290,
    restaurant: "Fresh Oasis",
    imageUrl:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80",
  },
  {
    id: 32,
    title: "Poke Bowl Salmon",
    description:
      "Fresh diced salmon, radish, edamame and rice with soy dressing.",
    price: "16.50",
    category: "healthyDiet",
    weight: "420g",
    calories: "490 kcal",
    rating: 4.9,
    reviews: 215,
    restaurant: "Fresh Oasis",
    imageUrl:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
  },

  // --- COMFORT FOOD ---
  {
    id: 11,
    title: "Mac & Cheese Royale",
    description:
      "Classic macaroni in a rich five-cheese sauce with breadcrumbs.",
    price: "13.99",
    category: "comfortFood",
    weight: "500g",
    calories: "920 kcal",
    rating: 4.7,
    reviews: 290,
    restaurant: "Grandma's Kitchen",
    imageUrl:
      "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800&q=80",
  },
  {
    id: 18,
    title: "Homemade Beef Stew",
    description: "Slow-cooked beef with root vegetables and red wine sauce.",
    price: "16.50",
    category: "comfortFood",
    weight: "600g",
    calories: "650 kcal",
    rating: 4.8,
    reviews: 150,
    restaurant: "Grandma's Kitchen",
    imageUrl:
      "https://images.unsplash.com/photo-1678684279246-96e6afb970f2?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 23,
    title: "Creamy Tomato Soup",
    description:
      "Smooth tomato soup served with a buttery grilled cheese sandwich.",
    price: "10.50",
    category: "comfortFood",
    weight: "400ml",
    calories: "400 kcal",
    rating: 4.6,
    reviews: 95,
    restaurant: "Grandma's Kitchen",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1675727579542-ad785e1cee41?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 33,
    title: "Shepherd's Pie",
    description:
      "Minced lamb with peas and carrots, topped with mashed potatoes.",
    price: "15.99",
    category: "comfortFood",
    weight: "550g",
    calories: "720 kcal",
    rating: 4.8,
    reviews: 112,
    restaurant: "Grandma's Kitchen",
    imageUrl:
      "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&q=80",
  },

  // --- BAKERY & SWEETS ---
  {
    id: 8,
    title: "Chocolate Lava Cake",
    description:
      "Warm chocolate cake with a molten center and vanilla ice cream.",
    price: "8.50",
    category: "bakerySweets",
    weight: "200g",
    calories: "550 kcal",
    rating: 4.9,
    reviews: 880,
    restaurant: "Sweet Treats",
    imageUrl:
      "https://images.unsplash.com/photo-1768342068919-1ee67c1053ba?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 19,
    title: "French Croissants",
    description:
      "Buttery, flaky traditional croissants baked fresh every morning.",
    price: "4.99",
    category: "bakerySweets",
    weight: "150g",
    calories: "320 kcal",
    rating: 4.8,
    reviews: 450,
    restaurant: "Sweet Treats",
    imageUrl:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
  },
  {
    id: 20,
    title: "Tiramisu Classic",
    description:
      "Traditional Italian dessert with ladyfingers, espresso and mascarpone.",
    price: "7.99",
    category: "bakerySweets",
    weight: "250g",
    calories: "420 kcal",
    rating: 4.9,
    reviews: 310,
    restaurant: "Sweet Treats",
    imageUrl:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
  },
  {
    id: 34,
    title: "Berry Cheesecake",
    description:
      "Creamy cheesecake topped with fresh strawberries and blueberry sauce.",
    price: "9.50",
    category: "bakerySweets",
    weight: "220g",
    calories: "510 kcal",
    rating: 4.8,
    reviews: 260,
    restaurant: "Sweet Treats",
    imageUrl:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80",
  },

  // --- BEVERAGES ---
  {
    id: 12,
    title: "Classic Mojito",
    description:
      "Refreshing mix of white rum, fresh mint, lime juice, and soda water.",
    price: "9.00",
    category: "beverages",
    weight: "330ml",
    calories: "150 kcal",
    rating: 4.8,
    reviews: 150,
    restaurant: "Liquid Bar",
    imageUrl:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80",
  },
  {
    id: 13,
    title: "Iced Matcha Latte",
    description: "Ceremonial matcha with oat milk and honey over ice.",
    price: "7.50",
    category: "beverages",
    weight: "400ml",
    calories: "120 kcal",
    rating: 4.9,
    reviews: 310,
    restaurant: "Fresh Oasis",
    imageUrl:
      "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=800&q=80",
  },
  {
    id: 21,
    title: "Cold Brew Coffee",
    description:
      "Smooth 12-hour steep cold brew made with organic arabica beans.",
    price: "5.50",
    category: "beverages",
    weight: "350ml",
    calories: "5 kcal",
    rating: 4.7,
    reviews: 420,
    restaurant: "Liquid Bar",
    imageUrl:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&q=80",
  },
  {
    id: 35,
    title: "Fresh Orange Juice",
    description: "100% natural freshly squeezed oranges with zero added sugar.",
    price: "6.00",
    category: "beverages",
    weight: "330ml",
    calories: "140 kcal",
    rating: 4.8,
    reviews: 275,
    restaurant: "Liquid Bar",
    imageUrl:
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];
