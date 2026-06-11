export const checkoutSteps = [
  {
    id: "contact",
    eyebrow: "Step 01",
    title: "Contact details",
    summary: "Who should we contact about this order?",
  },
  {
    id: "delivery",
    eyebrow: "Step 02",
    title: "Delivery",
    summary: "Choose address, timing, and handoff preferences.",
  },
  {
    id: "details",
    eyebrow: "Step 03",
    title: "For courier and kitchen",
    summary: "Add notes, cutlery, and contact preferences.",
  },
  {
    id: "payment",
    eyebrow: "Step 04",
    title: "Payment",
    summary: "Pick a payment method before placing the order.",
  },
];

export const deliveryOptions = [
  {
    id: "pickup",
    title: "Pick up yourself",
    description: "Collect the order from the restaurant when it is ready.",
    meta: "Free",
  },
  {
    id: "standard",
    title: "Standard delivery",
    description: "Balanced delivery time with regular courier routing.",
    meta: "$2.99 · 35-45 min",
  },
  {
    id: "priority",
    title: "Fast delivery",
    description: "The fastest courier match for hot dishes.",
    meta: "$4.99 · 20-30 min",
  },
];

export const paymentOptions = [
  "Credit / Debit Card",
  "Apple Pay",
  "Cash to courier",
];
