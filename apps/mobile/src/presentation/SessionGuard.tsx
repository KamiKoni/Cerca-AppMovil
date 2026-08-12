import type { ReactNode } from 'react';
import { Redirect } from 'expo-router';
import { guardDecision, type RouteGroup } from '../application/route-guard';
import { LoadingScreen } from './LoadingScreen';
import { useSession } from './SessionProvider';

/**
 * One guard, mounted in each group's `_layout.tsx`.
 *
 * Per group rather than per screen: a route added to `(app)` later is protected
 * because of where its file sits, not because someone remembered to wrap it.
 * The screens below never render for an unauthorised state, so none of them
 * needs to handle a missing actor.
 *
 * `Redirect` rather than an effect calling `router.replace`: an effect runs
 * *after* the children have rendered, which paints one frame of the protected
 * screen before navigating away. That frame is the flash the story rules out.
 */
export function SessionGuard({ group, children }: { group: RouteGroup; children?: ReactNode }) {
  const { state } = useSession();
  const decision = guardDecision(state, group);

  if (decision.type === 'bootstrap') return <LoadingScreen />;
  if (decision.type === 'redirect') return <Redirect href={decision.to} />;

  return <>{children}</>;
}
