"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.presignPhotoResponseSchema = exports.presignPhotoRequestSchema = exports.updateListingSchema = exports.createListingSchema = exports.createReviewSchema = exports.createBookingSchema = exports.problemDetailsSchema = exports.reportsResponseSchema = exports.reportSchema = exports.reviewsResponseSchema = exports.reviewSchema = exports.bookingsResponseSchema = exports.bookingSchema = exports.myListingsResponseSchema = exports.listingsSearchResponseSchema = exports.listingDetailSchema = exports.listingSummarySchema = exports.categoriesSchema = exports.categorySchema = exports.authSignInSchema = exports.actorSchema = exports.bookingStatusSchema = exports.listingStatusSchema = exports.pricingSchema = exports.pricingQuote = exports.pricingHourly = exports.pricingFixed = exports.moneySchema = void 0;
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
exports.bookingStatusSchema = zod_1.z.discriminatedUnion("kind", [
    zod_1.z.object({ kind: zod_1.z.literal("requested"), requestedAt: zod_1.z.string() }),
    zod_1.z.object({
        kind: zod_1.z.literal("accepted"),
        acceptedAt: zod_1.z.string(),
        scheduledFor: zod_1.z.string(),
    }),
    zod_1.z.object({ kind: zod_1.z.literal("declined"), reason: zod_1.z.string() }),
    zod_1.z.object({ kind: zod_1.z.literal("completed"), completedAt: zod_1.z.string() }),
    zod_1.z.object({
        kind: zod_1.z.literal("cancelled"),
        cancelledBy: zod_1.z.string(),
        at: zod_1.z.string(),
    }),
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
exports.bookingSchema = zod_1.z.object({
    id: zod_1.z.string(),
    listingId: zod_1.z.string(),
    customerId: zod_1.z.string(),
    providerId: zod_1.z.string(),
    status: exports.bookingStatusSchema,
    reviewId: zod_1.z.string().nullable(),
    createdAt: zod_1.z.string().optional(),
});
exports.bookingsResponseSchema = zod_1.z.object({
    items: zod_1.z.array(exports.bookingSchema),
    nextCursor: zod_1.z.string().nullable(),
});
exports.reviewSchema = zod_1.z.object({
    id: zod_1.z.string(),
    bookingId: zod_1.z.string(),
    listingId: zod_1.z.string(),
    authorId: zod_1.z.string(),
    rating: zod_1.z.number().min(1).max(5),
    comment: zod_1.z.string().optional(),
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
exports.createBookingSchema = zod_1.z.object({
    listingId: zod_1.z.string().min(1),
    scheduledFor: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
});
exports.createReviewSchema = zod_1.z.object({
    rating: zod_1.z.number().min(1).max(5),
    comment: zod_1.z.string().optional(),
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
