import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { RestaurantList } from "./components/cardListRestaurant/RestaurantList";
import { Footer } from "./components/footer/Footer";
import { Header } from "./components/header/Header";
import { restaurants } from "./data/data";
import { About } from "./pages/about/About"; // Створимо цей файл нижче

function App() {
  return (
    <Router>
      <>
        <Header />

        <Routes>
          <Route path="/" element={<RestaurantList items={restaurants} />} />
          <Route
            path="/catalog"
            element={<RestaurantList items={restaurants} />}
          />

          <Route path="/about" Component={About} />
        </Routes>

        <Footer />
      </>
    </Router>
  );
}

export default App;
