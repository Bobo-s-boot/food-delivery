import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { RestaurantList } from "./components/cardListRestaurant/RestaurantList";
import { Layout } from "./components/Layout/Layout";
import { restaurants } from "./data/data";
import { About } from "./pages/about/About";
import { Catalog } from "./pages/catalog/Catalog";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<RestaurantList items={restaurants} />} />
          <Route path="/catalog" Component={Catalog} />
          <Route path="/about" Component={About} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
