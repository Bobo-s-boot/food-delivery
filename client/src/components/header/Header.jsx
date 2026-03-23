import { useNavigate } from "react-router-dom";
import cartIcon from "../../assets/cart.svg";
import LogIn from "../../assets/log-in.svg";
import { HeaderIcons } from "./HeaderIcons";
import { HeaderLink } from "./HeaderLink";

export function Header() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <header className="w-full max-w-6xl mx-auto mb-8 flex justify-between items-center align-items-baseline">
      <div
        className="text-3xl font-bold text-green-600 cursor-pointer"
        onClick={() => navigate("/")}
      >
        FoodExpress
      </div>

      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <HeaderLink to="/catalog">Каталог</HeaderLink>
              <HeaderLink to="/about">Про нас</HeaderLink>
              <HeaderLink to="#">Контакти</HeaderLink>

              <HeaderIcons href={cartIcon} alt="Кошик" width={32} height={32} />

              <span className="text-green-600 text-xl font-normal">
                Hello, {user.username}!
              </span>
              <HeaderIcons
                href={LogIn}
                alt="Exit"
                width={32}
                height={32}
                onClick={() => handleLogout()}
              />
            </div>
          </div>
        ) : (
          <HeaderIcons
            href={LogIn}
            alt="Entry"
            width={32}
            height={32}
            onClick={() => navigate("/auth")}
          />
        )}
      </div>
    </header>
  );
}
