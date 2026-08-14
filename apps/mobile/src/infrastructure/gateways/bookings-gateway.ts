import {
  acceptBookingSchema,
  bookingSchema,
  bookingsResponseSchema,
  createBookingSchema,
  createReviewSchema,
  declineBookingSchema,
  reviewSchema,
  type BookingResponse,
  type BookingsResponse,
  type CreateBookingInput,
  type CreateReviewInput,
  type DeclineReason,
  type ReviewResponse,
} from "@cerca/contract";
import { apiClient } from "../api-client";

/**
  POST /v1/bookings
  Requires Idempotency-Key header for safe retries.
 */
export async function createBooking(
  input: CreateBookingInput,
  idempotencyKey: string,
): Promise<BookingResponse> {
  // Parsed on the way out, not only on the way in. The server's schema is
  // strict, so one stray key is a 422 for the whole request; catching it here
  // names the offending field instead of leaving a generic validation error.
  const body = createBookingSchema.parse(input);

  return apiClient.request("/bookings", bookingSchema, {
    method: "POST",
    body,
    headers: {
      "Idempotency-Key": idempotencyKey,
    },
  });
}

/** GET /v1/bookings?role=customer|provider&cursor=... */
export async function getBookings(
  role: "customer" | "provider",
  cursor?: string,
): Promise<BookingsResponse> {
  return apiClient.request("/bookings", bookingsResponseSchema, {
    query: { role, cursor },
  });
}

/** GET /v1/bookings/{id} */
export async function getBookingDetail(id: string): Promise<BookingResponse> {
  return apiClient.request(`/bookings/${id}`, bookingSchema);
}

/**
 * POST /v1/bookings/{id}/accept
 *
 * `scheduledFor` is required, not optional: without it the server answers 422.
 * Accepting and setting the date are one act, which is also why the domain's
 * `accepted` state carries the date rather than allowing it to be filled in
 * afterwards.
 */
export async function acceptBooking(
  id: string,
  scheduledFor: string,
): Promise<BookingResponse> {
  const body = acceptBookingSchema.parse({ scheduledFor });

  return apiClient.request(`/bookings/${id}/accept`, bookingSchema, {
    method: "POST",
    body,
  });
}

/** POST /v1/bookings/{id}/decline. The reason is a fixed set, not free text. */
export async function declineBooking(
  id: string,
  reason: DeclineReason,
): Promise<BookingResponse> {
  const body = declineBookingSchema.parse({ reason });

  return apiClient.request(`/bookings/${id}/decline`, bookingSchema, {
    method: "POST",
    body,
  });
}

/** POST /v1/bookings/{id}/complete */
export async function completeBooking(id: string): Promise<BookingResponse> {
  return apiClient.request(`/bookings/${id}/complete`, bookingSchema, {
    method: "POST",
  });
}

/** POST /v1/bookings/{id}/cancel */
export async function cancelBooking(
  id: string,
  reason?: string,
): Promise<BookingResponse> {
  return apiClient.request(`/bookings/${id}/cancel`, bookingSchema, {
    method: "POST",
    body: { reason },
  });
}

/**
  POST /v1/bookings/{id}/review
  Requires Idempotency-Key header for review submission.
 */
export async function submitReview(
  bookingId: string,
  input: CreateReviewInput,
  idempotencyKey: string,
): Promise<ReviewResponse> {
  const body = createReviewSchema.parse(input);

  return apiClient.request(`/bookings/${bookingId}/review`, reviewSchema, {
    method: "POST",
    body,
    headers: {
      "Idempotency-Key": idempotencyKey,
    },
  });
}
