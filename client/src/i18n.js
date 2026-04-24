import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import uk from "./locales/uk.json";

const LANGUAGE_STORAGE_KEY = "app-language";
const supportedLanguages = ["en", "uk"];

const getInitialLanguage = () => {
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
    return savedLanguage;
  }

  const browserLanguage = navigator.language?.split("-")[0];
  if (browserLanguage && supportedLanguages.includes(browserLanguage)) {
    return browserLanguage;
  }

  return "en";
};

const resources = {
  en: {
    translation: en,
  },
  uk: {
    translation: uk,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: "en",
  supportedLngs: supportedLanguages,
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (lng) => {
  if (supportedLanguages.includes(lng)) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
  }
});

export default i18n;
