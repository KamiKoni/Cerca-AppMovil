/**
 * Where the app finds the API.
 *
 * Expo inlines `EXPO_PUBLIC_*` at bundle time, so this is a build-time constant,
 * not a runtime lookup — changing `.env` requires restarting the dev server.
 *
 * The value MUST be a LAN address when running on a physical device. `localhost`
 * on the phone means the phone, not the development machine, so a localhost base
 * URL fails with a network error that looks exactly like a dead server. That one
 * confusion costs more debugging time than everything else in this file.
 */
const configured = process.env.EXPO_PUBLIC_API_URL;

if (!configured) {
  throw new Error(
    "EXPO_PUBLIC_API_URL is not set. Copy apps/mobile/.env.example to apps/mobile/.env " +
      "and set it to your machine LAN IP, e.g. http://192.168.1.20:3333/v1 — not localhost, " +
      "which on a phone resolves to the phone itself.",
  );
}

export const API_BASE_URL = configured;

/**
 * Where search starts when the device location is unknown.
 *
 * The server answers 422 LOCATION_REQUIRED without coordinates or a city, so the
 * search screen needs *some* origin to be usable at all. expo-location is not a
 * dependency yet; until it is, this fixed origin (Medellin) keeps the flow
 * working instead of blocking it behind a permission prompt that does not exist.
 */
export const DEFAULT_SEARCH_COORDS = { lat: 6.24, lng: -75.58 } as const;
