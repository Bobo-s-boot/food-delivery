export const ordersMockData = [
  {
    id: "#1048",
    customer: {
      name: "Alex Carter",
      email: "alex.carter@email.com",
      phone: "+1 555 0182",
    },
    restaurant: {
      name: "Burger House",
      prepTime: "25-35 min",
    },
    status: "Preparing",
    issue: null,
    payment: {
      status: "Paid",
      subtotal: 24.5,
      deliveryFee: 2.5,
      discount: 2.5,
      total: 24.5,
    },
    courier: {
      name: "Not assigned",
      eta: "24 min",
    },
    delivery: {
      address: "24 King Street",
      eta: "24 min",
    },
    placed: "10:42 AM",
    items: [
      { name: "Classic Cheeseburger", quantity: 2, price: 18 },
      { name: "Fries", quantity: 1, price: 4.5 },
      { name: "Coke", quantity: 1, price: 2 },
    ],
    timeline: [
      { time: "10:34 AM", label: "Order placed" },
      { time: "10:35 AM", label: "Payment confirmed" },
      { time: "10:37 AM", label: "Restaurant accepted" },
      { time: "10:42 AM", label: "Preparing" },
    ],
  },
  {
    id: "#1047",
    customer: {
      name: "Emma Brown",
      email: "emma.brown@email.com",
      phone: "+1 555 0179",
    },
    restaurant: {
      name: "Pizza Nova",
      prepTime: "20-30 min",
    },
    status: "On the way",
    issue: null,
    payment: {
      status: "Paid",
      subtotal: 28.7,
      deliveryFee: 2.5,
      discount: 0,
      total: 31.2,
    },
    courier: {
      name: "Mark King",
      eta: "12 min",
    },
    delivery: {
      address: "118 Pine Avenue",
      eta: "12 min",
    },
    placed: "10:39 AM",
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 18.2 },
      { name: "Fries", quantity: 1, price: 4.5 },
      { name: "Coke", quantity: 2, price: 6 },
    ],
    timeline: [
      { time: "10:22 AM", label: "Order placed" },
      { time: "10:23 AM", label: "Payment confirmed" },
      { time: "10:28 AM", label: "Restaurant accepted" },
      { time: "10:34 AM", label: "Courier assigned" },
      { time: "10:39 AM", label: "Picked up" },
    ],
  },
  {
    id: "#1046",
    customer: {
      name: "David Kim",
      email: "david.kim@email.com",
      phone: "+1 555 0165",
    },
    restaurant: {
      name: "The Burger Lab",
      prepTime: "20-25 min",
    },
    status: "New",
    issue: null,
    payment: {
      status: "Pending",
      subtotal: 16.4,
      deliveryFee: 2.5,
      discount: 0,
      total: 18.9,
    },
    courier: {
      name: "Not assigned",
      eta: "Pending acceptance",
    },
    delivery: {
      address: "42 Market Lane",
      eta: "Pending acceptance",
    },
    placed: "10:34 AM",
    items: [
      { name: "Signature Truffle Burger", quantity: 1, price: 14.4 },
      { name: "Coke", quantity: 1, price: 2 },
    ],
    timeline: [{ time: "10:34 AM", label: "Order placed" }],
  },
  {
    id: "#1045",
    customer: {
      name: "Sofia Miller",
      email: "sofia.miller@email.com",
      phone: "+1 555 0154",
    },
    restaurant: {
      name: "Sushi Corner",
      prepTime: "30-40 min",
    },
    status: "Delivered",
    issue: null,
    payment: {
      status: "Paid",
      subtotal: 39.6,
      deliveryFee: 2.5,
      discount: 0,
      total: 42.1,
    },
    courier: {
      name: "Daniel Lee",
      eta: "Delivered",
    },
    delivery: {
      address: "9 Harbor Road",
      eta: "Delivered",
    },
    placed: "10:21 AM",
    items: [
      { name: "Salmon Roll", quantity: 2, price: 27.6 },
      { name: "Chicken Pasta", quantity: 1, price: 12 },
    ],
    timeline: [
      { time: "9:47 AM", label: "Order placed" },
      { time: "9:48 AM", label: "Payment confirmed" },
      { time: "9:52 AM", label: "Restaurant accepted" },
      { time: "10:11 AM", label: "Picked up" },
      { time: "10:21 AM", label: "Delivered" },
    ],
  },
  {
    id: "#1044",
    customer: {
      name: "Mia Wilson",
      email: "mia.wilson@email.com",
      phone: "+1 555 0143",
    },
    restaurant: {
      name: "Pasta Point",
      prepTime: "25-35 min",
    },
    status: "On the way",
    issue: "Late delivery",
    payment: {
      status: "Paid",
      subtotal: 25.3,
      deliveryFee: 2.5,
      discount: 0,
      total: 27.8,
    },
    courier: {
      name: "Alex Carter",
      eta: "18 min late",
    },
    delivery: {
      address: "75 Maple Street",
      eta: "18 min late",
    },
    placed: "10:14 AM",
    items: [
      { name: "Chicken Pasta", quantity: 1, price: 17.8 },
      { name: "Caesar Hot Dog", quantity: 1, price: 7.5 },
    ],
    timeline: [
      { time: "9:38 AM", label: "Order placed" },
      { time: "9:39 AM", label: "Payment confirmed" },
      { time: "9:44 AM", label: "Restaurant accepted" },
      { time: "10:02 AM", label: "Picked up" },
      { time: "10:14 AM", label: "Late delivery flagged" },
    ],
  },
  {
    id: "#1043",
    customer: {
      name: "Olivia Stone",
      email: "olivia.stone@email.com",
      phone: "+1 555 0138",
    },
    restaurant: {
      name: "Taco Street",
      prepTime: "15-25 min",
    },
    status: "Preparing",
    issue: "Missing item",
    payment: {
      status: "Paid",
      subtotal: 13.9,
      deliveryFee: 2.5,
      discount: 0,
      total: 16.4,
    },
    courier: {
      name: "Not assigned",
      eta: "18 min",
    },
    delivery: {
      address: "31 Sunset Court",
      eta: "18 min",
    },
    placed: "10:08 AM",
    items: [
      { name: "Spicy Chicken Wrap", quantity: 1, price: 9.4 },
      { name: "Fries", quantity: 1, price: 4.5 },
    ],
    timeline: [
      { time: "9:58 AM", label: "Order placed" },
      { time: "9:59 AM", label: "Payment confirmed" },
      { time: "10:02 AM", label: "Restaurant accepted" },
      { time: "10:08 AM", label: "Missing item flagged" },
    ],
  },
  {
    id: "#1042",
    customer: {
      name: "Noah Clark",
      email: "noah.clark@email.com",
      phone: "+1 555 0126",
    },
    restaurant: {
      name: "Quick Bites",
      prepTime: "10-20 min",
    },
    status: "Cancelled",
    issue: "Payment issue",
    payment: {
      status: "Failed",
      subtotal: 10.4,
      deliveryFee: 2.5,
      discount: 0,
      total: 12.9,
    },
    courier: {
      name: "-",
      eta: "-",
    },
    delivery: {
      address: "64 Oak Drive",
      eta: "-",
    },
    placed: "9:58 AM",
    items: [{ name: "Caesar Hot Dog", quantity: 1, price: 10.4 }],
    timeline: [
      { time: "9:58 AM", label: "Order placed" },
      { time: "9:59 AM", label: "Payment failed" },
      { time: "10:01 AM", label: "Cancelled" },
    ],
  },
  {
    id: "#1041",
    customer: {
      name: "Lily Adams",
      email: "lily.adams@email.com",
      phone: "+1 555 0117",
    },
    restaurant: {
      name: "Green Bowl",
      prepTime: "20-30 min",
    },
    status: "Delivered",
    issue: "Refund requested",
    payment: {
      status: "Refunded",
      subtotal: 19.8,
      deliveryFee: 2.5,
      discount: 0,
      total: 22.3,
    },
    courier: {
      name: "Chris Evans",
      eta: "Delivered",
    },
    delivery: {
      address: "17 Garden Walk",
      eta: "Delivered",
    },
    placed: "9:43 AM",
    items: [
      { name: "Chicken Pasta", quantity: 1, price: 12.3 },
      { name: "Fries", quantity: 1, price: 4.5 },
      { name: "Coke", quantity: 1, price: 3 },
    ],
    timeline: [
      { time: "9:04 AM", label: "Order placed" },
      { time: "9:05 AM", label: "Payment confirmed" },
      { time: "9:12 AM", label: "Courier assigned" },
      { time: "9:43 AM", label: "Delivered" },
      { time: "10:05 AM", label: "Refund requested" },
    ],
  },
  {
    id: "#1040",
    customer: {
      name: "Daniel Lee",
      email: "daniel.lee@email.com",
      phone: "+1 555 0108",
    },
    restaurant: {
      name: "Burger House",
      prepTime: "25-35 min",
    },
    status: "New",
    issue: null,
    payment: {
      status: "Pending",
      subtotal: 17.3,
      deliveryFee: 2.5,
      discount: 0,
      total: 19.8,
    },
    courier: {
      name: "Not assigned",
      eta: "Pending acceptance",
    },
    delivery: {
      address: "205 Cedar Street",
      eta: "Pending acceptance",
    },
    placed: "9:31 AM",
    items: [
      { name: "Double Cheese BBQ", quantity: 1, price: 15.3 },
      { name: "Coke", quantity: 1, price: 2 },
    ],
    timeline: [{ time: "9:31 AM", label: "Order placed" }],
  },
  {
    id: "#1039",
    customer: {
      name: "Mark King",
      email: "mark.king@email.com",
      phone: "+1 555 0102",
    },
    restaurant: {
      name: "Sushi Corner",
      prepTime: "30-40 min",
    },
    status: "Delivered",
    issue: null,
    payment: {
      status: "Paid",
      subtotal: 34.2,
      deliveryFee: 2.5,
      discount: 0,
      total: 36.7,
    },
    courier: {
      name: "Olivia Stone",
      eta: "Delivered",
    },
    delivery: {
      address: "88 River Lane",
      eta: "Delivered",
    },
    placed: "9:16 AM",
    items: [
      { name: "Salmon Roll", quantity: 2, price: 24.2 },
      { name: "Coke", quantity: 2, price: 6 },
      { name: "Fries", quantity: 1, price: 4 },
    ],
    timeline: [
      { time: "8:42 AM", label: "Order placed" },
      { time: "8:43 AM", label: "Payment confirmed" },
      { time: "8:51 AM", label: "Restaurant accepted" },
      { time: "9:02 AM", label: "Picked up" },
      { time: "9:16 AM", label: "Delivered" },
    ],
  },
];
