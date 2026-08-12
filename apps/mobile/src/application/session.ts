import type { Actor } from '@cerca/contract';
import type { SessionStorage } from './ports/session-storage';

/**
 * Who the app thinks you are, as three states rather than two.
 *
 * `bootstrapping` is the one that is easy to leave out and expensive to omit:
 * reading the keystore is asynchronous, so for the first frames after launch
 * "not authenticated" and "not known yet" are indistinguishable unless the type
 * forces them apart. Collapsing them is what makes the login screen flash for a
 * moment before the restored session pushes it away.
 */
export type SessionState =
  | { readonly status: 'bootstrapping' }
  | { readonly status: 'authenticated'; readonly actor: Actor }
  | { readonly status: 'anonymous' };

export const BOOTSTRAPPING: SessionState = { status: 'bootstrapping' };
export const ANONYMOUS: SessionState = { status: 'anonymous' };

/**
 * Reads the stored session once, at launch.
 *
 * Every failure resolves to `anonymous` instead of rejecting. A keystore that
 * is unavailable — device locked mid-launch, entry written by an older build —
 * is not a reason to crash on the splash screen: signing in again is a recovery
 * the user can perform, and reinstalling the app is not.
 */
export async function restoreSession(storage: SessionStorage): Promise<SessionState> {
  try {
    const stored = await storage.getTokens();
    return stored ? { status: 'authenticated', actor: stored.actor } : ANONYMOUS;
  } catch {
    return ANONYMOUS;
  }
}
