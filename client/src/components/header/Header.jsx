import { useNavigate, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { headerLinks } from "./consts.js";
import searchIcon from "../../assets/search.svg";
import handbagIcon from "../../assets/handbag.svg";
import userIcon from "../../assets/user.svg";

export function Header() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

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
        <div className="relative hidden xl:flex items-center justify-between w-80 2xl:w-113.5 h-13.5 bg-[#EFEFF1] rounded-[100px] px-6 shrink">
          <input
            type="text"
            placeholder={t("nav.searchPlaceholder")}
            className="w-full bg-transparent text-[16px] xl:text-[18px] text-[#0F1316] placeholder:text-[rgba(15,19,22,0.5)] outline-none tracking-[-0.04em] truncate"
          />
          <img
            src={searchIcon}
            alt="Search"
            className="w-5 h-5 opacity-50 shrink-0 ml-4"
          />
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
