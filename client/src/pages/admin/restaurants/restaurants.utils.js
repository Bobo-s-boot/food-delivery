const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const includesSearch = (values, searchValue) => {
  const normalizedSearch = normalize(searchValue);
  return !normalizedSearch || values.some((value) => normalize(value).includes(normalizedSearch));
};

export const parseRestaurantRouteTail = (tail) => {
  const segments = String(tail || "").split("/").filter(Boolean);
  return {
    restaurantId: segments[0] || null,
    menuItemId: segments[1] === "menu" ? segments[2] || null : null,
  };
};

const partnershipByLegacyStatus = {
  Active: "Approved",
  Paused: "Approved",
  Pending: "Pending approval",
  Rejected: "Rejected",
  Suspended: "Suspended",
  Archived: "Archived",
};

const availabilityByLegacyStatus = {
  Active: "Accepting orders",
  Paused: "Temporarily paused",
  Pending: "Offline",
  Rejected: "Offline",
  Suspended: "Offline",
  Archived: "Offline",
};

const menuHealthByRestaurant = {
  "burger-house": { activeItems: 24, unavailableItems: 2, missingImages: 0 },
  "pizza-nova": { activeItems: 18, unavailableItems: 1, missingImages: 0 },
  "the-burger-lab": { activeItems: 21, unavailableItems: 12, missingImages: 1 },
  "sushi-corner": { activeItems: 32, unavailableItems: 4, missingImages: 0 },
  "green-bowl": { activeItems: 0, unavailableItems: 0, missingImages: 2 },
  "taco-street": { activeItems: 16, unavailableItems: 1, missingImages: 0 },
  "quick-bites": { activeItems: 14, unavailableItems: 3, missingImages: 3 },
  "pasta-point": { activeItems: 0, unavailableItems: 0, missingImages: 1 },
};

const restaurantCategoryByItem = {
  "classic-cheeseburger": "Signature Burgers",
  "signature-truffle-burger": "Lab Signatures",
  "double-cheese-bbq": "Signature Burgers",
  fries: "Sides",
  coke: "Drinks",
  "margherita-pizza": "Classic Pizzas",
  "salmon-roll": "Chef Rolls",
  "chicken-pasta": "House Pasta",
  "spicy-chicken-wrap": "Street Favorites",
  "green-bowl-salad": "Popular Bowls",
};

export const getRestaurantInitials = (name) =>
  String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

export const enrichRestaurant = (restaurant) => {
  const health = menuHealthByRestaurant[restaurant.id] || {
    activeItems: restaurant.menuItems || 0,
    unavailableItems: 0,
    missingImages: 0,
  };

  return {
    ...restaurant,
    partnershipStatus:
      restaurant.partnershipStatus || partnershipByLegacyStatus[restaurant.status] || "Approved",
    operationalAvailability:
      restaurant.operationalAvailability || availabilityByLegacyStatus[restaurant.status] || "Offline",
    issueStatus:
      restaurant.issueStatus ||
      (restaurant.issue === "Low availability" ? "Low item availability" : restaurant.issue) ||
      "No active issues",
    ...health,
    revenueToday: restaurant.revenueToday || restaurant.ordersToday * 24.6,
  };
};

export const enrichMenuItem = (item, restaurants = []) => {
  const restaurant = restaurants.find(
    (entry) => entry.id === item.restaurantId || entry.name === item.restaurant,
  );
  const restaurantId = item.restaurantId || restaurant?.id || normalize(item.restaurant).replace(/[^a-z0-9]+/g, "-");
  const platformCategory = item.platformCategory || item.category || "Uncategorized";
  const restaurantCategory =
    item.restaurantCategory ||
    restaurantCategoryByItem[item.id] ||
    item.category ||
    "Uncategorized";
  const contentHealth = item.contentHealth || (!item.image ? "Missing image" : "Complete");
  const customerVisibility =
    item.customerVisibility ||
    (item.availability === "Available" && restaurant?.operationalAvailability === "Accepting orders"
      ? "Visible"
      : "Hidden");

  return {
    ...item,
    restaurantId,
    platformCategory,
    restaurantCategory,
    contentHealth,
    customerVisibility,
    promotion: item.promotion || item.discount || "No active promotion",
    restaurantAvailability: restaurant?.operationalAvailability || "Offline",
  };
};

export const filterRestaurants = (
  restaurants,
  {
    searchValue = "",
    categoryFilter,
    cuisineFilter,
    partnershipFilter = "All partnership statuses",
    availabilityFilter = "All availability states",
    issueFilter = "All issue states",
    statusFilter,
  } = {},
) =>
  restaurants.map(enrichRestaurant).filter((restaurant) => {
    const selectedCuisine = categoryFilter ?? cuisineFilter ?? "All cuisines";
    const matchesSearch = includesSearch(
      [restaurant.name, restaurant.cuisine, restaurant.location],
      searchValue,
    );
    const matchesCuisine =
      ["All categories", "All cuisines"].includes(selectedCuisine) ||
      restaurant.cuisine === selectedCuisine;
    const matchesPartnership =
      partnershipFilter === "All partnership statuses" ||
      restaurant.partnershipStatus === partnershipFilter;
    const matchesAvailability =
      availabilityFilter === "All availability states" ||
      restaurant.operationalAvailability === availabilityFilter;
    const matchesIssue =
      issueFilter === "All issue states" ||
      (issueFilter === "Needs attention"
        ? restaurant.issueStatus !== "No active issues"
        : restaurant.issueStatus === issueFilter);

    const legacyMatches =
      !statusFilter ||
      statusFilter === "All" ||
      (statusFilter === "Issues" && restaurant.issueStatus !== "No active issues") ||
      (statusFilter === "Active" && restaurant.operationalAvailability === "Accepting orders") ||
      (statusFilter === "Pending" && restaurant.partnershipStatus === "Pending approval") ||
      (statusFilter === "Paused" && restaurant.operationalAvailability === "Temporarily paused") ||
      restaurant.partnershipStatus === statusFilter;

    return (
      matchesSearch &&
      matchesCuisine &&
      matchesPartnership &&
      matchesAvailability &&
      matchesIssue &&
      legacyMatches
    );
  });

export const filterMenuItems = (
  menuItems,
  {
    searchValue = "",
    restaurantFilter = "All restaurants",
    categoryFilter,
    platformCategoryFilter,
    restaurantCategoryFilter = "All restaurant categories",
    availabilityFilter = "All availability states",
    visibilityFilter = "All customer visibility",
    promotionFilter = "All promotion states",
    contentIssueFilter = "All content states",
  } = {},
  restaurants = [],
) => {
  const selectedPlatformCategory =
    platformCategoryFilter ?? categoryFilter ?? "All platform categories";

  return menuItems.map((item) => enrichMenuItem(item, restaurants)).filter((item) => {
    const matchesSearch = includesSearch(
      [item.name, item.restaurant, item.platformCategory, item.restaurantCategory],
      searchValue,
    );
    const matchesRestaurant =
      restaurantFilter === "All restaurants" || item.restaurant === restaurantFilter;
    const matchesPlatformCategory =
      ["All categories", "All platform categories"].includes(selectedPlatformCategory) ||
      item.platformCategory === selectedPlatformCategory;
    const matchesRestaurantCategory =
      restaurantCategoryFilter === "All restaurant categories" ||
      item.restaurantCategory === restaurantCategoryFilter;
    const matchesAvailability =
      ["All", "All availability states"].includes(availabilityFilter) ||
      (availabilityFilter === "Discounted"
        ? item.promotion !== "No active promotion"
        : availabilityFilter === "Missing Images"
          ? item.contentHealth === "Missing image"
          : availabilityFilter === "Content issues"
            ? item.contentHealth !== "Complete"
            : item.availability === availabilityFilter);
    const matchesVisibility =
      visibilityFilter === "All customer visibility" ||
      item.customerVisibility === visibilityFilter;
    const matchesPromotion =
      promotionFilter === "All promotion states" ||
      (promotionFilter === "Active promotion"
        ? item.promotion !== "No active promotion"
        : item.promotion === "No active promotion");
    const matchesContent =
      contentIssueFilter === "All content states" ||
      (contentIssueFilter === "Content issues"
        ? item.contentHealth !== "Complete"
        : item.contentHealth === contentIssueFilter);

    return (
      matchesSearch &&
      matchesRestaurant &&
      matchesPlatformCategory &&
      matchesRestaurantCategory &&
      matchesAvailability &&
      matchesVisibility &&
      matchesPromotion &&
      matchesContent
    );
  });
};

export const getRestaurantPreviewMeta = (restaurantInput) => {
  const restaurant = enrichRestaurant(restaurantInput || {});
  const draftOnly = ["Pending approval", "Rejected"].includes(restaurant.partnershipStatus);
  const seriousIssue = [
    "Missing documents",
    "Low item availability",
    "Many cancellations",
    "Missing menu images",
    "Payment issue",
  ].includes(
    restaurant.issueStatus,
  );

  return {
    menuItemsLabel: draftOnly
      ? `${restaurant.menuItems ?? 0} setup items`
      : `${restaurant.activeItems} active · ${restaurant.unavailableItems} unavailable`,
    actionLabel:
      restaurant.partnershipStatus === "Pending approval"
        ? "Review"
        : ["Rejected", "Archived"].includes(restaurant.partnershipStatus)
          ? "Details"
          : seriousIssue
            ? "Resolve"
            : "Open",
  };
};

const restaurantIssuePriority = [
  "Payment issue",
  "Many cancellations",
  "Missing documents",
  "Low item availability",
  "Missing menu images",
];

export const getRestaurantPrimaryIssue = (restaurantInput) => {
  const restaurant = enrichRestaurant(restaurantInput || {});
  const issues = Array.isArray(restaurantInput?.issues)
    ? restaurantInput.issues
        .map((issue) => (typeof issue === "string" ? issue : issue?.type))
        .filter(Boolean)
    : [];

  if (restaurant.issueStatus !== "No active issues") {
    issues.push(restaurant.issueStatus);
  }

  return (
    restaurantIssuePriority.find((issue) => issues.includes(issue)) ||
    issues[0] ||
    null
  );
};

export const getRestaurantGridActionLabel = (restaurantInput) => {
  const restaurant = enrichRestaurant(restaurantInput || {});

  if (["Rejected", "Archived"].includes(restaurant.partnershipStatus)) {
    return "View details";
  }

  if (restaurant.partnershipStatus === "Pending approval") {
    return "Review application";
  }

  return getRestaurantPrimaryIssue(restaurant) ? "Review issue" : "Open restaurant";
};

export const getRestaurantAvailabilityLabel = (restaurant) =>
  enrichRestaurant(restaurant || {}).operationalAvailability;

export const getMenuItemAvailabilityLabel = (item) =>
  item?.availability === "Sold out"
    ? "Sold out"
    : item?.availability === "Unavailable"
      ? "Unavailable"
      : "Available";

export const getMenuItemIssueBadges = (item) => {
  const health = item?.contentHealth || (!item?.image ? "Missing image" : "Complete");
  return health === "Complete" ? [] : [health];
};

export const paginateItems = (items, page = 1, pageSize = 10) => {
  const safeSize = Math.max(1, Number(pageSize) || 10);
  const totalPages = Math.max(1, Math.ceil(items.length / safeSize));
  const safePage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const start = (safePage - 1) * safeSize;

  return {
    items: items.slice(start, start + safeSize),
    page: safePage,
    pageSize: safeSize,
    totalPages,
    totalItems: items.length,
    start: items.length ? start + 1 : 0,
    end: Math.min(start + safeSize, items.length),
  };
};
