import { useLocation } from "react-router-dom";
import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";

export function Layout({ children }) {
  const location = useLocation();
  // Проверяем, находимся ли мы на странице авторизации
  const isAuthPage = location.pathname === "/auth";

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center">
      <Header />
      
      {/* Если это Auth - даем 100% ширины без паддингов. Если нет - оставляем max-w-6xl и p-8 */}
      <main className={`w-full grow mx-auto ${isAuthPage ? "" : "max-w-6xl p-8"}`}>
        {children}
      </main>

      {/* Показываем Footer ТОЛЬКО если мы НЕ на странице авторизации */}
      {!isAuthPage && <Footer />}
    </div>
  );
}