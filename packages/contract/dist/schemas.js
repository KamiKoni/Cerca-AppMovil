"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.problemDetailsSchema = exports.reportsResponseSchema = exports.reportSchema = exports.reviewsResponseSchema = exports.reviewSchema = exports.bookingsResponseSchema = exports.bookingSchema = exports.myListingsResponseSchema = exports.listingsSearchResponseSchema = exports.listingDetailSchema = exports.listingSummarySchema = exports.categoriesSchema = exports.categorySchema = exports.authSignInSchema = exports.actorSchema = exports.bookingStatusSchema = exports.listingStatusSchema = exports.pricingSchema = exports.pricingQuote = exports.pricingHourly = exports.pricingFixed = exports.moneySchema = void 0;
const zod_1 = require("zod");
exports.moneySchema = zod_1.z.object({
    amountMinor: zod_1.z.number().int().nonnegative({ message: 'error.money.nonnegative' }),
    currency: zod_1.z.string().min(1, { message: 'error.currency.required' }),
});
exports.pricingFixed = zod_1.z.object({
    model: zod_1.z.literal('fixed'),
    price: exports.moneySchema,
});
exports.pricingHourly = zod_1.z.object({
    model: zod_1.z.literal('hourly'),
    hourlyRate: exports.moneySchema,
    minimumHours: zod_1.z.number().int().min(1, { message: 'error.minimumHours' }),
});
exports.pricingQuote = zod_1.z.object({
    model: zod_1.z.literal('quote'),
    startingFrom: exports.moneySchema.optional(),
});
exports.pricingSchema = zod_1.z.union([exports.pricingFixed, exports.pricingHourly, exports.pricingQuote]);
exports.listingStatusSchema = zod_1.z.discriminatedUnion('kind', [
    zod_1.z.object({ kind: zod_1.z.literal('draft') }),
    zod_1.z.object({ kind: zod_1.z.literal('published'), publishedAt: zod_1.z.string() }),
    zod_1.z.object({ kind: zod_1.z.literal('paused') }),
    zod_1.z.object({ kind: zod_1.z.literal('under_review'), reportId: zod_1.z.string() }),
    zod_1.z.object({ kind: zod_1.z.literal('removed'), removedBy: zod_1.z.string(), reason: zod_1.z.string() }),
]);
exports.bookingStatusSchema = zod_1.z.discriminatedUnion('kind', [
    zod_1.z.object({ kind: zod_1.z.literal('requested'), requestedAt: zod_1.z.string() }),
    zod_1.z.object({ kind: zod_1.z.literal('accepted'), acceptedAt: zod_1.z.string(), scheduledFor: zod_1.z.string() }),
    zod_1.z.object({ kind: zod_1.z.literal('declined'), reason: zod_1.z.string() }),
    zod_1.z.object({ kind: zod_1.z.literal('completed'), completedAt: zod_1.z.string() }),
    zod_1.z.object({ kind: zod_1.z.literal('cancelled'), cancelledBy: zod_1.z.string(), at: zod_1.z.string() }),
]);
exports.actorSchema = zod_1.z.object({
    id: zod_1.z.string(),
    capacities: zod_1.z.array(zod_1.z.enum(['customer', 'provider'])).nonempty(),
    platformRole: zod_1.z.enum(['user', 'moderator', 'admin']),
});
exports.authSignInSchema = zod_1.z.object({
    accessToken: zod_1.z.string().min(1, { message: 'error.auth.accessToken' }),
    refreshToken: zod_1.z.string().min(1, { message: 'error.auth.refreshToken' }),
    actor: exports.actorSchema,
});
exports.categorySchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
});
exports.categoriesSchema = zod_1.z.array(exports.categorySchema);
exports.listingSummarySchema = zod_1.z.object({
    id: zod_1.z.string(),
    title: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    categoryId: zod_1.z.string(),
    ownerId: zod_1.z.string(),
    price: exports.pricingSchema,
    distanceMeters: zod_1.z.number().nonnegative(),
    isFavorite: zod_1.z.boolean().optional(),
    status: exports.listingStatusSchema,
    rating: zod_1.z.number().min(0).max(5).optional(),
    reviewCount: zod_1.z.number().int().nonnegative().optional(),
});
exports.listingDetailSchema = exports.listingSummarySchema.extend({
    photos: zod_1.z.array(zod_1.z.string()).optional(),
    location: zod_1.z.object({ lat: zod_1.z.number(), lng: zod_1.z.number() }),
    createdAt: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
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
    status: zod_1.z.enum(['open', 'resolved']),
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
