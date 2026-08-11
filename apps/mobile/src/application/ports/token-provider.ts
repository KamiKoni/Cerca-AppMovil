/**
 * Where the HTTP client gets the session token.
 *
 * A port, not an import: the real implementation reads expo-secure-store, which
 * is a native module. Depending on it directly would make the data layer
 * untestable outside a device, and would tie the client to one storage choice.
 * Infrastructure implements this; the client only knows the interface.
 */
export interface TokenProvider {
  /** The current access token, or null when there is no session. */
  getAccessToken(): Promise<string | null>;
}
