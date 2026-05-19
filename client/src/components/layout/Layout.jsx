import { useLocation, matchPath } from "react-router-dom";
import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import { PATH_PAGE } from "./const";
import "./Layout.scss";

const routePatterns = [
  PATH_PAGE.AUTH,
  PATH_PAGE.HOME,
  "/:username",
  PATH_PAGE.CATALOG,
  "/:username/catalog",
  PATH_PAGE.MENU,
  "/:username/menu",
  PATH_PAGE.SPECIALS,
  "/:username/specials",
  PATH_PAGE.DELIVERY,
  "/:username/delivery",
  PATH_PAGE.ABOUT,
  "/:username/about",
];

export function Layout({ children }) {
  const location = useLocation();

  const matchesRoute = (path) =>
    path === location.pathname ||
    !!matchPath({ path, end: true }, location.pathname);

  const shouldRemoveContainer = routePatterns.some(matchesRoute);
  const isAdminPage = !!matchPath(
    { path: PATH_PAGE.ADMIN, end: true },
    location.pathname,
  );
  const showFooter = location.pathname !== PATH_PAGE.AUTH;

  if (isAdminPage) {
    return children;
  }

  return (
    <div className="layout-shell">
      <Header />

      <main
        className={`layout-main ${shouldRemoveContainer ? "" : "layout-container"}`}
      >
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  );
}
