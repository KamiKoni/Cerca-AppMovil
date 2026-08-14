import {
  authSignInSchema,
  refreshSchema,
  signOutSchema,
  signUpSchema,
  type AuthSignInResponse,
  type SignUpInput,
} from "@cerca/contract";
import { z } from "zod";
import type { SignInCredentials } from "../../application/auth";
import { signOut as signOutUseCase } from "../../application/sign-out";
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

/**
 * POST /v1/auth/sign-up.
 *
 * Answers with the same shape as signing in, and is persisted the same way: a
 * new account that then asked for credentials would be a sign-up that did not
 * sign anyone up.
 */
export async function signUp(input: SignUpInput): Promise<AuthSignInResponse> {
  // Parsed before sending, not only in the form: the schema fills `capacities`
  // with its default, and a caller that skipped the form would otherwise post a
  // body the server rejects with a 422 nobody expected.
  const body = signUpSchema.parse(input);

  const response = await apiClient.request("/auth/sign-up", authSignInSchema, {
    method: "POST",
    body,
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

/**
 * POST /v1/auth/sign-out — revokes the refresh token, and nothing else.
 *
 * Clearing the device is deliberately not here: this call is allowed to fail
 * and the `signOut` use case decides what that means. See `application/sign-out`.
 */
export async function revokeSession(): Promise<void> {
  const tokens = await secureTokenStore.getTokens();
  if (!tokens) return;

  const body = signOutSchema.parse({ refreshToken: tokens.refreshToken });

  await apiClient.request("/auth/sign-out", z.undefined(), {
    method: "POST",
    body,
  });
}

export async function signOut(): Promise<void> {
  return signOutUseCase({
    revokeSession,
    clearStorage: () => secureTokenStore.clear(),
  });
}
