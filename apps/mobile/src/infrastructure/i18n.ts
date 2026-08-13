import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import { deviceLocale } from "./device-locale";
import en from "../../locales/en.json";
import es from "../../locales/es.json";
import de from "../../locales/de.json";

i18next.use(initReactI18next).init({
  compatibilityJSON: "v3",
  // Was hardcoded to a single language, which made the English and German
  // translation files unreachable no matter what the phone asked for.
  lng: deviceLocale.language,
  fallbackLng: "es",
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
