import * as Crypto from "expo-crypto";

/**
 * Creates one key per user INTENT — call it when the user taps "Book", not on
 * every attempt.
 *
 * That distinction is the whole feature. A key generated per HTTP request would
 * differ on a retry, and the server would treat the retry as a new booking,
 * which is precisely what the header exists to prevent.
 *
 * Uses `expo-crypto` rather than `globalThis.crypto.randomUUID`, which does not
 * exist on Hermes: the previous version threw on the device the moment anyone
 * confirmed a booking. Node has it, so the whole problem was invisible from the
 * laptop — the same shape of mistake as assuming `Intl.PluralRules`.
 *
 * Still refuses to fall back to `Math.random`. The server files these under
 * `idem:<route>:<key>` without the user id, so a guessable key could replay
 * somebody else's stored response.
 *
 * Lives here rather than in `http-client` so that module stays importable by
 * the node test runner: this one pulls in a native module and cannot be.
 */
export function createIdempotencyKey(): string {
  return Crypto.randomUUID();
}
