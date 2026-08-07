const adminSectionRoutes = [
  {
    section: "dashboard",
    relativePath: "",
    navLabel: "Dashboard",
  },
  {
    section: "orders",
    relativePath: "orders",
    navLabel: "Orders",
  },
  {
    section: "restaurants",
    relativePath: "restaurants/*",
    navPath: "restaurants",
    navLabel: "Restaurants",
  },
  {
    section: "dishes",
    relativePath: "dishes",
  },
  {
    section: "users",
    relativePath: "users",
    navLabel: "Users",
  },
  {
    section: "finance",
    relativePath: "finance",
    navLabel: "Finance",
  },
  {
    section: "finance",
    relativePath: "discounts",
    aliasFor: "finance",
  },
  {
    section: "support",
    relativePath: "support",
    navLabel: "Support",
  },
];

const joinAdminPath = (basePath, relativePath) =>
  relativePath ? `${basePath}/${relativePath}` : basePath;

export const adminRouteConfig = [
  ...["/admin", "/:username/admin"].flatMap((basePath) =>
    adminSectionRoutes.map((route) => ({
      ...route,
      path: joinAdminPath(basePath, route.relativePath),
      routeKey: `${basePath}:${route.relativePath || "dashboard"}`,
    })),
  ),
];

export const adminLayoutRoutePatterns = [
  "/admin/*",
  "/:username/admin/*",
];

export const adminNavPaths = Object.fromEntries(
  adminSectionRoutes
    .filter((route) => route.navLabel)
    .map((route) => [
      route.navLabel,
      route.navPath ?? route.relativePath,
    ]),
);

export const adminNavSections = Object.fromEntries(
  adminSectionRoutes
    .filter((route) => route.navLabel)
    .map((route) => [route.navLabel, route.section]),
);

export const adminNavItems = Object.keys(adminNavPaths);

export const getAdminBasePath = (pathname = "") => {
  const usernameRoute = pathname.match(/^\/([^/]+)\/admin(?:\/|$)/);
  return usernameRoute ? `/${usernameRoute[1]}/admin` : "/admin";
};

export const buildAdminNavPath = ({
  label,
  pathname,
  username,
}) => {
  const relativePath = adminNavPaths[label];
  if (relativePath === undefined) return null;

  const basePath = pathname
    ? getAdminBasePath(pathname)
    : username
      ? `/${username}/admin`
      : "/admin";

  return joinAdminPath(basePath, relativePath);
};
