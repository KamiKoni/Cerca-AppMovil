import { describe, expect, it } from 'vitest';
import type { Actor } from '@cerca/contract';
import type { SessionStorage } from './ports/session-storage';
import { restoreSession } from './session';

const ACTOR: Actor = { id: 'user-1', capacities: ['customer'], platformRole: 'user' };

const storageWith = (stored: { actor: Actor } | null): SessionStorage => ({
  getTokens: async () => stored,
});

const failingStorage: SessionStorage = {
  getTokens: async () => {
    throw new Error('keystore unavailable');
  },
};

describe('restoreSession', () => {
  it('returns the stored actor as an authenticated session', async () => {
    const state = await restoreSession(storageWith({ actor: ACTOR }));

    expect(state).toEqual({ status: 'authenticated', actor: ACTOR });
  });

  it('returns anonymous when nothing is stored', async () => {
    expect(await restoreSession(storageWith(null))).toEqual({ status: 'anonymous' });
  });

  it('returns anonymous instead of rejecting when the keystore fails', async () => {
    // The alternative is an unhandled rejection during launch, which surfaces as
    // an app that dies on the splash screen. Signing in again is a recovery the
    // user can perform; reinstalling to clear a bad keystore entry is not.
    await expect(restoreSession(failingStorage)).resolves.toEqual({ status: 'anonymous' });
  });

  it('never reports bootstrapping as an outcome', async () => {
    // Bootstrapping describes the wait, not its result. If restoring could
    // return it, the guards would have no state that ends the loading screen.
    const outcomes = await Promise.all([
      restoreSession(storageWith({ actor: ACTOR })),
      restoreSession(storageWith(null)),
      restoreSession(failingStorage),
    ]);

    expect(outcomes.map((state) => state.status)).toEqual([
      'authenticated',
      'anonymous',
      'anonymous',
    ]);
  });
});
