import { useTranslation } from "react-i18next";

export function FooterLanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
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
    </>
  );
}
