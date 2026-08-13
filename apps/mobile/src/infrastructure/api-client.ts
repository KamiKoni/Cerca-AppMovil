import { createHttpClient } from "./http/http-client";
import { secureTokenStore } from "./auth/secure-token-store";
import { sessionExpiry } from "./auth/session-expiry";
import { API_BASE_URL } from "./config";

/**
 * The one client the app uses.
 *
 * A module-level singleton on purpose: the token provider is stateless (it reads
 * the keystore on every request), so a fresh sign-in is picked up by the next
 * request without anyone having to rebuild the client.
 */
export const apiClient = createHttpClient({
  baseUrl: API_BASE_URL,
  tokenProvider: secureTokenStore,
  /**
   * Storage is emptied before the UI is told, so there is no moment where a
   * screen reacting to the notice could read a credential the server has
   * already refused.
   */
  onSessionExpired: () => {
    void secureTokenStore.clear().finally(() => sessionExpiry.notify());
  },
});
