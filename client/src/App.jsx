import "./App.css";
import { RestaurantList } from "./components/cardListRestaurant/RestaurantList";
import { Footer } from "./components/footer/Footer";
import { Header } from "./components/header/Header";
import { restaurants } from "./data/data";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Header />

      <RestaurantList items={restaurants} />

      <Footer />
    </div>
  );
}

export default App;
