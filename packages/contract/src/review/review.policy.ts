import type { Actor } from "../auth/actor";
import type { BookingStatus } from "../status";

export type BookingForReview = {
  id: string;
  customerId: string;
  status: BookingStatus;
  reviewId: string | null;
};

export type ReviewBlockedReason =
  "not_your_booking" | "not_completed" | "already_reviewed" | "window_closed";
export type ReviewEligibility =
  { ok: true } | { ok: false; reason: ReviewBlockedReason };

export const REVIEW_WINDOW_DAYS = 30;

export function canReviewBooking(
  actor: Actor,
  booking: BookingForReview,
  now: Date,
): ReviewEligibility {
  if (booking.customerId !== actor.id)
    return { ok: false, reason: "not_your_booking" };
  if (booking.status.kind !== "completed")
    return { ok: false, reason: "not_completed" };
  if (booking.reviewId !== null)
    return { ok: false, reason: "already_reviewed" };
  const completedTime = new Date(booking.status.completedAt).getTime();
  const nowTime = now.getTime();
  const windowMs = REVIEW_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  if (nowTime - completedTime > windowMs)
    return { ok: false, reason: "window_closed" };
  return { ok: true };
}
