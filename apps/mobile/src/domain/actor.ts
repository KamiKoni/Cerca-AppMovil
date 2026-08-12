import type {
  Actor,
  Capacity,
  OwnableResource,
  Permission,
  PlatformRole,
  BookingForReview,
  ReviewEligibility,
} from "@cerca/contract";
import { can, has, canEditListing, canReviewBooking } from "@cerca/contract";

export type {
  Actor,
  Capacity,
  PlatformRole,
  Permission,
  OwnableResource,
  BookingForReview,
  ReviewEligibility,
};

export const hasCapacity = has;
export const canPerform = can;
export const canEditOwnListing = canEditListing;
export const reviewBookingEligibility = canReviewBooking;

export function isProvider(actor: Actor): boolean {
  return actor.capacities.includes("provider");
}
