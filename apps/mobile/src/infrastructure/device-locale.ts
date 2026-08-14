import * as Localization from "expo-localization";
import {
  FALLBACK_LOCALE,
  resolveLocale,
  type ResolvedLocale,
} from "../application/locale";

/**
 * What the phone asks for, resolved against what the app can offer.
 *
 * Read once at startup rather than per render: `getLocales()` crosses into
 * native code, and the answer cannot change without the OS restarting the app.
 *
 * Wrapped in a try/catch because this is the first native call on the launch
 * path. A device where the module is unavailable — an old Expo Go, a stripped
 * build — should open in Spanish, not fail to open.
 */
export function readDeviceLocale(): ResolvedLocale {
  try {
    return resolveLocale(Localization.getLocales().map((l) => l.languageTag));
  } catch {
    return FALLBACK_LOCALE;
  }
}

export const deviceLocale: ResolvedLocale = readDeviceLocale();
