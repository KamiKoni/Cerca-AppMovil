import type { Actor, BookingForReview, ReviewEligibility } from '@cerca/contract';
import { canReviewBooking, canEditListing } from '@cerca/contract';

export function canUserReviewBooking(actor: Actor, booking: BookingForReview, now: Date): ReviewEligibility {
  return canReviewBooking(actor, booking, now);
}

export function canUserEditListing(actor: Actor, listing: { ownerId: string }): boolean {
  return canEditListing(actor, listing);
}
