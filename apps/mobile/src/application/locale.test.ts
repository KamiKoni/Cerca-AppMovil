import { describe, expect, it } from "vitest";
import { formatDistance, formatMoney } from "@cerca/contract";
import { FALLBACK_LOCALE, formattingTag, resolveLocale } from "./locale";

const MXN_LISTING = { amountMinor: 129990, currency: "MXN" };

/**
 * `Intl` separates the amount from the symbol with a non-breaking space
 * (U+00A0), so "1.299,90 MX$" typed by hand never equals what it returns. The
 * NBSP is correct and deliberate — it stops a currency from wrapping onto the
 * next line — so the test normalises instead of asking for it to be removed.
 */
const spaces = (text: string) => text.replace(/\u00A0/g, " ");

describe("resolveLocale", () => {
  it("keeps the country the device reported", () => {
    expect(resolveLocale(["es-MX"])).toEqual({ language: "es", tag: "es-MX" });
    expect(resolveLocale(["de-AT"])).toEqual({ language: "de", tag: "de-AT" });
  });

  it("gives a bare language its market's country", () => {
    // Without a region there is nothing for Intl to reason about, so a phone
    // reporting plain "en" would be stuck on metric units forever.
    expect(resolveLocale(["en"])).toEqual({ language: "en", tag: "en-US" });
    expect(resolveLocale(["es"])).toEqual({ language: "es", tag: "es-CO" });
  });

  it("walks the device's preference order and takes the first it can speak", () => {
    expect(resolveLocale(["ja-JP", "ko-KR", "de-DE"])).toEqual({
      language: "de",
      tag: "de-DE",
    });
  });

  it("falls back when the app speaks none of the requested languages", () => {
    // Language and formatting fall back together: Spanish text beside Japanese
    // number grouping is not a locale, it is two of them.
    expect(resolveLocale(["ja-JP"])).toEqual(FALLBACK_LOCALE);
    expect(resolveLocale([])).toEqual(FALLBACK_LOCALE);
  });

  it("survives the junk a device can actually report", () => {
    expect(resolveLocale(["", "  ", "not a tag", "en-GB"]).tag).toBe("en-GB");
    expect(resolveLocale(["en_US"])).toEqual({ language: "en", tag: "en-US" });
  });
});

describe("formattingTag", () => {
  const device = { language: "es", tag: "es-MX" } as const;

  it("keeps the device's country while the language still matches", () => {
    // A Mexican phone reading Spanish stays on es-MX, not on the app's es-CO.
    expect(formattingTag("es", device)).toBe("es-MX");
  });

  it("uses the language's own market once the user switches away", () => {
    expect(formattingTag("de", device)).toBe("de-DE");
    expect(formattingTag("en", device)).toBe("en-US");
  });

  it("falls back for a language the app does not ship", () => {
    expect(formattingTag("ja", device)).toBe(FALLBACK_LOCALE.tag);
  });
});

describe("the acceptance criteria, end to end", () => {
  it("renders the same MXN listing three ways", () => {
    const tagFor = (deviceTags: string[]) => resolveLocale(deviceTags).tag;

    expect(spaces(formatMoney(MXN_LISTING, tagFor(["es-MX"])))).toBe(
      "$1,299.90",
    );
    expect(spaces(formatMoney(MXN_LISTING, tagFor(["en-US"])))).toBe(
      "MX$1,299.90",
    );
    expect(spaces(formatMoney(MXN_LISTING, tagFor(["de-DE"])))).toBe(
      "1.299,90 MX$",
    );
  });

  it("recomputes distance into miles for an imperial locale", () => {
    // The regression this story exists for: the screens used to pass
    // `i18n.language`, which is "en" with no region, and 3 km stayed 3 km on a
    // US phone. Not translated - recomputed.
    expect(formatDistance(3000, resolveLocale(["en-US"]).tag)).toBe("1.9 mi");
    expect(formatDistance(3000, resolveLocale(["en-GB"]).tag)).toBe("3 km");
    expect(formatDistance(3000, resolveLocale(["es-CO"]).tag)).toBe("3 km");
  });

  it("keeps currency a property of the listing, not of the reader", () => {
    // Same listing, three readers: the amount and the currency never change,
    // only the way they are written.
    const written = ["es-MX", "en-US", "de-DE"].map((tag) =>
      formatMoney(MXN_LISTING, resolveLocale([tag]).tag),
    );

    for (const text of written) {
      expect(text).toMatch(/1[.,]299[.,]90/);
    }
    expect(new Set(written).size).toBe(3);
  });
});
