import { useLocation } from "react-router-dom";
import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";

export function Layout({ children }) {
  const location = useLocation();

  // Проверяем страницы, на которых контент должен быть во всю ширину
  const isAuthPage = location.pathname === "/auth";
  const isHomePage = location.pathname === "/";
  const isCatalogPage = location.pathname === "/catalog";
  // ДОБАВЛЕНО: Проверка для твоей страницы меню
  const isMenuPage = location.pathname === "/menu"; 

  const shouldRemoveContainer = isAuthPage || isHomePage || isCatalogPage || isMenuPage;

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

      {!isAuthPage && <Footer />}
    </div>
  );
}