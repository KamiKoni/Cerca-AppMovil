import type { Actor } from "../auth/actor";
import type { BookingStatus } from "../status";
export type BookingForReview = {
    id: string;
    customerId: string;
    status: BookingStatus;
    reviewId: string | null;
};
export type ReviewBlockedReason = "not_your_booking" | "not_completed" | "already_reviewed" | "window_closed";
export type ReviewEligibility = {
    ok: true;
} | {
    ok: false;
    reason: ReviewBlockedReason;
};
export declare const REVIEW_WINDOW_DAYS = 30;
export declare function canReviewBooking(actor: Actor, booking: BookingForReview, now: Date): ReviewEligibility;
