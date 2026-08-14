"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.presignPhotoResponseSchema = exports.presignPhotoRequestSchema = exports.updateListingSchema = exports.createListingSchema = exports.createReviewSchema = exports.declineBookingSchema = exports.acceptBookingSchema = exports.createBookingSchema = exports.problemDetailsSchema = exports.reportsResponseSchema = exports.reportSchema = exports.reviewsResponseSchema = exports.reviewSchema = exports.bookingsResponseSchema = exports.bookingSchema = exports.myListingsResponseSchema = exports.listingsSearchResponseSchema = exports.listingDetailSchema = exports.listingSummarySchema = exports.categoriesSchema = exports.categorySchema = exports.authSignInSchema = exports.actorSchema = exports.declineReasonSchema = exports.bookingStatusKindSchema = exports.listingStatusSchema = exports.pricingSchema = exports.pricingQuote = exports.pricingHourly = exports.pricingFixed = exports.moneySchema = void 0;
exports.toBookingStatus = toBookingStatus;
exports.toBooking = toBooking;
const zod_1 = require("zod");
exports.moneySchema = zod_1.z.object({
    amountMinor: zod_1.z
        .number()
        .int()
        .nonnegative({ message: "error.money.nonnegative" }),
    currency: zod_1.z.string().min(1, { message: "error.currency.required" }),
});
exports.pricingFixed = zod_1.z.object({
    model: zod_1.z.literal("fixed"),
    price: exports.moneySchema,
});
exports.pricingHourly = zod_1.z.object({
    model: zod_1.z.literal("hourly"),
    hourlyRate: exports.moneySchema,
    minimumHours: zod_1.z.number().int().min(1, { message: "error.minimumHours" }),
});
exports.pricingQuote = zod_1.z.object({
    model: zod_1.z.literal("quote"),
    startingFrom: exports.moneySchema.optional(),
});
exports.pricingSchema = zod_1.z.union([
    exports.pricingFixed,
    exports.pricingHourly,
    exports.pricingQuote,
]);
/**
 * The wire format the API actually sends: a flat string, not a tagged union.
 *
 * `status.ts` keeps the richer `ListingStatus` union that the domain policies
 * reason about. These are two different things — transport and domain — and
 * conflating them is what made every listing response fail to parse.
 */
exports.listingStatusSchema = zod_1.z.enum([
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
exports.bookingStatusKindSchema = zod_1.z.enum([
    "requested",
    "accepted",
    "declined",
    "completed",
    "cancelled",
]);
exports.declineReasonSchema = zod_1.z.enum([
    "unavailable",
    "not_a_fit",
    "other",
]);
exports.actorSchema = zod_1.z.object({
    id: zod_1.z.string(),
    capacities: zod_1.z.array(zod_1.z.enum(["customer", "provider"])).nonempty(),
    platformRole: zod_1.z.enum(["user", "moderator", "admin"]),
});
exports.authSignInSchema = zod_1.z.object({
    accessToken: zod_1.z.string().min(1, { message: "error.auth.accessToken" }),
    refreshToken: zod_1.z.string().min(1, { message: "error.auth.refreshToken" }),
    actor: exports.actorSchema,
});
exports.categorySchema = zod_1.z.object({
    id: zod_1.z.string(),
    slug: zod_1.z.string(),
    name: zod_1.z.string(),
});
exports.categoriesSchema = zod_1.z.array(exports.categorySchema);
/**
 * A row in the search results. Deliberately narrower than the detail: search
 * returns 2000 rows and does not carry `description` or `pricing`, only the
 * denormalized `priceFrom` the server can sort by.
 *
 * `priceFrom` is nullable and not optional — a `quote` listing with no floor has
 * no sortable price, and the server sends an explicit null for it.
 */
exports.listingSummarySchema = zod_1.z.object({
    id: zod_1.z.string(),
    title: zod_1.z.string(),
    categoryId: zod_1.z.string(),
    priceFrom: exports.moneySchema.nullable(),
    status: exports.listingStatusSchema,
    ratingAvg: zod_1.z.number(),
    ratingCount: zod_1.z.number().int().nonnegative(),
    distanceMeters: zod_1.z.number(),
    isFavorite: zod_1.z.boolean().optional(),
});
/** The single-listing response. Carries `pricing`, which search omits. */
exports.listingDetailSchema = zod_1.z.object({
    id: zod_1.z.string(),
    ownerId: zod_1.z.string(),
    categoryId: zod_1.z.string(),
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    cityId: zod_1.z.string().optional(),
    pricing: exports.pricingSchema,
    priceFrom: exports.moneySchema.nullable(),
    status: exports.listingStatusSchema,
    ratingAvg: zod_1.z.number(),
    ratingCount: zod_1.z.number().int().nonnegative(),
    isFavorite: zod_1.z.boolean().optional(),
    createdAt: zod_1.z.string(),
});
exports.listingsSearchResponseSchema = zod_1.z.object({
    items: zod_1.z.array(exports.listingSummarySchema),
    nextCursor: zod_1.z.string().nullable(),
});
exports.myListingsResponseSchema = zod_1.z.array(exports.listingDetailSchema);
/**
 * A booking as it arrives. Flat, with the timestamps beside the status rather
 * than inside it, and no `providerId` — the API does not send one.
 */
exports.bookingSchema = zod_1.z.object({
    id: zod_1.z.string(),
    listingId: zod_1.z.string(),
    customerId: zod_1.z.string(),
    status: exports.bookingStatusKindSchema,
    requestedAt: zod_1.z.string(),
    scheduledFor: zod_1.z.string().nullable(),
    completedAt: zod_1.z.string().nullable(),
    reviewId: zod_1.z.string().nullable(),
});
exports.bookingsResponseSchema = zod_1.z.object({
    items: zod_1.z.array(exports.bookingSchema),
    nextCursor: zod_1.z.string().nullable(),
});
/**
 * `body`, not `comment`. The API calls it `body` on the way in and on the way
 * out; this schema said `comment` and, because it is not strict, silently
 * accepted every response and dropped the text. Reviews rendered blank and
 * nothing reported an error.
 */
exports.reviewSchema = zod_1.z.object({
    id: zod_1.z.string(),
    bookingId: zod_1.z.string(),
    listingId: zod_1.z.string(),
    authorId: zod_1.z.string(),
    rating: zod_1.z.number().min(1).max(5),
    body: zod_1.z.string(),
    createdAt: zod_1.z.string(),
});
exports.reviewsResponseSchema = zod_1.z.object({
    items: zod_1.z.array(exports.reviewSchema),
    nextCursor: zod_1.z.string().nullable(),
});
exports.reportSchema = zod_1.z.object({
    id: zod_1.z.string(),
    listingId: zod_1.z.string(),
    reporterId: zod_1.z.string(),
    reason: zod_1.z.string(),
    createdAt: zod_1.z.string(),
    status: zod_1.z.enum(["open", "resolved"]),
});
exports.reportsResponseSchema = zod_1.z.object({
    items: zod_1.z.array(exports.reportSchema),
    nextCursor: zod_1.z.string().nullable(),
});
exports.problemDetailsSchema = zod_1.z.object({
    type: zod_1.z.string().url().optional(),
    title: zod_1.z.string(),
    status: zod_1.z.number(),
    detail: zod_1.z.string().optional(),
    instance: zod_1.z.string().optional(),
    reason: zod_1.z.string().optional(),
});
/**
 * `note`, singular, and no `scheduledFor`.
 *
 * The API's own schema is `.strict()`, so the extra key this used to send came
 * back as `422 Unrecognized key: "notes"` on every single booking request. The
 * date is not the customer's to propose: it is set by the provider when they
 * accept.
 */
exports.createBookingSchema = zod_1.z.object({
    listingId: zod_1.z.string().min(1),
    note: zod_1.z.string().max(500).optional(),
});
/** Body of `POST /bookings/{id}/accept`. The server rejects a 422 without it. */
exports.acceptBookingSchema = zod_1.z.object({
    scheduledFor: zod_1.z.string().min(1),
});
/** Body of `POST /bookings/{id}/decline`. Free text is rejected. */
exports.declineBookingSchema = zod_1.z.object({
    reason: exports.declineReasonSchema,
});
exports.createReviewSchema = zod_1.z.object({
    rating: zod_1.z.number().min(1).max(5),
    body: zod_1.z.string().min(1).max(2000),
});
exports.createListingSchema = zod_1.z.object({
    title: zod_1.z.string().min(3),
    description: zod_1.z.string().min(10),
    categoryId: zod_1.z.string().min(1),
    pricing: exports.pricingSchema,
    cityId: zod_1.z.string().optional(),
    photoKeys: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.updateListingSchema = exports.createListingSchema.partial();
exports.presignPhotoRequestSchema = zod_1.z.object({
    fileName: zod_1.z.string().min(1),
    contentType: zod_1.z.string().min(1),
});
exports.presignPhotoResponseSchema = zod_1.z.object({
    uploadUrl: zod_1.z.string().url(),
    key: zod_1.z.string().min(1),
});
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
function toBookingStatus(booking) {
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
function toBooking(response) {
    return {
        id: response.id,
        listingId: response.listingId,
        customerId: response.customerId,
        status: toBookingStatus(response),
        reviewId: response.reviewId,
    };
}
