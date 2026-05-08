import { useEffect, useRef, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { headerLinks } from "./consts.js";
import { useDebounce } from "../../hooks/useDebounce";
import { searchRestaurants } from "../../api/restaurantService";
import { searchDishes } from "../../api/dishService";
import searchIcon from "../../assets/search.svg";
import handbagIcon from "../../assets/handbag.svg";
import userIcon from "../../assets/user.svg";

export function Header() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem("user"));
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const debouncedSearchValue = useDebounce(searchValue, 400);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  useEffect(() => {
    const query = debouncedSearchValue.trim();
    if (!query) {
      setResults([]);
      setIsLoading(false);
      return;
    }

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
        route: `/restaurant/${restaurant.id}`,
      }));

      const dishResults = dishes
        .map((dish) => ({
          type: "dish",
          id: dish._id,
          title: dish.name,
          subtitle: dish.restaurantId?.name || "",
          route: dish.restaurantId?.id
            ? `/restaurant/${dish.restaurantId.id}`
            : null,
        }))
        .filter((dish) => dish.route);

      setResults([...restaurantResults, ...dishResults].slice(0, 8));
      setIsLoading(false);
    };

    fetchResults();
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
    <header className="bg-white h-22.5 px-4 lg:px-9.75 flex justify-between items-center w-full shrink-0">
      <div className="flex items-center gap-8 2xl:gap-44.5 shrink-0">
        <div
          className="text-[32px] font-medium text-[#000811] tracking-[0.02em] cursor-pointer"
          onClick={() => navigate("/")}
        >
          Defilicious
        </div>

        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-xl text-[#0F1316] tracking-[-0.04em]">
          {headerLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `px-4 py-2 transition-colors flex items-center justify-center ${link.defaultClasses} ${
                  isActive
                    ? "bg-[#000000] text-[#FFFFFF] border border-[#000000]"
                    : "text-[#0F1316]"
                }`
              }
            >
              {t(`nav.${link.key}`)}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4 xl:gap-6">
        <div ref={searchRef} className="relative hidden xl:block shrink">
          <div className="flex items-center justify-between w-80 2xl:w-113.5 h-13.5 bg-[#EFEFF1] rounded-[100px] px-6">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsOpen(true)}
              placeholder={t("nav.searchPlaceholder")}
              className="w-full bg-transparent text-[16px] xl:text-[18px] text-[#0F1316] placeholder:text-[rgba(15,19,22,0.5)] outline-none tracking-[-0.04em] truncate"
            />
            <img
              src={searchIcon}
              alt="Search"
              className="w-5 h-5 opacity-50 shrink-0 ml-4"
            />
          </div>

          {showDropdown && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-[#E5E7EB] rounded-2xl shadow-lg z-50 max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="px-4 py-3 text-sm text-[#6B7280]">Loading...</div>
              ) : results.length > 0 ? (
                results.map((item) => (
                  <button
                    key={`${item.type}-${item.id}`}
                    type="button"
                    onClick={() => handleSelectResult(item.route)}
                    className="w-full text-left px-4 py-3 hover:bg-[#F3F4F6] transition-colors border-b last:border-b-0 border-[#F3F4F6]"
                  >
                    <div className="text-sm text-[#111827]">{item.title}</div>
                    <div className="text-xs text-[#6B7280]">
                      {item.type === "restaurant"
                        ? t("nav.catalog")
                        : `${t("nav.menu")} - ${item.subtitle}`}
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-[#6B7280]">
                  Nothing found
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button className="w-13.5 h-13.5 bg-[#0D1A2D] rounded-[100px] flex items-center justify-center text-white hover:bg-gray-800 transition-colors shrink-0">
            <img src={handbagIcon} alt="Shop" className="w-6 h-6" />
          </button>

          <button
            onClick={user ? handleLogout : () => navigate("/auth")}
            className="w-13.5 h-13.5 bg-[#0D1A2D] rounded-[100px] flex items-center justify-center text-white hover:bg-gray-800 transition-colors shrink-0"
            title={
              user ? `${t("nav.logout")} (${user.username})` : t("nav.login")
            }
          >
            <img
              src={userIcon}
              alt={user ? t("nav.logout") : t("nav.login")}
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
