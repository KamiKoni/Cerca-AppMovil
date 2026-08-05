import { z } from 'zod';

export const moneySchema = z.object({
  amountMinor: z.number().int().nonnegative({ message: 'error.money.nonnegative' }),
  currency: z.string().min(1, { message: 'error.currency.required' }),
});

export const pricingFixed = z.object({
  model: z.literal('fixed'),
  price: moneySchema,
});

export const pricingHourly = z.object({
  model: z.literal('hourly'),
  hourlyRate: moneySchema,
  minimumHours: z.number().int().min(1, { message: 'error.minimumHours' }),
});

export const pricingQuote = z.object({
  model: z.literal('quote'),
  startingFrom: moneySchema.optional(),
});

export const pricingSchema = z.union([pricingFixed, pricingHourly, pricingQuote]);

export const listingStatusSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('draft') }),
  z.object({ kind: z.literal('published'), publishedAt: z.string() }),
  z.object({ kind: z.literal('paused') }),
  z.object({ kind: z.literal('under_review'), reportId: z.string() }),
  z.object({ kind: z.literal('removed'), removedBy: z.string(), reason: z.string() }),
]);

export const bookingStatusSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('requested'), requestedAt: z.string() }),
  z.object({ kind: z.literal('accepted'), acceptedAt: z.string(), scheduledFor: z.string() }),
  z.object({ kind: z.literal('declined'), reason: z.string() }),
  z.object({ kind: z.literal('completed'), completedAt: z.string() }),
  z.object({ kind: z.literal('cancelled'), cancelledBy: z.string(), at: z.string() }),
]);

export const actorSchema = z.object({
  id: z.string(),
  capacities: z.array(z.enum(['customer', 'provider'])).nonempty(),
  platformRole: z.enum(['user', 'moderator', 'admin']),
});

export const authSignInSchema = z.object({
  accessToken: z.string().min(1, { message: 'error.auth.accessToken' }),
  refreshToken: z.string().min(1, { message: 'error.auth.refreshToken' }),
  actor: actorSchema,
});

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const categoriesSchema = z.array(categorySchema);

export const listingSummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  categoryId: z.string(),
  ownerId: z.string(),
  price: pricingSchema,
  distanceMeters: z.number().nonnegative(),
  isFavorite: z.boolean().optional(),
  status: listingStatusSchema,
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().nonnegative().optional(),
});

export const listingDetailSchema = listingSummarySchema.extend({
  photos: z.array(z.string()).optional(),
  location: z.object({ lat: z.number(), lng: z.number() }),
  createdAt: z.string().optional(),
  description: z.string().optional(),
});

export const listingsSearchResponseSchema = z.object({
  items: z.array(listingSummarySchema),
  nextCursor: z.string().nullable(),
});

export const myListingsResponseSchema = z.array(listingDetailSchema);

export const bookingSchema = z.object({
  id: z.string(),
  listingId: z.string(),
  customerId: z.string(),
  providerId: z.string(),
  status: bookingStatusSchema,
  reviewId: z.string().nullable(),
  createdAt: z.string().optional(),
});

export const bookingsResponseSchema = z.object({
  items: z.array(bookingSchema),
  nextCursor: z.string().nullable(),
});

export const reviewSchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  listingId: z.string(),
  authorId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
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
  status: z.enum(['open', 'resolved']),
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

export type PricingSchemaType = z.infer<typeof pricingSchema>;
export type ListingSummary = z.infer<typeof listingSummarySchema>;
export type ListingDetail = z.infer<typeof listingDetailSchema>;
export type ListingsSearchResponse = z.infer<typeof listingsSearchResponseSchema>;
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
