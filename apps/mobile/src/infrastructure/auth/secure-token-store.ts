import * as SecureStore from "expo-secure-store";
import type { Actor } from "@cerca/contract";
import type { TokenProvider } from "../../application/ports/token-provider";
import type { AuthStorage } from "../auth";
import type { AuthTokens } from "../../application/ports/token-provider";

const ACCESS_KEY = "cerca.accessToken";
const REFRESH_KEY = "cerca.refreshToken";
const ACTOR_KEY = "cerca.actor";

/**
 * The session, in the OS keystore — Keychain on iOS, EncryptedSharedPreferences
 * on Android. Not AsyncStorage: that is plain text on disk, and a bearer token
 * sitting in plain text is the whole session for anyone with the device.
 *
 * Implements both `AuthStorage` (write side, used by sign-in) and
 * `TokenProvider` (read side, used by the HTTP client). The client only ever
 * sees the read side, so it cannot accidentally mutate the session.
 */
export const secureTokenStore: AuthStorage & TokenProvider = {
  async saveTokens(tokens: AuthTokens): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_KEY, tokens.accessToken),
      SecureStore.setItemAsync(REFRESH_KEY, tokens.refreshToken),
      SecureStore.setItemAsync(ACTOR_KEY, JSON.stringify(tokens.actor)),
    ]);
  },

  async clear(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_KEY),
      SecureStore.deleteItemAsync(REFRESH_KEY),
      SecureStore.deleteItemAsync(ACTOR_KEY),
    ]);
  },

  async getTokens(): Promise<AuthTokens | null> {
    const [accessToken, refreshToken, rawActor] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_KEY),
      SecureStore.getItemAsync(REFRESH_KEY),
      SecureStore.getItemAsync(ACTOR_KEY),
    ]);

    if (!accessToken || !refreshToken || !rawActor) return null;

    try {
      return {
        accessToken,
        refreshToken,
        actor: JSON.parse(rawActor) as Actor,
      };
    } catch {
      // A half-written or corrupted actor is not a session. Returning null sends
      // the user to sign-in, which is recoverable; throwing here would crash the
      // app on launch with no way out short of reinstalling.
      return null;
    }
  },

  async getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(ACCESS_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(REFRESH_KEY);
  },
};
