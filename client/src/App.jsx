import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { getRestauranst } from "./api/restaurantService";
import "./App.css";
import { Layout } from "./components/Layout/Layout";
import { About } from "./pages/about/About";
import { Catalog } from "./pages/catalog/Catalog";
import { Home } from "./pages/home/Home";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home items={getRestauranst} />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
