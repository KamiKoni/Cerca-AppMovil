/**
 * Must come before i18next is configured, and it is not optional.
 *
 * Hermes on this device ships `Intl.NumberFormat` — prices and distances format
 * correctly — but no `Intl.PluralRules`. i18next checks for it at init, finds it
 * missing, and falls back to its v3 plural format, which looks for `key` and
 * `key_plural`. The locale files use `_one` and `_other`, so nothing matches and
 * every counted string renders as its own key.
 *
 * This was verified on a physical device, not in the test runner: Node has
 * `Intl.PluralRules`, so the whole problem is invisible from the laptop.
 */
import "intl-pluralrules";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import { deviceLocale } from "./device-locale";
import en from "../../locales/en.json";
import es from "../../locales/es.json";
import de from "../../locales/de.json";

i18next.use(initReactI18next).init({
  /**
   * No `compatibilityJSON` here on purpose: v3 looks for `key` and `key_plural`
   * while the locale files use `_one` and `_other`, so setting it renders every
   * counted string as its own key. The polyfill above is what makes leaving it
   * out safe — without one, i18next falls back to v3 by itself and the same
   * breakage returns.
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
