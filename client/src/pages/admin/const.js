export const adminNavItems = [
  "Dashboard",
  "Orders",
  "Restaurants",
  "Menu",
  "Specials",
  "Delivery",
  "Users",
  "Analytics",
  "Settings",
];

export const createActions = [
  "New restaurant",
  "New promotion",
  "New menu item",
  "Manual order",
];

export const kpiCards = [
  {
    label: "Today's Orders",
    value: "128",
    trend: "+12% from yesterday",
  },
  {
    label: "Revenue",
    value: "$4,280",
    trend: "+8% this week",
  },
  {
    label: "Active Restaurants",
    value: "42",
    trend: "5 new this month",
  },
  {
    label: "Average Delivery Time",
    value: "27 min",
    trend: "-3 min improvement",
  },
  {
    label: "Pending Issues",
    value: "6",
    trend: "Needs attention",
    tone: "warning",
  },
];

export const orderAnalytics = [
  { day: "Mon", orders: 84 },
  { day: "Tue", orders: 96 },
  { day: "Wed", orders: 112 },
  { day: "Thu", orders: 104 },
  { day: "Fri", orders: 128 },
  { day: "Sat", orders: 156 },
  { day: "Sun", orders: 142 },
];

export const revenueBreakdown = [
  { label: "Restaurants", value: 68 },
  { label: "Delivery Fees", value: 18 },
  { label: "Promotions", value: 9 },
  { label: "Service Fees", value: 5 },
];

export const peakHours = [
  { time: "10:00", orders: 18 },
  { time: "12:00", orders: 42 },
  { time: "14:00", orders: 35 },
  { time: "18:00", orders: 64 },
  { time: "20:00", orders: 78 },
  { time: "22:00", orders: 51 },
];

export const orderFilters = [
  "All",
  "New",
  "Preparing",
  "Ready",
  "On the way",
  "Delivered",
  "Cancelled",
];

export const liveOrders = [
  {
    id: "#DF-1048",
    customer: "Emma Wilson",
    restaurant: "Kyoto Sushi & Wok",
    status: "Preparing",
    payment: "Paid",
    courier: "Alex Carter",
    total: "$34.99",
    time: "12 min ago",
  },
  {
    id: "#DF-1049",
    customer: "Mark Brown",
    restaurant: "The Burger Joint",
    status: "On the way",
    payment: "Paid",
    courier: "Daniel Lee",
    total: "$21.50",
    time: "18 min ago",
  },
  {
    id: "#DF-1050",
    customer: "Sofia Adams",
    restaurant: "Green Bowl Oasis",
    status: "New",
    payment: "Cash",
    courier: "Not assigned",
    total: "$16.90",
    time: "3 min ago",
  },
  {
    id: "#DF-1051",
    customer: "Liam Scott",
    restaurant: "Luigi's Woodfire",
    status: "Ready",
    payment: "Paid",
    courier: "Maria King",
    total: "$29.99",
    time: "22 min ago",
  },
  {
    id: "#DF-1052",
    customer: "Olivia Brown",
    restaurant: "Tikka Masala House",
    status: "Preparing",
    payment: "Paid",
    courier: "Not assigned",
    total: "$41.20",
    time: "9 min ago",
  },
  {
    id: "#DF-1053",
    customer: "Noah Miller",
    restaurant: "Bakery & Sweets",
    status: "Delivered",
    payment: "Paid",
    courier: "Chris Evans",
    total: "$18.40",
    time: "45 min ago",
  },
];

export const restaurantStatus = [
  {
    name: "The Burger Joint",
    status: "Open",
    orders: "32 orders today",
    prep: "Avg prep time: 18 min",
    rating: "4.8",
    action: "View",
  },
  {
    name: "Kyoto Sushi & Wok",
    status: "Busy",
    orders: "26 orders today",
    prep: "Avg prep time: 24 min",
    rating: "4.9",
    action: "View",
  },
  {
    name: "Luigi's Woodfire",
    status: "Paused",
    orders: "12 orders today",
    prep: "Avg prep time: 31 min",
    rating: "High kitchen load",
    action: "Resume",
  },
  {
    name: "Green Bowl Oasis",
    status: "Open",
    orders: "19 orders today",
    prep: "Avg prep time: 16 min",
    rating: "4.7",
    action: "View",
  },
];

export const menuAvailability = [
  {
    item: "Signature Truffle Burger",
    restaurant: "The Burger Joint",
    category: "Fast Food",
    price: "$14.99",
    status: "Available",
    action: "Add to stop-list",
  },
  {
    item: "Kyoto Sushi Set",
    restaurant: "Kyoto Sushi & Wok",
    category: "Asian",
    price: "$29.99",
    status: "Available",
    action: "Add to stop-list",
  },
  {
    item: "Green Bowl Oasis",
    restaurant: "Fresh Poke Bowls",
    category: "Healthy",
    price: "$19.99",
    status: "Low stock",
    action: "Review",
  },
  {
    item: "Margherita Pizza",
    restaurant: "Luigi's Woodfire",
    category: "Italian",
    price: "$15.99",
    status: "Stop-listed",
    action: "Restore",
  },
  {
    item: "Chocolate Cookie Box",
    restaurant: "Bakery & Sweets",
    category: "Dessert",
    price: "$11.50",
    status: "Available",
    action: "Add to stop-list",
  },
];

export const activeSpecials = [
  {
    promotion: "Free Delivery Weekend",
    type: "Delivery",
    restaurant: "Selected restaurants",
    discount: "100% delivery fee",
    status: "Active",
    validUntil: "Sunday",
  },
  {
    promotion: "Student Lunch Combo",
    type: "Student Deal",
    restaurant: "Green Bowl Oasis",
    discount: "15% off",
    status: "Active",
    validUntil: "Apr 30",
  },
  {
    promotion: "Pizza Night Special",
    type: "Limited Time",
    restaurant: "Luigi's Woodfire",
    discount: "50% second pizza",
    status: "Scheduled",
    validUntil: "Friday",
  },
  {
    promotion: "Sushi Set Discount",
    type: "Discount",
    restaurant: "Kyoto Sushi & Wok",
    discount: "20% off",
    status: "Active",
    validUntil: "Today",
  },
  {
    promotion: "Family Dinner Set",
    type: "Combo",
    restaurant: "Tikka Masala House",
    discount: "Fixed price",
    status: "Draft",
    validUntil: "May 05",
  },
];

export const courierActivity = [
  {
    courier: "Alex Carter",
    status: "On delivery",
    order: "#DF-1048",
    area: "Downtown District",
    eta: "8 min",
    action: "Track",
  },
  {
    courier: "Maria King",
    status: "Waiting pickup",
    order: "#DF-1051",
    area: "Little Italy",
    eta: "12 min",
    action: "Track",
  },
  {
    courier: "Daniel Lee",
    status: "Available",
    order: "-",
    area: "Westside Boulevard",
    eta: "-",
    action: "Assign",
  },
  {
    courier: "Chris Evans",
    status: "On delivery",
    order: "#DF-1053",
    area: "Green Park Area",
    eta: "5 min",
    action: "Track",
  },
  {
    courier: "Anna White",
    status: "Offline",
    order: "-",
    area: "-",
    eta: "-",
    action: "View",
  },
];

export const issues = [
  {
    title: "Delayed order",
    text: "Order #DF-1049 is 12 minutes behind estimated delivery time.",
    action: "Review",
  },
  {
    title: "Restaurant paused",
    text: "Luigi's Woodfire paused new orders due to high kitchen load.",
    action: "Check restaurant",
  },
  {
    title: "Payment issue",
    text: "Order #DF-1057 failed card payment confirmation.",
    action: "Resolve",
  },
  {
    title: "Low stock item",
    text: "Green Bowl Oasis marked avocado bowls as low stock.",
    action: "Review menu",
  },
];

export const topDishes = [
  {
    name: "Signature Truffle Burger",
    orders: "48 orders",
    revenue: "$719.52",
  },
  {
    name: "Kyoto Sushi Set",
    orders: "36 orders",
    revenue: "$1,079.64",
  },
  {
    name: "Green Bowl Oasis",
    orders: "29 orders",
    revenue: "$579.71",
  },
  {
    name: "Margherita Pizza",
    orders: "24 orders",
    revenue: "$383.76",
  },
  {
    name: "Chocolate Cookie Box",
    orders: "21 orders",
    revenue: "$241.50",
  },
];
