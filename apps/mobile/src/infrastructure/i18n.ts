import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../../locales/en.json";
import es from "../../locales/es.json";
import de from "../../locales/de.json";

i18next.use(initReactI18next).init({
  compatibilityJSON: "v3",
  lng: "es",
  fallbackLng: "en",
  resources: {
    en: { translation: en },
    es: { translation: es },
    de: { translation: de },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
