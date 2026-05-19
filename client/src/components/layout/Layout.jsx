import { useLocation } from "react-router-dom";
import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import { PATH_PAGE } from "./const";
import { CartDrawer } from "../../features/cart/CartDrawer";

export function Layout({ children }) {
  const location = useLocation();

  const isAuthPage = location.pathname === PATH_PAGE.AUTH;
  const isHomePage = location.pathname === PATH_PAGE.HOME;
  const isCatalogPage = location.pathname === PATH_PAGE.CATALOG;
  const isMenuPage = location.pathname === PATH_PAGE.MENU;
  const isSpecialsPage = location.pathname === PATH_PAGE.SPECIALS;
  const isDeliveryPage = location.pathname === PATH_PAGE.DELIVERY;
  const isCheckoutPage = location.pathname === PATH_PAGE.CHECKOUT;
  const isDishPage = location.pathname.startsWith(PATH_PAGE.DISH);
  const isAdminPage = location.pathname === PATH_PAGE.ADMIN;
  const isAboutPage = location.pathname === PATH_PAGE.ABOUT;

  const shouldRemoveContainer =
    isAuthPage ||
    isHomePage ||
    isCatalogPage ||
    isMenuPage ||
    isSpecialsPage ||
    isDeliveryPage ||
    isCheckoutPage ||
    isDishPage ||
    isAboutPage;

  if (isAdminPage) {
    return children;
  }

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

      <Footer />
      <CartDrawer />
    </div>
  );
}
