import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import "../Admin.scss";

export function AdminHeader({ navItems, createActions }) {
  const [isCreateOpen, setCreateOpen] = useState(false);
  const reduceMotion = useReducedMotion();

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
                className={`admin-header__nav-item ${
                  item === "Dashboard" ? "admin-header__nav-item--active" : ""
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
