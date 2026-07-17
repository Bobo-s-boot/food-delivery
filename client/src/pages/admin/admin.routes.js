const adminSectionRoutes = [
  {
    section: "dashboard",
    relativePath: "",
    navLabel: "Dashboard",
    preview: true,
    protected: true,
  },
  {
    section: "orders",
    relativePath: "orders",
    navLabel: "Orders",
    preview: true,
    protected: true,
  },
  {
    section: "restaurants",
    relativePath: "restaurants/*",
    navPath: "restaurants",
    navLabel: "Restaurants",
    preview: true,
    protected: true,
  },
  {
    section: "dishes",
    relativePath: "dishes",
    preview: false,
    protected: true,
  },
  {
    section: "users",
    relativePath: "users",
    navLabel: "Users",
    preview: true,
    protected: true,
  },
  {
    section: "finance",
    relativePath: "finance",
    navLabel: "Finance",
    preview: true,
    protected: true,
  },
  {
    section: "finance",
    relativePath: "discounts",
    preview: true,
    protected: true,
    aliasFor: "finance",
  },
  {
    section: "support",
    relativePath: "support",
    navLabel: "Support",
    preview: true,
    protected: true,
  },
];

const joinAdminPath = (basePath, relativePath) =>
  relativePath ? `${basePath}/${relativePath}` : basePath;

export const adminRouteConfig = [
  ...adminSectionRoutes
    .filter((route) => route.preview)
    .map((route) => ({
      ...route,
      path: joinAdminPath("/auth/admin", route.relativePath),
      previewMode: true,
      routeKey: `preview:${route.relativePath || "dashboard"}`,
    })),
  ...["/admin", "/:username/admin"].flatMap((basePath) =>
    adminSectionRoutes
      .filter((route) => route.protected)
      .map((route) => ({
        ...route,
        path: joinAdminPath(basePath, route.relativePath),
        previewMode: false,
        routeKey: `${basePath}:${route.relativePath || "dashboard"}`,
      })),
  ),
];

export const adminLayoutRoutePatterns = [
  "/auth/admin/*",
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
  if (pathname === "/auth/admin" || pathname.startsWith("/auth/admin/")) {
    return "/auth/admin";
  }

  const usernameRoute = pathname.match(/^\/([^/]+)\/admin(?:\/|$)/);
  return usernameRoute ? `/${usernameRoute[1]}/admin` : "/admin";
};

export const buildAdminNavPath = ({
  label,
  pathname,
  previewMode,
  username,
}) => {
  const relativePath = adminNavPaths[label];
  if (relativePath === undefined) return null;

  const basePath = pathname
    ? getAdminBasePath(pathname)
    : previewMode
      ? "/auth/admin"
      : username
        ? `/${username}/admin`
        : "/admin";

  return joinAdminPath(basePath, relativePath);
};
