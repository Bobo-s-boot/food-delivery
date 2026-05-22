import { useLocation, matchPath } from "react-router-dom";
import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import { PATH_PAGE } from "./const";
import { CartDrawer } from "../../features/cart/CartDrawer";
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
  PATH_PAGE.CHECKOUT,
  "/:username/checkout",
];

export function Layout({ children }) {
  const location = useLocation();

  const matchesRoute = (path) =>
    path === location.pathname ||
    !!matchPath({ path, end: true }, location.pathname);

  // Оставляем твою логику для страницы блюда (так как там динамический ID в конце)
  const isDishPage = location.pathname.startsWith(PATH_PAGE.DISH);

  // Объединяем проверки из master и твои изменения
  const shouldRemoveContainer = routePatterns.some(matchesRoute) || isDishPage;

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

      {/* Footer не показывается на странице авторизации (логика из master) */}
      {showFooter && <Footer />}

      {/* Твоя корзина */}
      <CartDrawer />
    </div>
  );
}
