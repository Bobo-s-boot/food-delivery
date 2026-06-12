import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { Admin } from "./pages/admin/Admin";
import { Account } from "./pages/account/Account";
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

// Добавляем твои новые роуты Checkout и Dish в общий массив
const routes = [
  { path: "/", element: <Home /> },
  { path: "/catalog", element: <Catalog /> },
  { path: "/menu", element: <Menu /> },
  { path: "/specials", element: <Specials /> },
  { path: "/delivery", element: <Delivery /> },
  { path: "/about", element: <About /> },
  { path: "/my-account", element: <Account /> },
  { path: "/restaurant/:id", element: <Restaurant /> },
  { path: "/dish/:id", element: <Dish /> },
  { path: "/checkout", element: <Checkout /> },
];

const buildPath = (path) =>
  path === "/" ? "/:username?" : `/:username?${path}`;

function App() {
  return (
    <Router hashType="noslash">
      <Layout>
        <Routes>
          <Route path="/auth" element={<Auth />} />

          {/* Маппим все роуты с поддержкой :username из master */}
          {routes.map((route) => (
            <Route
              key={route.path}
              path={buildPath(route.path)}
              element={route.element}
            />
          ))}

          {/* Сохраняем доступ к админке и по обычному пути, и с username */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/:username/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
