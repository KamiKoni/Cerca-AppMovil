import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import { deviceLocale } from "./device-locale";
import en from "../../locales/en.json";
import es from "../../locales/es.json";
import de from "../../locales/de.json";

i18next.use(initReactI18next).init({
  /**
   * `compatibilityJSON: "v3"` used to sit here and it silently broke every
   * plural: v3 looks for `key` and `key_plural`, while the locale files use the
   * current `_one` and `_other`. Nothing matched, so `t("listing.reviewsCount")`
   * returned its own key and the app printed "listing.reviewsCount" on screen.
   *
   * The flag exists for runtimes without `Intl.PluralRules`. Hermes on this
   * React Native version has it — the app already formats money and distances
   * through `Intl` on the device — and i18next falls back to v3 on its own if
   * it is ever missing. The compatibility mode bought nothing and cost the
   * feature it was meant to protect.
   */
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
