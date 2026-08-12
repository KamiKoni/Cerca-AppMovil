import type { Actor } from "@cerca/contract";

/**
 * What the session use cases need from storage, and nothing more.
 *
 * The real implementation is `secureTokenStore`, which also writes tokens and
 * hands the access token to the HTTP client. Restoring a session never needs
 * those, so it does not ask for them: a port that only reads cannot be the
 * reason a token leaks into a layer that had no business holding one.
 */
export interface SessionStorage {
  /** The stored session, or null when there is none. */
  getTokens(): Promise<StoredSession | null>;
}

export interface StoredSession {
  readonly actor: Actor;
}
