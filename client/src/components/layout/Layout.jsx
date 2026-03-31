import { useLocation } from "react-router-dom";
import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";

export function Layout({ children }) {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";
  const isHomePage = location.pathname === "/";

  const shouldRemoveContainer = isAuthPage || isHomePage;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center w-full">
      <Header />

      <main
        className={`w-full grow mx-auto ${shouldRemoveContainer ? "" : "max-w-6xl p-8"}`}
      >
        {children}
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
}
