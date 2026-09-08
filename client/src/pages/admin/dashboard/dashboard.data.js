export const dashboardMetrics = [
  {
    label: "Today's Orders",
    value: "128",
    trend: "+12% vs yesterday",
  },
  {
    label: "Revenue Today",
    value: "$2,430",
    trend: "+8% today",
  },
  {
    label: "Active Orders",
    value: "18",
    trend: "needs monitoring",
    tone: "warning",
  },
  {
    label: "Average Delivery Time",
    value: "24 min",
    trend: "within target",
  },
  {
    label: "Open Issues",
    value: "7",
    trend: "needs attention",
    tone: "warning",
  },
];

export const orderOverviewData = [
  { day: "Mon", orders: 84 },
  { day: "Tue", orders: 96 },
  { day: "Wed", orders: 72 },
  { day: "Thu", orders: 118 },
  { day: "Fri", orders: 142 },
  { day: "Sat", orders: 136 },
  { day: "Sun", orders: 128 },
];

export const revenueSnapshotData = [
  { label: "Today", value: "$2,430", progress: 88 },
  { label: "Average order value", value: "$18.90", progress: 68 },
  { label: "Refunds", value: "$120", progress: 18 },
  { label: "Best revenue hour", value: "7 PM", progress: 76 },
];

export const peakHoursData = [
  { time: "10 AM", orders: 24 },
  { time: "11 AM", orders: 72 },
  { time: "12 AM", orders: 46 },
  { time: "2 PM", orders: 28 },
  { time: "3 PM", orders: 49 },
  { time: "5 PM", orders: 6 },
  { time: "6 PM", orders: 1 },
  { time: "7 PM", orders: 56 },
  { time: "8 PM", orders: 26 },
  { time: "10 PM", orders: 32 },
  { time: "11 PM", orders: 32 },
  { time: "12 PM", orders: 62 },
  { time: "2 AM", orders: 80 },
];

export const liveOrders = [
  {
    id: "#1048",
    customer: "Alex Morgan",
    restaurant: "Burger House",
    status: "Preparing",
    total: "$24.50",
    time: "10:42 AM",
  },
  {
    id: "#1047",
    customer: "Emma Carter",
    restaurant: "Pizza Nova",
    status: "On the way",
    total: "$31.20",
    time: "10:39 AM",
  },
  {
    id: "#1046",
    customer: "David Kim",
    restaurant: "The Burger Lab",
    status: "New",
    total: "$18.90",
    time: "10:34 AM",
  },
  {
    id: "#1045",
    customer: "Sofia Brown",
    restaurant: "Sushi Corner",
    status: "Delivered",
    total: "$42.10",
    time: "10:21 AM",
  },
  {
    id: "#1044",
    customer: "Chris Evans",
    restaurant: "Pasta Point",
    status: "Problem",
    total: "$27.80",
    time: "10:14 AM",
  },
  {
    id: "#1043",
    customer: "Mia Wilson",
    restaurant: "Taco Street",
    status: "Preparing",
    total: "$16.40",
    time: "10:08 AM",
  },
];

export const topRestaurantsToday = [
  { name: "Burger House", orders: "42 orders", revenue: "$820" },
  { name: "The Burger Lab", orders: "36 orders", revenue: "$690" },
  { name: "Pizza Nova", orders: "31 orders", revenue: "$540" },
  { name: "Sushi Corner", orders: "24 orders", revenue: "$410" },
];

export const activeDeliveries = [
  {
    courier: "Mark King",
    status: "On the way",
    order: "Order #1047",
    area: "Burger House",
    eta: "12 min",
    action: "Track",
  },
  {
    courier: "Chris Evans",
    status: "Picking up",
    order: "Order #1044",
    area: "Pasta Point",
    eta: "8 min",
    action: "Track",
  },
  {
    courier: "Daniel Lee",
    status: "On the way",
    order: "Order #1039",
    area: "Pizza Nova",
    eta: "21 min",
    action: "Track",
  },
  {
    courier: "Alex Carter",
    status: "Near customer",
    order: "Order #1038",
    area: "Sushi Corner",
    eta: "15 min",
    action: "Track",
  },
];

export const issueCenterItems = [
  {
    title: "Pending Refunds",
    text: "2 requests are waiting for review.",
    action: "Review",
  },
  {
    title: "Late Deliveries",
    text: "5 orders are running behind target ETA.",
    action: "Review",
  },
  {
    title: "Payment Issues",
    text: "1 case needs payment confirmation.",
    action: "Review",
  },
  {
    title: "Inactive Restaurants",
    text: "3 restaurants need availability checks.",
    action: "Review",
  },
];

export const topSellingDishes = [
  {
    name: "Classic Cheeseburger",
    restaurant: "Burger House",
    orders: "45 orders",
    revenue: "$520",
  },
  {
    name: "Signature Truffle Burger",
    restaurant: "The Burger Lab",
    orders: "32 orders",
    revenue: "$390",
  },
  {
    name: "Double Cheese BBQ",
    restaurant: "Burger House",
    orders: "28 orders",
    revenue: "$350",
  },
  {
    name: "Spicy Chicken Wrap",
    restaurant: "Taco Street",
    orders: "24 orders",
    revenue: "$280",
  },
  {
    name: "Caesar Hot Dog",
    restaurant: "Quick Bites",
    orders: "18 orders",
    revenue: "$190",
  },
];
