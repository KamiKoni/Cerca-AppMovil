"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REVIEW_WINDOW_DAYS = void 0;
exports.canReviewBooking = canReviewBooking;
exports.REVIEW_WINDOW_DAYS = 30;
function canReviewBooking(actor, booking, now) {
    if (booking.customerId !== actor.id)
        return { ok: false, reason: "not_your_booking" };
    if (booking.status.kind !== "completed")
        return { ok: false, reason: "not_completed" };
    if (booking.reviewId !== null)
        return { ok: false, reason: "already_reviewed" };
    const completedTime = new Date(booking.status.completedAt).getTime();
    const nowTime = now.getTime();
    const windowMs = exports.REVIEW_WINDOW_DAYS * 24 * 60 * 60 * 1000;
    if (nowTime - completedTime > windowMs)
        return { ok: false, reason: "window_closed" };
    return { ok: true };
}
