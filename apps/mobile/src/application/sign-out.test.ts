import { describe, expect, it, vi } from "vitest";
import { signOut } from "./sign-out";

const ok = () => Promise.resolve();
const fails = (message: string) => () => Promise.reject(new Error(message));

describe("signOut", () => {
  it("revokes on the server and then clears the device", async () => {
    const order: string[] = [];

    await signOut({
      revokeSession: async () => {
        order.push("revoke");
      },
      clearStorage: async () => {
        order.push("clear");
      },
    });

    expect(order).toEqual(["revoke", "clear"]);
  });

  it("clears the device even when the server refuses", async () => {
    // The bug this exists for. The access token lives fifteen minutes, a
    // restored session is usually older, /auth/sign-out answers 401, and the
    // client does not refresh on /auth/ paths - so this is the common case,
    // not the edge one.
    const clearStorage = vi.fn(ok);

    await signOut({ revokeSession: fails("401 UNAUTHENTICATED"), clearStorage });

    expect(clearStorage).toHaveBeenCalledTimes(1);
  });

  it("clears the device when the server cannot be reached at all", async () => {
    const clearStorage = vi.fn(ok);

    await signOut({ revokeSession: fails("Network request failed"), clearStorage });

    expect(clearStorage).toHaveBeenCalledTimes(1);
  });

  it("never rejects, so the caller cannot be left holding an error", async () => {
    // SignOutButton fires this without awaiting. A rejection here surfaced as
    // an unhandled promise and a red screen, with the session still live.
    await expect(
      signOut({ revokeSession: fails("boom"), clearStorage: ok }),
    ).resolves.toBeUndefined();
  });

  it("still reports a failure to clear, which is not recoverable here", async () => {
    // The opposite case: if the keystore itself fails, the user is not signed
    // out and pretending otherwise would be a lie. This one does propagate.
    await expect(
      signOut({ revokeSession: ok, clearStorage: fails("keystore locked") }),
    ).rejects.toThrow("keystore locked");
  });
});
