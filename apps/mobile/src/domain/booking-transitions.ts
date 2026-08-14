import type { BookingStatus } from "@cerca/contract";
import { assertNever } from "./assert-never";

/** The four transitions a booking can be moved through from the app. */
export type BookingAction = "accept" | "decline" | "complete" | "cancel";

/** Which side of the booking is looking at it. */
export type BookingViewer = "provider" | "customer";

const NONE: readonly BookingAction[] = [];

/**
 * Which actions to paint for this booking, in this state, for this side.
 *
 * Derived from `status.kind` rather than from a list of allowed transitions
 * kept somewhere else: a table would have to be updated in lockstep with the
 * union, and the day it is not, the UI offers a button the server refuses.
 *
 * This decides **what gets painted, not what is allowed**. The server owns the
 * rules — relationship, timing, ownership — and rejects anything it disagrees
 * with. If somebody tampers with client state and a button appears, the request
 * still fails. That is the design, the same one SETUP-04 states for capacities.
 */
export function availableActions(
  status: BookingStatus,
  viewer: BookingViewer,
): readonly BookingAction[] {
  switch (status.kind) {
    case "requested":
      // The provider answers; either side can walk away before there is a date.
      return viewer === "provider"
        ? ["accept", "decline", "cancel"]
        : ["cancel"];

    case "accepted":
      // Only the provider can say the work happened. A customer marking their
      // own booking complete would be marking someone else's work done.
      return viewer === "provider" ? ["complete", "cancel"] : ["cancel"];

    case "declined":
    case "completed":
    case "cancelled":
      // Terminal. A declined booking cannot be completed and a completed one
      // cannot be accepted, so neither side is offered a way to try.
      return NONE;

    default:
      return assertNever(status, "booking status");
  }
}

/**
 * True once the booking can no longer move.
 *
 * Separate from `availableActions` returning nothing, because the two answer
 * different questions: a state with no actions *for this viewer* is not the
 * same as a state with no future at all, and the list groups by the second.
 */
export function isTerminal(status: BookingStatus): boolean {
  switch (status.kind) {
    case "requested":
    case "accepted":
      return false;
    case "declined":
    case "completed":
    case "cancelled":
      return true;
    default:
      return assertNever(status, "booking status");
  }
}
