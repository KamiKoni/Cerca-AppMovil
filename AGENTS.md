# Conventions for this repository

## Money is never a bare number

`0.1 + 0.2 !== 0.3`. Floating point cannot represent a price, and the error is
not theoretical: it shows up as a total that is one cent off, on a screen the
user is about to pay from.

Money is always the `Money` type from `@cerca/contract`: an **integer in minor
units** plus a currency code.

```ts
// Yes
const price: Money = { amountMinor: 129990, currency: "MXN" };

// No
const price = 1299.9;
```

Dividing by 100 to display is also wrong in general. Minor units differ by
currency — JPY has 0 digits, MXN has 2, KWD has 3 — so use `minorUnitDigits`,
which `formatMoney` already does.

## Currency belongs to the listing, formatting belongs to the reader

Two different questions that must never merge:

- **Which currency** a price is in is a property of the listing, set by whoever
  published it. It does not change because someone from another country is
  looking.
- **How that price is written** is a property of the reader. The same MXN
  listing reads `$1,299.90` in `es-MX`, `MX$1,299.90` in `en-US` and
  `1.299,90 MX$` in `de-DE`.

Pass a full BCP-47 tag — `es-CO`, not `es` — to `formatMoney` and
`formatDistance`. Without a region, `Intl` cannot tell that a distance should be
in miles, and `formatDistance` silently keeps every phone on kilometres. Use
`useLocaleTag()` rather than `i18n.language`.

Distance is recomputed for imperial locales, never translated: "3 km" becomes
"1.9 mi", not "3 miles".

## Directional spacing

Use `marginStart` / `marginEnd` and `paddingStart` / `paddingEnd`. Never
`Left` / `Right`. The gap after a label is not on the right-hand side in a
right-to-left layout.

## Plurals

Every counted string needs `_one` and `_other` in all three locale files. Do not
set `compatibilityJSON: "v3"` on the i18next init: it expects the older
`key_plural` form, finds nothing, and renders the raw key on screen.

## Layer boundaries

Enforced by `import/no-restricted-paths` in `.eslintrc.cjs`:

- `domain` imports nothing from `application`, `infrastructure` or `presentation`
- `application` imports nothing from `presentation`

Pure decision logic belongs in `domain` or `application`, where it can be tested
without a renderer — the vitest project is node-only and matches `*.test.ts`,
so anything mounting a component cannot run.
