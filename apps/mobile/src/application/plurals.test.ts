import { describe, expect, it } from "vitest";
import { createInstance } from "i18next";
import en from "../../locales/en.json";
import es from "../../locales/es.json";
import de from "../../locales/de.json";

/**
 * A standalone instance, not the app's singleton: the app's is bound to React
 * and to whatever the device reported, and a test that depended on either would
 * pass or fail based on the machine running it.
 */
const i18n = createInstance();

await i18n.init({
  // Mirrors the app's own init. Adding `compatibilityJSON: "v3"` here makes
  // every assertion below fail with the raw key, which is exactly what the app
  // was doing before this story.
  lng: "es",
  fallbackLng: "es",
  resources: {
    en: { translation: en },
    es: { translation: es },
    de: { translation: de },
  },
  interpolation: { escapeValue: false },
});

const count = (language: string, n: number) =>
  i18n.getFixedT(language)("listing.reviewsCount", { count: n });

describe("review count plurals", () => {
  it("uses the plural form at zero, not the singular", () => {
    // The case that slips through: English and Spanish both say "0 reviews",
    // and a naive `count === 1 ? singular : plural` gets it right by accident
    // while a missing _other key does not.
    expect(count("es", 0)).toBe("0 reseñas");
    expect(count("en", 0)).toBe("0 reviews");
    expect(count("de", 0)).toBe("0 Bewertungen");
  });

  it("uses the singular at exactly one", () => {
    expect(count("es", 1)).toBe("1 reseña");
    expect(count("en", 1)).toBe("1 review");
    expect(count("de", 1)).toBe("1 Bewertung");
  });

  it("uses the plural from two upward", () => {
    expect(count("es", 2)).toBe("2 reseñas");
    expect(count("en", 2)).toBe("2 reviews");
    expect(count("de", 2)).toBe("2 Bewertungen");
  });

  it("never falls through to the raw key in any language", () => {
    // A missing plural form surfaces as the key itself, which reads like a bug
    // report printed into the UI.
    for (const language of ["es", "en", "de"]) {
      for (const n of [0, 1, 2, 11, 100]) {
        expect(count(language, n)).not.toContain("reviewsCount");
      }
    }
  });
});
