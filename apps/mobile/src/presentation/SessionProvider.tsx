import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Actor } from "@cerca/contract";
import {
  ANONYMOUS,
  BOOTSTRAPPING,
  restoreSession,
  type SessionState,
} from "../application/session";
import { secureTokenStore } from "../infrastructure/auth/secure-token-store";
import { sessionExpiry } from "../infrastructure/auth/session-expiry";
import { signOut as clearStoredSession } from "../infrastructure/gateways/auth-gateway";

interface SessionContextValue {
  readonly state: SessionState;
  /** Called by the sign-in screen once the server has accepted the credentials. */
  signedIn(actor: Actor): Promise<void>;
  signOut(): Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

/**
 * Holds the session for the whole app and restores it once on launch.
 *
 * Must sit inside the `QueryClientProvider`: signing out clears the cache, and
 * the cache is the other half of the session. A token deleted from the keystore
 * while the previous user's search results are still cached would show the next
 * person someone else's data for as long as those entries stayed fresh.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(BOOTSTRAPPING);
  const queryClient = useQueryClient();

  useEffect(() => {
    let cancelled = false;

    void restoreSession(secureTokenStore).then((restored) => {
      // The app can be closed while the keystore read is in flight. Writing
      // state into an unmounted tree is a leak that React warns about and that
      // nobody can reproduce on demand.
      if (!cancelled) setState(restored);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * The other way a session ends: the server refuses to refresh it while the
   * app is open. The keystore has already been emptied by then, so the only
   * thing left is to say so on screen and drop the cache the old session filled
   * — the guards turn that into a redirect to sign-in.
   */
  useEffect(
    () =>
      sessionExpiry.subscribe(() => {
        setState(ANONYMOUS);
        queryClient.clear();
      }),
    [queryClient],
  );

  async function signedIn(actor: Actor): Promise<void> {
    const stored = await secureTokenStore.getTokens();
    if (stored) {
      await secureTokenStore.saveTokens({ ...stored, actor });
    }

    setState({ status: "authenticated", actor });
  }

  const value = useMemo<SessionContextValue>(
    () => ({
      state,
      signedIn,
      signOut: async () => {
        // Storage first. If the app dies between the two steps, the worst case
        // is a UI that still looks signed in with nothing behind it — which the
        // next launch corrects. The reverse order leaves a live token on disk
        // after the user was told they had signed out.
        await clearStoredSession();
        setState(ANONYMOUS);
        queryClient.clear();
      },
    }),
    [state, signedIn, queryClient],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const value = useContext(SessionContext);

  if (!value) {
    throw new Error("useSession must be used inside <SessionProvider>.");
  }

  return value;
}

/**
 * The signed-in actor, or null when there is no session.
 *
 * This is the read the authorization layer (SCRUM-20) is waiting on: `can()`
 * from `@cerca/contract` takes an `Actor`, and until now nothing in React could
 * produce one.
 */
export function useActor(): Actor | null {
  const { state } = useSession();
  return state.status === "authenticated" ? state.actor : null;
}
