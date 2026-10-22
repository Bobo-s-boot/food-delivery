import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDebounce } from "../../hooks/useDebounce";
import { searchRestaurants } from "../../api/restaurantService";
import { searchDishes } from "../../api/dishService";
import { useCart } from "../../features/cart/useCart";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { HeaderNav } from "./components/HeaderNav.jsx";
import { HeaderSearchBox } from "./components/HeaderSearchBox.jsx";
import { HeaderSearchDropdown } from "./components/HeaderSearchDropdown.jsx";
import { HeaderButtons } from "./components/HeaderButtons.jsx";
import { HeaderLanguageSwitcher } from "./components/HeaderLanguageSwitcher.jsx";
import { Search, X } from "lucide-react";
import "./Header.scss";

export function Header() {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const { openCart, totals } = useCart();
  const { user, userBasePath, logout } = useCurrentUser();

  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchToggleRef = useRef(null);
  const debouncedSearchValue = useDebounce(searchValue, 400);

  const handleLogout = () => {
    logout();
    navigate("/auth");
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
        setIsSearchExpanded(false);
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
    setIsSearchExpanded(false);
  };

  const showDropdown = isOpen && searchValue.trim().length > 0;

  return (
    <header className="header header--with-language">
      <div className="header__start">
        <div
          className="header__brand"
          onClick={() => navigate(userBasePath || "/")}
        >
          Defilicious
        </div>
        <HeaderNav />
      </div>

      <div className="header__actions">
        <div ref={searchRef} className={`header__search${isSearchExpanded ? " header__search--expanded" : ""}`}
          onKeyDown={(event) => {
            if (event.key === "Escape" && isSearchExpanded) {
              setIsSearchExpanded(false);
              setIsOpen(false);
              searchToggleRef.current?.focus();
            }
          }}>
          <button ref={searchToggleRef} type="button" className="header__search-toggle"
            aria-label={t("nav.searchPlaceholder")} aria-expanded={isSearchExpanded} aria-controls="header-search-panel"
            onClick={() => {
              setIsSearchExpanded((expanded) => !expanded);
              if (!isSearchExpanded) requestAnimationFrame(() => searchInputRef.current?.focus());
              else setIsOpen(false);
            }}>
            {isSearchExpanded ? <X size={20} aria-hidden="true" /> : <Search size={20} aria-hidden="true" />}
          </button>
          <div className="header__search-panel" id="header-search-panel">
          <HeaderSearchBox
            inputRef={searchInputRef}
            value={searchValue}
            onChange={setSearchValue}
            onFocus={() => setIsOpen(true)}
            placeholder={t("nav.searchPlaceholder")}
          />

          {showDropdown && (
            <HeaderSearchDropdown
              results={results}
              isLoading={isLoading}
              onSelect={handleSelectResult}
              translate={t}
            />
          )}
          </div>
        </div>

        <HeaderLanguageSwitcher />

        <HeaderButtons
          totals={totals}
          openCart={openCart}
          user={user}
          onLogin={() => navigate("/auth")}
          onLogout={handleLogout}
          translate={t}
        />
      </div>
    </header>
  );
}
