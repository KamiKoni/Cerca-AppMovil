import { describe, expect, it } from "vitest";
import type { BookingStatus } from "@cerca/contract";
import { availableActions, isTerminal } from "./booking-transitions";

/** One sample of every member of the union, so nothing is tested by proxy. */
const STATUSES = {
  requested: { kind: "requested", requestedAt: "2026-08-13T10:00:00.000Z" },
  accepted: {
    kind: "accepted",
    acceptedAt: "2026-08-13T11:00:00.000Z",
    scheduledFor: "2026-08-20T15:00:00.000Z",
  },
  declined: { kind: "declined", reason: "unavailable" },
  completed: { kind: "completed", completedAt: "2026-08-21T09:00:00.000Z" },
  cancelled: {
    kind: "cancelled",
    cancelledBy: "user-1",
    at: "2026-08-14T08:00:00.000Z",
  },
} satisfies Record<BookingStatus["kind"], BookingStatus>;

const ALL = Object.values(STATUSES) as BookingStatus[];

describe("availableActions", () => {
  it("lets the provider answer a request and nobody else", () => {
    expect(availableActions(STATUSES.requested, "provider")).toEqual([
      "accept",
      "decline",
      "cancel",
    ]);
    expect(availableActions(STATUSES.requested, "customer")).toEqual(["cancel"]);
  });

  it("lets only the provider complete an accepted booking", () => {
    // A customer marking their own booking complete would be marking somebody
    // else's work done.
    expect(availableActions(STATUSES.accepted, "provider")).toEqual([
      "complete",
      "cancel",
    ]);
    expect(availableActions(STATUSES.accepted, "customer")).toEqual(["cancel"]);
  });

  it("offers nothing on a booking that has already ended", () => {
    // The criterion, stated directly: a declined booking cannot be completed
    // and a completed one cannot be accepted.
    for (const status of [
      STATUSES.declined,
      STATUSES.completed,
      STATUSES.cancelled,
    ]) {
      expect(availableActions(status, "provider")).toEqual([]);
      expect(availableActions(status, "customer")).toEqual([]);
    }
  });

  it("never offers accept or decline once a date exists", () => {
    // Re-answering a request that was already answered is the transition most
    // likely to slip through, because the buttons are the ones already on screen.
    for (const viewer of ["provider", "customer"] as const) {
      for (const status of ALL) {
        if (status.kind === "requested") continue;
        const actions = availableActions(status, viewer);
        expect(actions).not.toContain("accept");
        expect(actions).not.toContain("decline");
      }
    }
  });

  it("answers for every member of the union without throwing", () => {
    // assertNever guards the default branch, so reaching it means a status kind
    // exists that this function does not handle.
    for (const viewer of ["provider", "customer"] as const) {
      for (const status of ALL) {
        expect(() => availableActions(status, viewer)).not.toThrow();
      }
    }
  });

  it("throws loudly on a kind the build never knew about", () => {
    // Not reachable through the types; reachable through a payload from a newer
    // server. Failing here beats rendering a booking with no state at all.
    const unknown = { kind: "expired" } as unknown as BookingStatus;

    expect(() => availableActions(unknown, "provider")).toThrowError(
      /Unhandled booking status/,
    );
  });
});

describe("isTerminal", () => {
  it("separates the states that can still move from the ones that cannot", () => {
    expect(isTerminal(STATUSES.requested)).toBe(false);
    expect(isTerminal(STATUSES.accepted)).toBe(false);
    expect(isTerminal(STATUSES.declined)).toBe(true);
    expect(isTerminal(STATUSES.completed)).toBe(true);
    expect(isTerminal(STATUSES.cancelled)).toBe(true);
  });

  it("is not the same question as having no actions", () => {
    // A customer sees no actions on an accepted booking beyond cancelling, but
    // the booking is very much still alive. Grouping the list by "no actions"
    // would file it under finished.
    expect(availableActions(STATUSES.accepted, "customer")).toEqual(["cancel"]);
    expect(isTerminal(STATUSES.accepted)).toBe(false);
  });
});
