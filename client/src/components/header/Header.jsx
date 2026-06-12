import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { headerLinks } from "./consts.js";
import { useDebounce } from "../../hooks/useDebounce";
import { searchRestaurants } from "../../api/restaurantService";
import { searchDishes } from "../../api/dishService";
import { useCart } from "../../features/cart/useCart";
import searchIcon from "../../assets/search.svg";
import handbagIcon from "../../assets/handbag.svg";
import userIcon from "../../assets/user.svg";
import "./Header.scss";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { openCart, totals } = useCart();
  const user = JSON.parse(localStorage.getItem("user"));
  const userBasePath = user?.username
    ? `/${encodeURIComponent(user.username)}`
    : "";
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const debouncedSearchValue = useDebounce(searchValue, 400);

  const handleProfileClick = () => {
    navigate(user ? `${userBasePath}/my-account` : "/auth");
  };

  useEffect(() => {
    const query = debouncedSearchValue.trim();
    if (!query) return;

    const fetchResults = async () => {
      setIsLoading(true);
      const [restaurants, dishes] = await Promise.all([
        searchRestaurants(query, 5),
        searchDishes(query, 5),
      ]);

      const restaurantResults = restaurants.map((restaurant) => ({
        type: "restaurant",
        id: restaurant.id,
        title: restaurant.name,
        subtitle: restaurant.category,
        route: `${userBasePath}/restaurant/${restaurant.id}`,
      }));

      const dishResults = dishes
        .map((dish) => ({
          type: "dish",
          id: dish._id,
          title: dish.name,
          subtitle: dish.restaurantId?.name || "",
          route: dish.restaurantId?.id
            ? `${userBasePath}/restaurant/${dish.restaurantId.id}`
            : null,
        }))
        .filter((dish) => dish.route);

      setResults([...restaurantResults, ...dishResults].slice(0, 8));
      setIsLoading(false);
    };

    fetchResults();
  }, [debouncedSearchValue, userBasePath]);

  useEffect(() => {
    if (!debouncedSearchValue.trim()) {
      Promise.resolve().then(() => {
        setResults([]);
        setIsLoading(false);
      });
    }
  }, [debouncedSearchValue]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!searchRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectResult = (route) => {
    if (!route) {
      return;
    }
    navigate(route);
    setSearchValue("");
    setResults([]);
    setIsOpen(false);
  };

  const showDropdown = isOpen && searchValue.trim().length > 0;

  return (
    <header className="header">
      <div className="header__start">
        <div
          className="header__brand"
          onClick={() => navigate(userBasePath || "/")}
        >
          Defilicious
        </div>

        <nav className="header__nav">
          {headerLinks.map((link) => {
            const linkPath = userBasePath
              ? `${userBasePath}${link.to}`
              : link.to;
            return (
              <NavLink
                key={link.to}
                to={linkPath}
                end={link.to === "/"}
                className={({ isActive }) => {
                  // Сохраняем твою логику активности для блюд
                  const isCatalogDishActive =
                    link.to === "/catalog" &&
                    location.pathname.startsWith("/dish/");

                  return `header__nav-link ${
                    isActive || isCatalogDishActive
                      ? "header__nav-link--active"
                      : "header__nav-link--idle"
                  }`;
                }}
              >
                {t(`nav.${link.key}`)}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="header__actions">
        <div ref={searchRef} className="header__search">
          <div className="header__search-box">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsOpen(true)}
              placeholder={t("nav.searchPlaceholder")}
              className="header__search-input"
            />
            <img
              src={searchIcon}
              alt="Search"
              className="header__search-icon"
            />
          </div>

          {showDropdown && (
            <div className="header__dropdown">
              {isLoading ? (
                <div className="header__dropdown-empty">Loading...</div>
              ) : results.length > 0 ? (
                results.map((item) => (
                  <button
                    key={`${item.type}-${item.id}`}
                    type="button"
                    onClick={() => handleSelectResult(item.route)}
                    className="header__dropdown-item"
                  >
                    <div className="header__dropdown-title">{item.title}</div>
                    <div className="header__dropdown-subtitle">
                      {item.type === "restaurant"
                        ? t("nav.catalog")
                        : `${t("nav.menu")} - ${item.subtitle}`}
                    </div>
                  </button>
                ))
              ) : (
                <div className="header__dropdown-empty">Nothing found</div>
              )}
            </div>
          )}
        </div>

        <div className="header__buttons">
          <button
            type="button"
            onClick={openCart}
            className="header__ghost-button"
            aria-label="Open cart"
          >
            <img src={handbagIcon} alt="Shop" className="header__icon" />
            {/* Сохраняем твой бейджик корзины */}
            {totals.itemCount > 0 && (
              <span className="header__cart-badge">
                {totals.itemCount}
              </span>
            )}
          </button>

          <button
            onClick={handleProfileClick}
            className="header__ghost-button"
            title={user ? "My Account" : t("nav.login")}
          >
            <img
              src={userIcon}
              alt={user ? "My Account" : t("nav.login")}
              className="header__icon"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
