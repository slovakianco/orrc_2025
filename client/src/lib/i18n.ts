import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./translations/en.json";
import roTranslation from "./translations/ro.json";
import frTranslation from "./translations/fr.json";
import deTranslation from "./translations/de.json";

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    resources: {
      en: {
        translation: enTranslation,
      },
      ro: {
        translation: roTranslation,
      },
      fr: {
        translation: frTranslation,
      },
      de: {
        translation: deTranslation,
      },
    },
  });

export default i18n;
