import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { Layout } from "./components/Layout/Layout";
import { Admin } from "./pages/admin/Admin";
import { About } from "./pages/about/About";
import { Auth } from "./pages/auth/Auth";
import { Catalog } from "./pages/catalog/Catalog";
import { Checkout } from "./pages/checkout/Checkout";
import { Delivery } from "./pages/delivery/Delivery";
import { Dish } from "./pages/dish/Dish";
import { Home } from "./pages/home/Home";
import { Menu } from "./pages/menu/Menu";
import { Specials } from "./pages/specials/Specials";
import { Restaurant } from "./pages/restaurant/Restaurant";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/specials" element={<Specials />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/dish/:id" element={<Dish />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/about" element={<About />} />
          <Route path="/restaurant/:id" element={<Restaurant />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
