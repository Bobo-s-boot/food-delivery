import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useNavigate, useParams } from "react-router-dom";
import "../Admin.scss";

export function AdminHeader({ navItems, createActions, activeSection }) {
  const [isCreateOpen, setCreateOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const { username } = useParams();

  const handleNavItemClick = (item) => {
    let path = "";
    if (item === "Dashboard") path = "/admin";
    else if (item === "Orders") path = "/admin/orders";
    else if (item === "Restaurants") path = "/admin/restaurants";
    else if (item === "Menu") path = "/admin/dishes";
    else return; // Ignore other tabs or keep them static

    const prefix = username ? `/${username}` : "";
    navigate(`${prefix}${path}`);
  };

  const isTabActive = (item) => {
    if (item === "Dashboard" && activeSection === "dashboard") return true;
    if (item === "Orders" && activeSection === "orders") return true;
    if (item === "Restaurants" && activeSection === "restaurants") return true;
    if (item === "Menu" && activeSection === "dishes") return true;
    return false;
  };

  return (
    <motion.header
      className="admin-header"
      initial={reduceMotion ? false : { opacity: 0, y: -18 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="admin-header__container">
        {/* Левая часть: Логотип и Навигация */}
        <div className="admin-header__brand-nav">
          <div className="admin-header__brand">Defilicious Admin</div>

          <nav className="admin-header__nav">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => handleNavItemClick(item)}
                className={`admin-header__nav-item ${
                  isTabActive(item) ? "admin-header__nav-item--active" : ""
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        {/* Правая часть: Поиск, Фильтры, Кнопка Create и Профиль */}
        <div className="admin-header__actions">
          {/* Поиск и кнопки фильтров */}
          <div className="admin-header__search-group">
            <input
              type="search"
              placeholder="Search orders, restaurants, users..."
              className="admin-header__search-input"
            />
            <button className="admin-header__filter-btn">Today</button>
            <button className="admin-header__icon-btn">!</button>
          </div>

          {/* Кнопка Create и Аватар */}
          <div className="admin-header__user-group">
            <div className="admin-header__dropdown-wrapper">
              <button
                onClick={() => setCreateOpen((value) => !value)}
                className="admin-header__create-btn"
              >
                + Create
              </button>

              {isCreateOpen && (
                <div className="admin-header__dropdown-menu">
                  {createActions.map((action) => (
                    <button
                      key={action}
                      onClick={() => {
                        setCreateOpen(false);
                        if (action === "New restaurant") {
                          handleNavItemClick("Restaurants");
                        } else if (action === "New menu item") {
                          handleNavItemClick("Menu");
                        }
                      }}
                      className="admin-header__dropdown-item"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="admin-header__avatar">AD</div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
