import {
  bookingSchema,
  bookingsResponseSchema,
  reviewSchema,
  type BookingResponse,
  type BookingsResponse,
  type CreateBookingInput,
  type CreateReviewInput,
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
  return apiClient.request("/bookings", bookingSchema, {
    method: "POST",
    body: input,
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

/** POST /v1/bookings/{id}/accept */
export async function acceptBooking(id: string): Promise<BookingResponse> {
  return apiClient.request(`/bookings/${id}/accept`, bookingSchema, {
    method: "POST",
  });
}

/** POST /v1/bookings/{id}/decline */
export async function declineBooking(
  id: string,
  reason: string,
): Promise<BookingResponse> {
  return apiClient.request(`/bookings/${id}/decline`, bookingSchema, {
    method: "POST",
    body: { reason },
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
  return apiClient.request(`/bookings/${bookingId}/review`, reviewSchema, {
    method: "POST",
    body: input,
    headers: {
      "Idempotency-Key": idempotencyKey,
    },
  });
}
