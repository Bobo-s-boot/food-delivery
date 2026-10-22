import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

export function HeaderLanguageSwitcher() {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage === "uk" ? "uk" : "en";
  const detailsRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    document.documentElement.lang = language;
    // The storefront header unmounts for the existing English-only admin shell.
    return () => { document.documentElement.lang = "en"; };
  }, [language]);

  useEffect(() => {
    const closeOutside = (event) => {
      if (detailsRef.current && !detailsRef.current.contains(event.target)) detailsRef.current.open = false;
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);

  const changeLanguage = (nextLanguage) => {
    // Reuses the old footer switcher's mechanism; i18n.js owns persistence.
    i18n.changeLanguage(nextLanguage);
    detailsRef.current.open = false;
    triggerRef.current?.focus();
  };

  return (
    <details ref={detailsRef} className="header-language" onKeyDown={(event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        detailsRef.current.open = false;
        triggerRef.current?.focus();
      }
    }}>
      <summary ref={triggerRef} className="header-language__trigger"
        aria-label={language === "uk" ? "Мова: українська. Змінити мову" : "Language: English. Change language"}>
        <span>{language === "uk" ? "UK" : "EN"}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </summary>
      <div className="header-language__options" role="group" aria-label={language === "uk" ? "Мова сайту" : "Site language"}>
        <button type="button" lang="en" aria-pressed={language === "en"} onClick={() => changeLanguage("en")}>English <span aria-hidden="true">EN</span></button>
        <button type="button" lang="uk" aria-pressed={language === "uk"} onClick={() => changeLanguage("uk")}>Українська <span aria-hidden="true">UK</span></button>
      </div>
    </details>
  );
}
