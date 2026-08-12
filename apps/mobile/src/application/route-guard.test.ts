import { describe, expect, it } from "vitest";
import type { Actor } from "@cerca/contract";
import {
  guardDecision,
  HOME_ROUTE,
  SIGN_IN_ROUTE,
  type RouteGroup,
} from "./route-guard";
import { ANONYMOUS, BOOTSTRAPPING, type SessionState } from "./session";

const ACTOR: Actor = {
  id: "user-1",
  capacities: ["customer"],
  platformRole: "user",
};
const AUTHENTICATED: SessionState = { status: "authenticated", actor: ACTOR };

const GROUPS: RouteGroup[] = ["entry", "auth", "protected"];

describe("guardDecision", () => {
  it("waits in every group while the keystore is still being read", () => {
    // The acceptance criterion about the flash, stated as a decision: a
    // protected route that redirected here would send a user with a valid
    // session to sign-in on every single launch.
    for (const group of GROUPS) {
      expect(guardDecision(BOOTSTRAPPING, group)).toEqual({
        type: "bootstrap",
      });
    }
  });

  it("sends the launch route to the area the session earns", () => {
    expect(guardDecision(AUTHENTICATED, "entry")).toEqual({
      type: "redirect",
      to: HOME_ROUTE,
    });
    expect(guardDecision(ANONYMOUS, "entry")).toEqual({
      type: "redirect",
      to: SIGN_IN_ROUTE,
    });
  });

  it("keeps a signed-in user out of the sign-in screen", () => {
    // Landing back on the form after a successful sign-in reads as the sign-in
    // having failed.
    expect(guardDecision(AUTHENTICATED, "auth")).toEqual({
      type: "redirect",
      to: HOME_ROUTE,
    });
    expect(guardDecision(ANONYMOUS, "auth")).toEqual({ type: "render" });
  });

  it("lets only an authenticated session through a protected group", () => {
    expect(guardDecision(AUTHENTICATED, "protected")).toEqual({
      type: "render",
    });
    expect(guardDecision(ANONYMOUS, "protected")).toEqual({
      type: "redirect",
      to: SIGN_IN_ROUTE,
    });
  });

  it("never renders protected children for a state that is not authenticated", () => {
    // The guarantee the screens below rely on: none of them handles a missing
    // actor, because none of them is ever mounted without one.
    for (const state of [BOOTSTRAPPING, ANONYMOUS]) {
      expect(guardDecision(state, "protected").type).not.toBe("render");
    }
  });

  it("signing out turns every protected route into a redirect", () => {
    // Sign-out sets the state to anonymous; this is what makes the user leave
    // the authenticated area rather than sit on a screen with a cleared cache.
    const before = guardDecision(AUTHENTICATED, "protected");
    const after = guardDecision(ANONYMOUS, "protected");

    expect(before).toEqual({ type: "render" });
    expect(after).toEqual({ type: "redirect", to: SIGN_IN_ROUTE });
  });
});
