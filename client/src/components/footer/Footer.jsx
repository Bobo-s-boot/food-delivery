import { useTranslation } from "react-i18next";
import "./Footer.scss";
import { FooterColumn } from "./components/FooterColumn.jsx";
import { FooterSmallLinks } from "./components/FooterSmallLinks.jsx";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer__wrapper">
        <div className="footer__grid">
          <div className="footer__brand">
            <span className="footer__brand-title">Defilicious</span>
          </div>

          <FooterColumn />

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

          <FooterSmallLinks />
        </div>
      </div>
    </footer>
  );
}
