import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translations
import translationEN from "../translations/en.json";
import translationRO from "../translations/ro.json";
import translationFR from "../translations/fr.json";
import translationDE from "../translations/de.json";

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  ro: {
    translation: translationRO
  },
  fr: {
    translation: translationFR
  },
  de: {
    translation: translationDE
  }
};

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    fallbackLng: "en",
    debug: process.env.NODE_ENV !== "production",
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    },
    detection: {
      order: ["localStorage", "cookie", "navigator"],
      caches: ["localStorage", "cookie"]
    }
  });

export default i18n;
