import { z } from "zod";
import type { BookingStatus } from "./status";

export const moneySchema = z.object({
  amountMinor: z
    .number()
    .int()
    .nonnegative({ message: "error.money.nonnegative" }),
  currency: z.string().min(1, { message: "error.currency.required" }),
});

export const pricingFixed = z.object({
  model: z.literal("fixed"),
  price: moneySchema,
});

export const pricingHourly = z.object({
  model: z.literal("hourly"),
  hourlyRate: moneySchema,
  minimumHours: z.number().int().min(1, { message: "error.minimumHours" }),
});

export const pricingQuote = z.object({
  model: z.literal("quote"),
  startingFrom: moneySchema.optional(),
});

export const pricingSchema = z.union([
  pricingFixed,
  pricingHourly,
  pricingQuote,
]);

/**
 * The wire format the API actually sends: a flat string, not a tagged union.
 *
 * `status.ts` keeps the richer `ListingStatus` union that the domain policies
 * reason about. These are two different things — transport and domain — and
 * conflating them is what made every listing response fail to parse.
 */
export const listingStatusSchema = z.enum([
  "draft",
  "published",
  "paused",
  "under_review",
  "removed",
]);

/**
 * The status field exactly as the API sends it: one of five strings.
 *
 * It used to be modelled here as a discriminated union, which meant
 * `bookingSchema.parse` rejected every real response with
 * "Expected object, received string" — the booking list could not read its own
 * data. The union still exists, as `BookingStatus`, on the far side of
 * `toBookingStatus`.
 */
export const bookingStatusKindSchema = z.enum([
  "requested",
  "accepted",
  "declined",
  "completed",
  "cancelled",
]);

export const declineReasonSchema = z.enum([
  "unavailable",
  "not_a_fit",
  "other",
]);

export const actorSchema = z.object({
  id: z.string(),
  capacities: z.array(z.enum(["customer", "provider"])).nonempty(),
  platformRole: z.enum(["user", "moderator", "admin"]),
});

export const authSignInSchema = z.object({
  accessToken: z.string().min(1, { message: "error.auth.accessToken" }),
  refreshToken: z.string().min(1, { message: "error.auth.refreshToken" }),
  actor: actorSchema,
});

export const categorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
});

export type Category = z.infer<typeof categorySchema>;

export const categoriesSchema = z.array(categorySchema);

/**
 * A row in the search results. Deliberately narrower than the detail: search
 * returns 2000 rows and does not carry `description` or `pricing`, only the
 * denormalized `priceFrom` the server can sort by.
 *
 * `priceFrom` is nullable and not optional — a `quote` listing with no floor has
 * no sortable price, and the server sends an explicit null for it.
 */
export const listingSummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  categoryId: z.string(),
  priceFrom: moneySchema.nullable(),
  status: listingStatusSchema,
  ratingAvg: z.number(),
  ratingCount: z.number().int().nonnegative(),
  distanceMeters: z.number(),
  isFavorite: z.boolean().optional(),
});

/** The single-listing response. Carries `pricing`, which search omits. */
export const listingDetailSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  categoryId: z.string(),
  title: z.string(),
  description: z.string(),
  cityId: z.string().optional(),
  pricing: pricingSchema,
  priceFrom: moneySchema.nullable(),
  status: listingStatusSchema,
  ratingAvg: z.number(),
  ratingCount: z.number().int().nonnegative(),
  isFavorite: z.boolean().optional(),
  createdAt: z.string(),
});

export const listingsSearchResponseSchema = z.object({
  items: z.array(listingSummarySchema),
  nextCursor: z.string().nullable(),
});

export const myListingsResponseSchema = z.array(listingDetailSchema);

/**
 * A booking as it arrives. Flat, with the timestamps beside the status rather
 * than inside it, and no `providerId` — the API does not send one.
 */
export const bookingSchema = z.object({
  id: z.string(),
  listingId: z.string(),
  customerId: z.string(),
  status: bookingStatusKindSchema,
  requestedAt: z.string(),
  scheduledFor: z.string().nullable(),
  completedAt: z.string().nullable(),
  reviewId: z.string().nullable(),
});

export const bookingsResponseSchema = z.object({
  items: z.array(bookingSchema),
  nextCursor: z.string().nullable(),
});

/**
 * `body`, not `comment`. The API calls it `body` on the way in and on the way
 * out; this schema said `comment` and, because it is not strict, silently
 * accepted every response and dropped the text. Reviews rendered blank and
 * nothing reported an error.
 */
export const reviewSchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  listingId: z.string(),
  authorId: z.string(),
  rating: z.number().min(1).max(5),
  body: z.string(),
  createdAt: z.string(),
});

export const reviewsResponseSchema = z.object({
  items: z.array(reviewSchema),
  nextCursor: z.string().nullable(),
});

export const reportSchema = z.object({
  id: z.string(),
  listingId: z.string(),
  reporterId: z.string(),
  reason: z.string(),
  createdAt: z.string(),
  status: z.enum(["open", "resolved"]),
});

export const reportsResponseSchema = z.object({
  items: z.array(reportSchema),
  nextCursor: z.string().nullable(),
});

export const problemDetailsSchema = z.object({
  type: z.string().url().optional(),
  title: z.string(),
  status: z.number(),
  detail: z.string().optional(),
  instance: z.string().optional(),
  reason: z.string().optional(),
});

/**
 * `note`, singular, and no `scheduledFor`.
 *
 * The API's own schema is `.strict()`, so the extra key this used to send came
 * back as `422 Unrecognized key: "notes"` on every single booking request. The
 * date is not the customer's to propose: it is set by the provider when they
 * accept.
 */
export const createBookingSchema = z.object({
  listingId: z.string().min(1),
  note: z.string().max(500).optional(),
});

/** Body of `POST /bookings/{id}/accept`. The server rejects a 422 without it. */
export const acceptBookingSchema = z.object({
  scheduledFor: z.string().min(1),
});

/** Body of `POST /bookings/{id}/decline`. Free text is rejected. */
export const declineBookingSchema = z.object({
  reason: declineReasonSchema,
});

export const createReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  body: z.string().min(1).max(2000),
});

export const createListingSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  categoryId: z.string().min(1),
  pricing: pricingSchema,
  cityId: z.string().optional(),
  photoKeys: z.array(z.string()).optional(),
});

export const updateListingSchema = createListingSchema.partial();

export const presignPhotoRequestSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
});

export const presignPhotoResponseSchema = z.object({
  uploadUrl: z.string().url(),
  key: z.string().min(1),
});

export type PricingSchemaType = z.infer<typeof pricingSchema>;
export type ListingSummary = z.infer<typeof listingSummarySchema>;
export type ListingDetail = z.infer<typeof listingDetailSchema>;
export type ListingsSearchResponse = z.infer<
  typeof listingsSearchResponseSchema
>;
export type MyListingsResponse = z.infer<typeof myListingsResponseSchema>;
export type BookingResponse = z.infer<typeof bookingSchema>;
export type BookingsResponse = z.infer<typeof bookingsResponseSchema>;
export type ReviewResponse = z.infer<typeof reviewSchema>;
export type ReviewsResponse = z.infer<typeof reviewsResponseSchema>;
export type ReportResponse = z.infer<typeof reportSchema>;
export type ReportsResponse = z.infer<typeof reportsResponseSchema>;
export type ProblemDetails = z.infer<typeof problemDetailsSchema>;
export type ActorResponse = z.infer<typeof actorSchema>;
export type AuthSignInResponse = z.infer<typeof authSignInSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type PresignPhotoResponse = z.infer<typeof presignPhotoResponseSchema>;

export type BookingStatusKind = z.infer<typeof bookingStatusKindSchema>;
export type DeclineReason = z.infer<typeof declineReasonSchema>;
export type AcceptBookingInput = z.infer<typeof acceptBookingSchema>;
export type DeclineBookingInput = z.infer<typeof declineBookingSchema>;

/**
 * The one crossing between the wire and the domain.
 *
 * The API leaves `scheduledFor` and `completedAt` nullable regardless of the
 * status, so `{ status: "accepted", scheduledFor: null }` is a value it can
 * technically produce. The union exists precisely so the rest of the app never
 * has to consider that combination, and this function is where it is ruled out:
 * a state whose timestamp is missing is reported as the state before it, rather
 * than as an accepted booking with no date.
 */
export function toBookingStatus(booking: BookingResponse): BookingStatus {
  switch (booking.status) {
    case "requested":
      return { kind: "requested", requestedAt: booking.requestedAt };

    case "accepted":
      return booking.scheduledFor
        ? {
            kind: "accepted",
            acceptedAt: booking.requestedAt,
            scheduledFor: booking.scheduledFor,
          }
        : { kind: "requested", requestedAt: booking.requestedAt };

    case "completed":
      return booking.completedAt
        ? { kind: "completed", completedAt: booking.completedAt }
        : { kind: "requested", requestedAt: booking.requestedAt };

    case "declined":
      return { kind: "declined" };

    case "cancelled":
      return { kind: "cancelled" };
  }
}

/** A booking with its status as the union, which is what screens work with. */
export interface Booking {
  readonly id: string;
  readonly listingId: string;
  readonly customerId: string;
  readonly status: BookingStatus;
  readonly reviewId: string | null;
}

export function toBooking(response: BookingResponse): Booking {
  return {
    id: response.id,
    listingId: response.listingId,
    customerId: response.customerId,
    status: toBookingStatus(response),
    reviewId: response.reviewId,
  };
}
