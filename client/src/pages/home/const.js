import smileIcon from "../../assets/smile.svg";
import clockIcon from "../../assets/clock.svg";
import starIcon from "../../assets/star.svg";
import maskIcon from "../../assets/mask.svg";
import headphonesIcon from "../../assets/headphones.svg";
import mapIcon from "../../assets/map.svg";
import ratingIcon from "../../assets/rating.svg";
import locationIcon from "../../assets/location.svg";
import arrowLeftIcon from "../../assets/chevron-left.svg";
import arrowRightIcon from "../../assets/chevron-right.svg";

export const statsData = [
  {
    icon: smileIcon,
    value: "50k+",
    label: "Happy Foodies",
    key: "happyFoodies",
  },
  {
    icon: clockIcon,
    value: "< 30 Min",
    label: "Average Delivery Time",
    key: "averageDeliveryTime",
  },
  {
    icon: starIcon,
    value: "150+",
    label: "Top-Rated Restaurants",
    key: "topRatedRestaurants",
  },
];

const highlightCardsList = [
  {
    icon: maskIcon,
    title: "Handpicked Selection",
    description:
      "We partner only with the best local kitchens and highly-rated chefs to guarantee a premium and delicious experience every time.",
  },
  {
    icon: mapIcon,
    title: "Real-Time Tracking",
    description:
      "Track your order from the kitchen straight to your door. Fast, seamless, and perfectly tailored to your cravings.",
  },
  {
    icon: headphonesIcon,
    title: "24/7 Customer Support",
    description:
      "Hungry at 2 AM? We’ve got you covered. Our support team is always online to resolve any issues and ensure your food arrives hot.",
  },
];

const restaurantItems = [
  {
    id: "1",
    badge: "Free Delivery",
    image: "/img/card-1.png",
    title: "The Burger Joint",
    category: "American • Fast Food",
    rating: "4.8 (1.2k)",
    location: "Downtown District",
  },
  {
    id: "2",
    badge: "20-30 min",
    image: "/img/card-2.png",
    title: "Kyoto Sushi & Wok",
    category: "Japanese • Asian",
    rating: "4.9 (950k)",
    location: "Westside Boulevard",
  },
  {
    id: "3",
    badge: "15-20 min",
    image: "/img/card-3.png",
    title: "Fresh Poke Bowls",
    category: "Healthy • Vegan",
    rating: "4.7 (430)",
    location: "Green Park Area",
  },
  {
    id: "4",
    badge: "-20% Today",
    image: "/img/card-4.png",
    title: "Luigi's Woodfire",
    category: "Italian • Fast Pizza",
    rating: "4.6 (2.1k)",
    location: "Little Italy",
  },
  {
    id: "5",
    badge: "Fast Delivery",
    image: "/img/card-5.png",
    title: "Dragon's Fire Grill",
    category: "Chinese • Asian",
    rating: "4.7 (1.8k)",
    location: "East Side Market",
  },
  {
    id: "6",
    badge: "15-25 min",
    image: "/img/card-6.png",
    title: "La Bella Pasta",
    category: "Italian • Authentic",
    rating: "4.9 (2.3k)",
    location: "Historic District",
  },
  {
    id: "7",
    badge: "-15% Today",
    image: "/img/card-7.png",
    title: "Spice Route Curry",
    category: "Indian • Vegetarian",
    rating: "4.8 (890)",
    location: "Cultural Quarter",
  },
  {
    id: "8",
    badge: "Free Delivery",
    image: "/img/card-8.png",
    title: "Seoul Kitchen",
    category: "Korean • BBQ",
    rating: "4.8 (1.5k)",
    location: "Food Street",
  },
];

export const heroData = {
  titleLines: ["Explore Remarkable Restaurants Today", "All In Once Place"],
  description: [
    "Join the ultimate dining experience - where taste meets convenience. Your next",
    "culinary adventure is just a click away.",
  ],

  actionLabel: "Start your own culinary journey",
  backgroundImage: "/img/backgroundImage.png",
  socialLinks: ["Instagram", "Facebook", "Tik Tok"],
  noteLines: ["Highly rated by local foodies.", "Get real results."],
};

export const highlightCards = {
  sectionData: {
    headingLines: [
      "Why Thousands of Foodies Choose",
      "Defilicious Every Single Day",
    ],
    description:
      "From local hidden gems to top-rated restaurants, we make ordering your favorite meals fast, fresh, and hassle-free. Discover new flavors with seamless delivery and round-the-clock support.",
  },

  statsData,
  cards: highlightCardsList,
};

export const restaurantCards = {
  title: "Popular Restaurants",
  description:
    "Discover top-rated local favorites and trending hotspots handpicked for your next meal.",
  restaurants: restaurantItems,
  isLoading: false,
  loadingMessage: "Loading restaurants...",
  emptyMessage: "No restaurants found.",
};

export const trendingSection = {
  sectionData: {
    heading: "Trending Near You",
    description:
      "From cozy local cafes to premium dining spots, discover the best places to satisfy your cravings right now.",
    buttonLabel: "View all restaurants",

    pagination: {
      previousIcon: arrowLeftIcon,
      nextIcon: arrowRightIcon,
    },
  },

  cards: restaurantItems,

  cardMeta: {
    ratingIcon,
    locationIcon,
  },
};
