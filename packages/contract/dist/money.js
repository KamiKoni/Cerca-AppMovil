"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minorUnitDigits = minorUnitDigits;
exports.formatMoney = formatMoney;
exports.formatDistance = formatDistance;
const IMPERIAL_REGIONS = new Set(["US", "LR", "MM"]);
function minorUnitDigits(currency) {
    switch (currency) {
        case "JPY":
            return 0;
        case "KWD":
            return 3;
        case "MXN":
            return 2;
        default:
            return 2;
    }
}
function formatMoney(m, locale) {
    const digits = minorUnitDigits(m.currency);
    const amount = m.amountMinor / 10 ** digits;
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: m.currency,
    }).format(amount);
}
function localeUsesImperialUnits(locale) {
    try {
        const region = new Intl.Locale(locale).region;
        return region !== undefined && IMPERIAL_REGIONS.has(region);
    }
    catch {
        return false;
    }
}
function formatDistance(distanceMeters, locale) {
    const usesImperial = localeUsesImperialUnits(locale);
    const value = usesImperial
        ? distanceMeters / 1609.344
        : distanceMeters / 1000;
    const unit = usesImperial ? "mile" : "kilometer";
    return new Intl.NumberFormat(locale, {
        style: "unit",
        unit,
        maximumFractionDigits: 1,
    }).format(value);
}
