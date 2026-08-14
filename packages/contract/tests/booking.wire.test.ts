import { describe, expect, it } from "vitest";
import {
  acceptBookingSchema,
  bookingSchema,
  createBookingSchema,
  createReviewSchema,
  declineBookingSchema,
  reviewSchema,
  toBooking,
  toBookingStatus,
} from "../src/schemas";

/**
 * Captured from the running API on 2026-08-13, not written from the docs.
 *
 * The whole class of bug this file exists for is a schema that describes what
 * we assumed rather than what arrives, so the fixture has to come from the
 * server. Every field below is exactly as `POST /v1/bookings` returned it.
 */
const WIRE_REQUESTED = {
  id: "ac27cad3-97e0-4690-83d1-2ebccdc80776",
  listingId: "fff42189-6a1f-4384-83f6-2348b4705ad7",
  customerId: "9ce7d80c-ea2f-4ba5-a2e0-055d3cf61bf7",
  status: "requested",
  requestedAt: "2026-08-13T11:37:53.379Z",
  scheduledFor: null,
  completedAt: null,
  reviewId: null,
};

const WIRE_ACCEPTED = {
  ...WIRE_REQUESTED,
  status: "accepted",
  scheduledFor: "2026-08-20T15:00:00.000Z",
};

const WIRE_COMPLETED = {
  ...WIRE_ACCEPTED,
  status: "completed",
  completedAt: "2026-08-21T09:00:00.000Z",
};

/** From `POST /v1/bookings/{id}/review`, same session. */
const WIRE_REVIEW = {
  id: "5396a3f2-dd7c-4307-aafd-dca1dc16928a",
  bookingId: "ac27cad3-97e0-4690-83d1-2ebccdc80776",
  listingId: "fff42189-6a1f-4384-83f6-2348b4705ad7",
  authorId: "9ce7d80c-ea2f-4ba5-a2e0-055d3cf61bf7",
  rating: 5,
  body: "Excelente servicio",
  createdAt: "2026-08-13T11:59:09.727Z",
};

describe("the booking wire format", () => {
  it("parses what the server actually sends", () => {
    // This is the assertion that was failing in production, with
    // "status: Expected object, received string" and "providerId: Required".
    for (const wire of [WIRE_REQUESTED, WIRE_ACCEPTED, WIRE_COMPLETED]) {
      expect(bookingSchema.safeParse(wire).success).toBe(true);
    }
  });

  it("rejects a booking whose status is not one the API can send", () => {
    expect(
      bookingSchema.safeParse({ ...WIRE_REQUESTED, status: "expired" }).success,
    ).toBe(false);
  });
});

describe("toBookingStatus", () => {
  it("moves the timestamps inside the state they belong to", () => {
    expect(toBookingStatus(bookingSchema.parse(WIRE_ACCEPTED))).toEqual({
      kind: "accepted",
      acceptedAt: WIRE_REQUESTED.requestedAt,
      scheduledFor: WIRE_ACCEPTED.scheduledFor,
    });

    expect(toBookingStatus(bookingSchema.parse(WIRE_COMPLETED))).toEqual({
      kind: "completed",
      completedAt: WIRE_COMPLETED.completedAt,
    });
  });

  it("refuses to build an accepted booking with no date", () => {
    // The wire allows it - scheduledFor is nullable whatever the status - and
    // the union exists so the rest of the app never has to handle it. Reporting
    // the previous state is honest; inventing a date would not be.
    const impossible = { ...WIRE_REQUESTED, status: "accepted" };

    expect(toBookingStatus(bookingSchema.parse(impossible))).toEqual({
      kind: "requested",
      requestedAt: WIRE_REQUESTED.requestedAt,
    });
  });

  it("carries no fields the endpoint does not send", () => {
    // declineReason and cancelledAt exist in the database but not in the
    // response, so the union says nothing about them rather than lying.
    expect(
      toBookingStatus(bookingSchema.parse({ ...WIRE_REQUESTED, status: "declined" })),
    ).toEqual({ kind: "declined" });

    expect(
      toBookingStatus(bookingSchema.parse({ ...WIRE_REQUESTED, status: "cancelled" })),
    ).toEqual({ kind: "cancelled" });
  });

  it("hands screens a booking whose status is the union", () => {
    const booking = toBooking(bookingSchema.parse(WIRE_COMPLETED));

    expect(booking.status.kind).toBe("completed");
    expect(booking.reviewId).toBeNull();
  });
});

describe("the request bodies the server accepts", () => {
  it("names the booking note in the singular", () => {
    // The API's schema is strict: `notes` came back as
    // 422 Unrecognized key: "notes" on every booking request.
    expect(
      createBookingSchema.parse({ listingId: "l1", note: "por la tarde" }),
    ).toEqual({ listingId: "l1", note: "por la tarde" });
  });

  it("requires a date to accept and a known reason to decline", () => {
    expect(acceptBookingSchema.safeParse({}).success).toBe(false);
    expect(
      acceptBookingSchema.safeParse({ scheduledFor: "2026-08-20T15:00:00.000Z" })
        .success,
    ).toBe(true);

    expect(declineBookingSchema.safeParse({ reason: "unavailable" }).success).toBe(
      true,
    );
    expect(declineBookingSchema.safeParse({ reason: "no me apetece" }).success).toBe(
      false,
    );
  });

  it("writes a review as body, which is what the server reads", () => {
    expect(createReviewSchema.safeParse({ rating: 5, body: "Muy bien" }).success).toBe(
      true,
    );
    // The old shape. It reached the server as a 422 every time.
    expect(
      createReviewSchema.safeParse({ rating: 5, comment: "Muy bien" }).success,
    ).toBe(false);
  });
});

describe("the review wire format", () => {
  it("keeps the text instead of dropping it", () => {
    // The old schema named the field `comment` and was not strict, so it
    // accepted this response and silently discarded `body`. Reviews rendered
    // blank and nothing reported an error.
    const review = reviewSchema.parse(WIRE_REVIEW);

    expect(review.body).toBe("Excelente servicio");
  });
});
