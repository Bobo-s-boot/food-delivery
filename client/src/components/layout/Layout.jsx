import { useLocation, matchPath } from "react-router-dom";
import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import { PATH_PAGE } from "./const";

export function Layout({ children }) {
  const location = useLocation();

  const isAuthPage = location.pathname === PATH_PAGE.AUTH;
  const isHomePage =
    location.pathname === PATH_PAGE.HOME ||
    !!matchPath({ path: "/:username", end: true }, location.pathname);
  const isCatalogPage =
    location.pathname === PATH_PAGE.CATALOG ||
    !!matchPath({ path: "/:username/catalog", end: true }, location.pathname);
  const isMenuPage =
    location.pathname === PATH_PAGE.MENU ||
    !!matchPath({ path: "/:username/menu", end: true }, location.pathname);
  const isSpecialsPage =
    location.pathname === PATH_PAGE.SPECIALS ||
    !!matchPath({ path: "/:username/specials", end: true }, location.pathname);
  const isDeliveryPage =
    location.pathname === PATH_PAGE.DELIVERY ||
    !!matchPath({ path: "/:username/delivery", end: true }, location.pathname);
  const isAdminPage = !!matchPath(
    { path: PATH_PAGE.ADMIN, end: true },
    location.pathname,
  );
  const isAboutPage =
    location.pathname === PATH_PAGE.ABOUT ||
    !!matchPath({ path: "/:username/about", end: true }, location.pathname);

  const shouldRemoveContainer =
    isAuthPage ||
    isHomePage ||
    isCatalogPage ||
    isMenuPage ||
    isSpecialsPage ||
    isDeliveryPage ||
    isAboutPage;

  if (isAdminPage) {
    return children;
  }

  const showFooter = !isAuthPage;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center w-full">
      <Header />

      <main
        className={`w-full grow mx-auto flex flex-col items-center ${
          shouldRemoveContainer ? "" : "max-w-6xl p-8"
        }`}
      >
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  );
}
