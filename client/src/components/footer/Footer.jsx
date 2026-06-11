import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { dataLinksForFooter } from "./consts.js";
import { dataSmallLinksForFooter } from "./consts.js";
import "./Footer.scss";

const isInternalLink = (to) => typeof to === "string" && to.startsWith("/");

export function Footer() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <footer className="footer">
      <div className="footer__wrapper">
        <div className="footer__grid">
          <div className="footer__brand">
            <span className="footer__brand-title">Defilicious</span>
          </div>

          {dataLinksForFooter.map((column, index) => (
            <div key={index} className="footer__column">
              <ul className="footer__links-list">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {isInternalLink(link.to) ? (
                      <NavLink
                        to={link.to}
                        end={link.to === "/"}
                        className={({ isActive }) =>
                          `footer__link ${isActive ? "footer__link--active" : "footer__link--muted"}`
                        }
                      >
                        {t(`footer.links.${link.key}`)}
                      </NavLink>
                    ) : (
                      ""
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer__subscribe">
            <h3 className="footer__subscribe-title">
              {t("footer.dealsTitle")}
            </h3>
            <p className="footer__subscribe-text">
              {t("footer.dealsDescription")}
            </p>
            <input
              type="email"
              name="email"
              placeholder={t("footer.emailPlaceholder")}
              className="footer__subscribe-input"
            />
          </div>
        </div>

        <div className="footer__bottom">
          <small className="footer__copyright">{t("footer.copyright")}</small>

          <div className="footer__short-links">
            {dataSmallLinksForFooter.links.map((link, index) => (
              <a key={index} href={link.to} className="footer__small-link">
                {t(`footer.links.${link.key}`)}
              </a>
            ))}
          </div>

          <div className="footer__language">
            <button
              onClick={() => changeLanguage("en")}
              className={`footer__lang-button ${
                i18n.language === "en"
                  ? "footer__lang-button--active"
                  : "footer__lang-button--idle"
              }`}
            >
              EN
            </button>

            <button
              onClick={() => changeLanguage("uk")}
              className={`footer__lang-button ${
                i18n.language === "uk"
                  ? "footer__lang-button--active"
                  : "footer__lang-button--idle"
              }`}
            >
              UK
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
