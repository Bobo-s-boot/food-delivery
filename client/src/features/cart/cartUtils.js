const DELIVERY_FEE = 2.99;

const PREVIEW_ITEMS = [
  {
    id: "preview-burger",
    name: "Signature Truffle Burger",
    description: "Black Angus beef, cheddar, smoked bacon, and truffle mayo.",
    price: 14.99,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
    restaurant: "Kyo's Grill",
    category: "Fast Food",
    weight: "750g",
    quantity: 1,
  },
  {
    id: "preview-sushi",
    name: "Kyoto Sushi Set",
    description: "Salmon, tuna, avocado rolls, and spicy mayo.",
    price: 29.99,
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80",
    restaurant: "Oasis Sushi",
    category: "Asian",
    weight: "800g",
    quantity: 1,
  },
  {
    id: "preview-bowl",
    name: "Green Bowl Oasis",
    description: "Quinoa, greens, edamame, avocado, and vinaigrette.",
    price: 15.99,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
    restaurant: "Fresh Oasis",
    category: "Healthy",
    weight: "450g",
    quantity: 1,
  },
  {
    id: "preview-pizza",
    name: "Pizza Amiza",
    description: "Italian pizza with pepperoni, basil, and mozzarella.",
    price: 17.99,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80",
    restaurant: "Luigi's Woodfire",
    category: "European",
    weight: "900g",
    quantity: 1,
  },
  {
    id: "preview-ramen",
    name: "Spicy Ramen",
    description: "Rich pork broth, soft boiled egg, and spicy garlic oil.",
    price: 16,
    image:
      "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=500&q=80",
    restaurant: "Tokyo Ramen",
    category: "Asian",
    weight: "600g",
    quantity: 1,
  },
  {
    id: "preview-dessert",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center and vanilla cream.",
    price: 8.5,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80",
    restaurant: "Sweet Treats",
    category: "Dessert",
    weight: "200g",
    quantity: 1,
  },
  {
    id: "preview-matcha",
    name: "Iced Matcha Latte",
    description: "Ceremonial matcha, oat milk, honey, and ice.",
    price: 7.5,
    image:
      "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=500&q=80",
    restaurant: "Fresh Oasis",
    category: "Beverages",
    weight: "400ml",
    quantity: 1,
  },
];

const toCartId = (item) => String(item.id ?? item._id ?? item.title ?? item.name);

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const money = (value) => Math.round(value * 100) / 100;

export const normalizeCartItem = (item) => ({
  id: toCartId(item),
  name: item.name ?? item.title ?? "Menu item",
  description: item.description ?? "",
  price: toNumber(item.price),
  image: item.image ?? item.imageUrl ?? "/img/burger.jpg",
  restaurant: item.restaurant ?? item.restaurantId?.name ?? "Defilicious",
  category: item.category ?? "Special",
  weight: item.weight ?? "",
  quantity: item.quantity ?? 1,
});

export const addCartItem = (items, item) => {
  const nextItem = normalizeCartItem(item);
  const exists = items.some((cartItem) => cartItem.id === nextItem.id);

  if (!exists) {
    return [...items, nextItem];
  }

  return items.map((cartItem) =>
    cartItem.id === nextItem.id
      ? { ...cartItem, quantity: cartItem.quantity + 1 }
      : cartItem,
  );
};

export const decreaseCartItem = (items, id) =>
  items
    .map((item) =>
      item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
    )
    .filter((item) => item.quantity > 0);

export const removeCartItem = (items, id) =>
  items.filter((item) => item.id !== id);

export const calculateCartTotals = (items) => {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = money(
    items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );
  const deliveryFee = itemCount > 0 ? DELIVERY_FEE : 0;

  return {
    itemCount,
    subtotal,
    deliveryFee,
    total: money(subtotal + deliveryFee),
  };
};

export const getPreviewCartItems = () =>
  PREVIEW_ITEMS.map((item) => normalizeCartItem(item));
