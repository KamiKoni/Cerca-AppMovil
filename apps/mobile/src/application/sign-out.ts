export interface SignOutPorts {
  /** Tells the server to revoke the refresh token. May fail; that is expected. */
  revokeSession(): Promise<void>;
  /** Empties the keystore. Must happen whatever the server said. */
  clearStorage(): Promise<void>;
}

/**
 * Signing out, in the order that matters.
 *
 * Revoking on the server is best effort; clearing the device is not. The two
 * used to be one sequence, so a rejected revoke meant `clear()` never ran and
 * the user stayed signed in with a red error on screen — which is what happens
 * every time, because the access token lives fifteen minutes and a session
 * restored from the keystore is almost always older than that. `/auth/sign-out`
 * answers 401, and the client deliberately does not refresh on `/auth/` paths.
 *
 * So the server call cannot be allowed to decide. Someone who asked to be
 * signed out is signed out on this device, even with the API unreachable.
 *
 * The cost is real and worth stating: when the revoke fails, the refresh token
 * stays valid server-side until it expires on its own. That is a worse trade
 * only if the device is hostile, and a device we are still holding the token on
 * is strictly worse than one we are not.
 */
export async function signOut(ports: SignOutPorts): Promise<void> {
  try {
    await ports.revokeSession();
  } catch {
    // Deliberately swallowed. The one thing that must not happen here is
    // rethrowing, because the line below is the part the user asked for.
  }

  await ports.clearStorage();
}
