import { useLocation } from "react-router-dom";
import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";

export function Layout({ children }) {
  const location = useLocation();

  // Проверяем страницы, на которых контент должен быть во всю ширину без ограничений контейнера
  const isAuthPage = location.pathname === "/auth";
  const isHomePage = location.pathname === "/";
  const isMenuPage = location.pathname === "/menu";

  const shouldRemoveContainer = isAuthPage || isHomePage || isMenuPage;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center">
      <Header />

      <main
        className={`w-full grow mx-auto flex flex-col items-center ${
          shouldRemoveContainer ? "" : "max-w-6xl p-8"
        }`}
      >
        {children}
      </main>

      {/* Показываем Footer ТОЛЬКО если мы НЕ на странице авторизации */}
      {!isAuthPage && <Footer />}
    </div>
  );
}