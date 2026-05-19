import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { Admin } from "./pages/admin/Admin";
import { About } from "./pages/about/About";
import { Auth } from "./pages/auth/Auth";
import { Catalog } from "./pages/catalog/Catalog";
import { Delivery } from "./pages/delivery/Delivery";
import { Home } from "./pages/home/Home";
import { Menu } from "./pages/menu/Menu";
import { Specials } from "./pages/specials/Specials";
import { Restaurant } from "./pages/restaurant/Restaurant";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/catalog", element: <Catalog /> },
  { path: "/menu", element: <Menu /> },
  { path: "/specials", element: <Specials /> },
  { path: "/delivery", element: <Delivery /> },
  { path: "/about", element: <About /> },
  { path: "/restaurant/:id", element: <Restaurant /> },
];

const buildPath = (path) =>
  path === "/" ? "/:username?" : `/:username?${path}`;

function App() {
  return (
    <Router hashType="noslash">
      <Layout>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          {routes.map((route) => (
            <Route
              key={route.path}
              path={buildPath(route.path)}
              element={route.element}
            />
          ))}
          <Route path="/:username/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
