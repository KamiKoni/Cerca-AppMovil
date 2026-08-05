export type CurrencyCode = 'JPY' | 'MXN' | 'KWD' | string;

const IMPERIAL_REGIONS = new Set(['US', 'LR', 'MM']);

export interface Money {
  readonly amountMinor: number; // integer in minor units
  readonly currency: CurrencyCode;
}

export function minorUnitDigits(currency: CurrencyCode): number {
  switch (currency) {
    case 'JPY':
      return 0;
    case 'KWD':
      return 3;
    case 'MXN':
      return 2;
    default:
      return 2;
  }
}

export function formatMoney(m: Money, locale: string): string {
  const digits = minorUnitDigits(m.currency);
  const amount = m.amountMinor / 10 ** digits;
  return new Intl.NumberFormat(locale, { style: 'currency', currency: m.currency }).format(amount);
}

function localeUsesImperialUnits(locale: string): boolean {
  try {
    const region = new Intl.Locale(locale).region;
    return region !== undefined && IMPERIAL_REGIONS.has(region);
  } catch {
    return false;
  }
}

export function formatDistance(distanceMeters: number, locale: string): string {
  const usesImperial = localeUsesImperialUnits(locale);
  const value = usesImperial ? distanceMeters / 1609.344 : distanceMeters / 1000;
  const unit = usesImperial ? 'mile' : 'kilometer';

  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    maximumFractionDigits: 1,
  }).format(value);
}
