import React, { createContext, useContext, useEffect, useState } from "react";
import type { Actor, AuthSignInResponse } from "@cerca/contract";
import { secureTokenStore } from "../../infrastructure/auth/secure-token-store";
import {
  getMe,
  addProviderCapacity as callAddProviderCapacity,
} from "../../infrastructure/gateways/me-gateway";

interface AuthContextValue {
  actor: Actor | null;
  isLoading: boolean;
  setSession: (response: AuthSignInResponse) => Promise<void>;
  signOut: () => Promise<void>;
  becomeProvider: () => Promise<Actor>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [actor, setActor] = useState<Actor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initSession() {
      try {
        const tokens = await secureTokenStore.getTokens();
        if (tokens) {
          setActor(tokens.actor);
          // Refresh profile defensively in background
          getMe()
            .then((fresh) => {
              setActor(fresh);
              secureTokenStore.saveTokens({ ...tokens, actor: fresh });
            })
            .catch(() => {
              // Keep cached actor if network fails
            });
        }
      } catch {
        setActor(null);
      } finally {
        setIsLoading(false);
      }
    }

    initSession();
  }, []);

  async function setSession(response: AuthSignInResponse) {
    await secureTokenStore.saveTokens(response);
    setActor(response.actor);
  }

  async function signOut() {
    await secureTokenStore.clear();
    setActor(null);
  }

  async function becomeProvider(): Promise<Actor> {
    const updated = await callAddProviderCapacity();
    setActor(updated);
    const tokens = await secureTokenStore.getTokens();
    if (tokens) {
      await secureTokenStore.saveTokens({ ...tokens, actor: updated });
    }
    return updated;
  }

  return (
    <AuthContext.Provider
      value={{
        actor,
        isLoading,
        setSession,
        signOut,
        becomeProvider,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthSession() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthSession must be used within an AuthProvider");
  }
  return ctx;
}
