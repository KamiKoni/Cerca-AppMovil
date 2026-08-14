/** The languages the app has translations for. */
export const SUPPORTED_LANGUAGES = ["es", "en", "de"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * The market each language defaults to when the device names a language but no
 * country.
 *
 * A region is not decoration here: `Intl.Locale("en").region` is `undefined`,
 * and without a region there is no way to know that a distance should be shown
 * in miles. A bare "en" would silently keep every US phone on kilometres.
 */
const DEFAULT_REGION: Record<SupportedLanguage, string> = {
  es: "CO",
  en: "US",
  de: "DE",
};

export interface ResolvedLocale {
  /** Which translation file to load. */
  readonly language: SupportedLanguage;
  /** The full BCP-47 tag handed to `Intl` for money, distances and dates. */
  readonly tag: string;
}

/** Used when the device asks for a language the app cannot speak. */
export const FALLBACK_LOCALE: ResolvedLocale = { language: "es", tag: "es-CO" };

/**
 * Picks the language to read and the tag to format with, from the list the
 * device prefers, in its own order.
 *
 * Language and formatting are answered together on purpose. Showing Spanish
 * text next to Japanese number grouping is not a locale, it is two of them; if
 * the app cannot speak what the phone asked for, it says so consistently.
 */
export function resolveLocale(preferred: readonly string[]): ResolvedLocale {
  for (const raw of preferred) {
    const tag = raw?.trim();
    if (!tag) continue;

    const language = primarySubtag(tag);
    if (!isSupported(language)) continue;

    return { language, tag: withRegion(tag, language) };
  }

  return FALLBACK_LOCALE;
}

/**
 * The tag to format with once the language is known.
 *
 * Keeps the device's own region while the language still matches it — a
 * Mexican phone reading Spanish stays on `es-MX`, not on the app's `es-CO`
 * default. Only a language the device did not ask for falls back to that
 * language's default market.
 */
export function formattingTag(
  language: string,
  device: ResolvedLocale,
): string {
  if (language === device.language) return device.tag;
  if (isSupported(language)) return `${language}-${DEFAULT_REGION[language]}`;

  return FALLBACK_LOCALE.tag;
}

function primarySubtag(tag: string): string {
  return tag.split(/[-_]/)[0].toLowerCase();
}

function isSupported(language: string): language is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(language);
}

function withRegion(tag: string, language: SupportedLanguage): string {
  try {
    const locale = new Intl.Locale(tag.replace(/_/g, "-"));
    if (locale.region) return locale.toString();
  } catch {
    // An unparseable tag is treated as if it carried no region at all.
  }

  return `${language}-${DEFAULT_REGION[language]}`;
}
