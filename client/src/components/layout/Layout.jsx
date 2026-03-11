import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <Header />
      <main className="w-full max-w-6xl grow mx-auto">{children}</main>
      <Footer />
    </div>
  );
}
