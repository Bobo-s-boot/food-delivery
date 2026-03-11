import { Link } from "react-router-dom";
import cartIcon from "../../assets/cart.svg";
import LogIn from "../../assets/log-in.svg";
import { HeaderIcons } from "./HeaderIcons";
import { HeaderLink } from "./HeaderLink";

export function Header() {
  return (
    <header className="w-full max-w-6xl mx-auto mb-8 flex justify-between items-center align-items-baseline">
      <h1 className="text-3xl font-bold text-green-600 cursor-pointer">
        <Link to="/">FoodExpress</Link>
      </h1>

      <div className="flex items-center gap-4">
        <HeaderLink to="/catalog">Каталог</HeaderLink>
        <HeaderLink to="/about">Про нас</HeaderLink>
        <HeaderLink to="#">Контакти</HeaderLink>

        <HeaderIcons href={cartIcon} alt="Кошик" width={32} height={32} />
        <HeaderIcons href={LogIn} alt="Увійти" width={32} height={32} />
      </div>
    </header>
  );
}
