export type ListingStatus =
  | { kind: "draft" }
  | { kind: "published"; publishedAt: string }
  | { kind: "paused" }
  | { kind: "under_review"; reportId: string }
  | { kind: "removed"; removedBy: string; reason: string };

/**
 * A booking's state, as the app reasons about it.
 *
 * This is the domain shape, not the wire shape. The API answers with a flat
 * object — `status` as a plain string beside nullable `scheduledFor` and
 * `completedAt` — which makes "accepted with no date" representable, and the
 * whole point of the union is that it is not. `toBookingStatus` in `schemas.ts`
 * is the one place that crosses between the two.
 *
 * `declined` and `cancelled` carry nothing because the endpoint sends nothing:
 * `declineReason`, `cancelledAt` and `cancelledById` exist in the database but
 * are not part of the response. Inventing fields the server never sends would
 * make this type a description of what we wish were true.
 */
export type BookingStatus =
  | { kind: "requested"; requestedAt: string }
  | { kind: "accepted"; acceptedAt: string; scheduledFor: string }
  | { kind: "declined" }
  | { kind: "completed"; completedAt: string }
  | { kind: "cancelled" };
