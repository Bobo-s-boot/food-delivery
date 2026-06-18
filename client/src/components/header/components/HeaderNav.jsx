import { headerLinks } from "../consts";
import { useLocation, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "../../../hooks/useCurrentUser";

export function HeaderNav() {
  const location = useLocation();
  const { t } = useTranslation();
  const { userBasePath } = useCurrentUser();

  return (
    <nav className="header__nav">
      {headerLinks.map((link) => {
        const linkPath = userBasePath ? `${userBasePath}${link.to}` : link.to;
        return (
          <NavLink
            key={link.to}
            to={linkPath}
            end={link.to === "/"}
            className={({ isActive }) => {
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
  );
}
