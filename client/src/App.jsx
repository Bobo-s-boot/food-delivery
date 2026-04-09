import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { Layout } from "./components/Layout/Layout";
import { About } from "./pages/about/About";
import { Auth } from "./pages/auth/Auth";
import { Catalog } from "./pages/catalog/Catalog";
import { Home } from "./pages/home/Home";
import { Menu } from "./Menu";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
