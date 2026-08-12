import type { SessionState } from './session';

export const SIGN_IN_ROUTE = '/sign-in';
export const HOME_ROUTE = '/search';

/**
 * Which kind of area a route group is, from the session's point of view.
 *
 * - `entry` is the launch route: it belongs to nobody and only forwards.
 * - `auth` is sign-in and sign-up: for people without a session.
 * - `protected` is everything that needs one.
 *
 * Capacities are deliberately absent. Whether a signed-in user may *publish* a
 * listing is a different question from whether they may be here at all, it is
 * answered by `withCapacity` (SCRUM-20), and mixing the two would put two
 * unrelated reasons to redirect in one branch.
 */
export type RouteGroup = 'entry' | 'auth' | 'protected';

export type GuardDecision =
  | { readonly type: 'bootstrap' }
  | { readonly type: 'render' }
  | { readonly type: 'redirect'; readonly to: typeof SIGN_IN_ROUTE | typeof HOME_ROUTE };

const BOOTSTRAP: GuardDecision = { type: 'bootstrap' };
const RENDER: GuardDecision = { type: 'render' };
const TO_SIGN_IN: GuardDecision = { type: 'redirect', to: SIGN_IN_ROUTE };
const TO_HOME: GuardDecision = { type: 'redirect', to: HOME_ROUTE };

/**
 * The whole redirect policy, as a function of state and nothing else.
 *
 * Pure on purpose: this is the part of the guard worth testing, and testing it
 * through the navigator would mean a React Native renderer, a router harness
 * and a set of fake routes to reach the same three answers.
 *
 * The bootstrap case comes first for every group. A protected route that
 * redirected while the keystore was still being read would send a user with a
 * perfectly valid session to sign-in, every single launch.
 */
export function guardDecision(state: SessionState, group: RouteGroup): GuardDecision {
  if (state.status === 'bootstrapping') return BOOTSTRAP;

  const authenticated = state.status === 'authenticated';

  switch (group) {
    case 'entry':
      return authenticated ? TO_HOME : TO_SIGN_IN;
    case 'auth':
      // Signing in is not something you do twice. Landing back on the form
      // after a successful sign-in reads as the sign-in having failed.
      return authenticated ? TO_HOME : RENDER;
    case 'protected':
      return authenticated ? RENDER : TO_SIGN_IN;
  }
}
