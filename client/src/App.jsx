import {
  Navigate,
  Route,
  HashRouter as Router,
  Routes,
} from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { Admin } from "./pages/admin/Admin";
import { adminRouteConfig } from "./pages/admin/admin.routes";
import { Account } from "./pages/account/Account";
import { About } from "./pages/about/About";
import { Auth } from "./pages/auth/Auth";
import { Catalog } from "./pages/catalog/Catalog";
import { Checkout } from "./pages/checkout/Checkout";
import { Delivery } from "./pages/delivery/Delivery";
import { Dish } from "./pages/dish/Dish";
import { Home } from "./pages/home/Home";
import { Menu } from "./pages/menu/Menu";
import { PrivacyPolicy } from "./pages/privacy/PrivacyPolicy";
import { Specials } from "./pages/specials/Specials";
import { Restaurant } from "./pages/restaurant/Restaurant";
import { SupportProvider } from "./features/support/SupportProvider";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/catalog", element: <Catalog /> },
  { path: "/menu", element: <Menu /> },
  { path: "/specials", element: <Specials /> },
  { path: "/delivery", element: <Delivery /> },
  { path: "/about", element: <About /> },
  { path: "/profile", element: <Account /> },
  { path: "/restaurant/:id", element: <Restaurant /> },
  { path: "/dish/:id", element: <Dish /> },
  { path: "/checkout", element: <Checkout /> },
  { path: "/privacy-policy", element: <PrivacyPolicy /> },
];

const buildPath = (path) =>
  path === "/" ? "/:username?" : `/:username?${path}`;

function App() {
  return (
    <Router hashType="noslash">
      <SupportProvider>
        <Layout>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/admin/*" element={<Navigate to="/auth" replace />} />

            {adminRouteConfig.map(({ routeKey, path, section }) => (
              <Route
                key={routeKey}
                path={path}
                element={<Admin section={section} />}
              />
            ))}

            {routes.map((route) => (
              <Route
                key={route.path}
                path={buildPath(route.path)}
                element={route.element}
              />
            ))}

          </Routes>
        </Layout>
      </SupportProvider>
    </Router>
  );
}

export default App;
