import { motion, useReducedMotion } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  adminNavPaths,
  adminNavSections,
  buildAdminNavPath,
} from "../admin.routes";
import "../Admin.scss";

export function AdminHeader({ navItems, activeSection }) {
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavItemClick = (item) => {
    const path = buildAdminNavPath({
      label: item,
      pathname: location.pathname,
    });
    if (!path) return;
    navigate(path);
  };

  const isTabActive = (item) => {
    return adminNavSections[item] === activeSection;
  };

  return (
    <motion.header
      className="admin-header"
      initial={reduceMotion ? false : { opacity: 0, y: -18 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="admin-header__container">
        <div className="admin-header__brand-nav">
          <div className="admin-header__brand">Defilicious Admin</div>

          <nav className="admin-header__nav">
            {navItems.map((item) => {
              const isInactive = adminNavPaths[item] === undefined;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleNavItemClick(item)}
                  className={`admin-header__nav-item ${
                    isTabActive(item) ? "admin-header__nav-item--active" : ""
                  } ${
                    isInactive ? "admin-header__nav-item--disabled" : ""
                  }`}
                  aria-disabled={isInactive}
                >
                  {item}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="admin-header__actions">
          <div className="admin-header__search-group">
            <input
              type="search"
              placeholder="Search orders, restaurants, users..."
              className="admin-header__search-input"
            />
          </div>

          <div className="admin-header__user-group">
            <button type="button" className="admin-header__avatar">
              AD
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
