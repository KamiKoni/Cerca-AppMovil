export type CurrencyCode = "JPY" | "MXN" | "KWD" | string;
export interface Money {
    readonly amountMinor: number;
    readonly currency: CurrencyCode;
}
export declare function minorUnitDigits(currency: CurrencyCode): number;
export declare function formatMoney(m: Money, locale: string): string;
export declare function formatDistance(distanceMeters: number, locale: string): string;
