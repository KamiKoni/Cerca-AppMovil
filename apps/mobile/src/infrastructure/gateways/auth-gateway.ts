import {
  authSignInSchema,
  refreshSchema,
  signOutSchema,
  type AuthSignInResponse,
} from "@cerca/contract";
import { z } from "zod";
import type { SignInCredentials } from "../../application/auth";
import { apiClient } from "../api-client";
import { secureTokenStore } from "../auth/secure-token-store";

/**
 * POST /v1/auth/sign-in.
 *
 * Persists the session as part of signing in rather than leaving it to the
 * caller: a screen that forgot to save would appear to work until the next cold
 * start, which is the worst moment to discover it.
 */
export async function signIn(
  credentials: SignInCredentials,
): Promise<AuthSignInResponse> {
  const response = await apiClient.request("/auth/sign-in", authSignInSchema, {
    method: "POST",
    body: credentials,
  });

  await secureTokenStore.saveTokens(response);
  return response;
}

export async function refreshSession(): Promise<AuthSignInResponse> {
  const tokens = await secureTokenStore.getTokens();
  if (!tokens) {
    throw new Error("No session is available to refresh.");
  }

  const body = refreshSchema.parse({ refreshToken: tokens.refreshToken });

  const response = await apiClient.request("/auth/refresh", authSignInSchema, {
    method: "POST",
    body,
  });

  await secureTokenStore.saveTokens(response);
  return response;
}

export async function signOut(): Promise<void> {
  const tokens = await secureTokenStore.getTokens();
  if (!tokens) return;

  const body = signOutSchema.parse({ refreshToken: tokens.refreshToken });

  await apiClient.request("/auth/sign-out", z.undefined(), {
    method: "POST",
    body,
  });
  await secureTokenStore.clear();
}
