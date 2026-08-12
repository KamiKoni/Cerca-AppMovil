import {
  categoriesSchema,
  listingDetailSchema,
  listingsSearchResponseSchema,
  myListingsResponseSchema,
  presignPhotoResponseSchema,
  reportSchema,
  reviewsResponseSchema,
  type CreateListingInput,
  type ListingDetail,
  type ListingsSearchResponse,
  type MyListingsResponse,
  type PresignPhotoResponse,
  type ReportResponse,
  type ReviewsResponse,
  type UpdateListingInput,
} from '@cerca/contract';
import { z } from 'zod';
import { snapToGrid } from '../../domain/geo';
import type { ListingId } from '../../domain/ids';
import type { SearchFilters } from '../../domain/search';
import { apiClient } from '../api-client';

/**
 * GET /v1/listings — geospatial search.
 */
export async function searchListings(
  filters: SearchFilters,
  cursor?: string,
): Promise<ListingsSearchResponse> {
  const coords = filters.coords ? snapToGrid(filters.coords) : undefined;

  return apiClient.request('/listings', listingsSearchResponseSchema, {
    query: {
      query: filters.query,
      categoryId: filters.categoryId,
      lat: coords?.lat,
      lng: coords?.lng,
      cityId: filters.cityId,
      radiusKm: filters.radiusKm ?? 10,
      cursor,
    },
  });
}

/** GET /v1/listings/{id} */
export async function getListingDetail(id: ListingId): Promise<ListingDetail> {
  return apiClient.request(`/listings/${id}`, listingDetailSchema);
}

/** GET /v1/categories */
export async function getCategories() {
  return apiClient.request('/categories', categoriesSchema);
}

/** GET /v1/me/listings */
export async function getMyListings(): Promise<MyListingsResponse> {
  return apiClient.request('/me/listings', myListingsResponseSchema);
}

/** GET /v1/listings?favorite=true */
export async function getFavoriteListings(cursor?: string): Promise<ListingsSearchResponse> {
  return apiClient.request('/listings', listingsSearchResponseSchema, {
    query: { favorite: 'true', cursor },
  });
}

/** POST /v1/listings */
export async function createListing(input: CreateListingInput): Promise<ListingDetail> {
  return apiClient.request('/listings', listingDetailSchema, {
    method: 'POST',
    body: input,
  });
}

/** PATCH /v1/listings/{id} */
export async function updateListing(id: ListingId, input: UpdateListingInput): Promise<ListingDetail> {
  return apiClient.request(`/listings/${id}`, listingDetailSchema, {
    method: 'PATCH',
    body: input,
  });
}

/** POST /v1/listings/{id}/publish */
export async function publishListing(id: ListingId): Promise<ListingDetail> {
  return apiClient.request(`/listings/${id}/publish`, listingDetailSchema, {
    method: 'POST',
  });
}

/** POST /v1/listings/{id}/pause */
export async function pauseListing(id: ListingId): Promise<ListingDetail> {
  return apiClient.request(`/listings/${id}/pause`, listingDetailSchema, {
    method: 'POST',
  });
}

/** POST /v1/listings/{id}/photos:presign */
export async function presignPhoto(
  id: ListingId,
  fileName: string,
  contentType: string,
): Promise<PresignPhotoResponse> {
  return apiClient.request(`/listings/${id}/photos:presign`, presignPhotoResponseSchema, {
    method: 'POST',
    body: { fileName, contentType },
  });
}

/** POST /v1/listings/{id}/favorite or DELETE /v1/listings/{id}/favorite */
export async function setFavorite(id: ListingId, next: boolean): Promise<void> {
  const method = next ? 'POST' : 'DELETE';
  await apiClient.request(`/listings/${id}/favorite`, z.undefined(), { method });
}

/** POST /v1/listings/{id}/report */
export async function reportListing(id: ListingId, reason: string): Promise<ReportResponse> {
  return apiClient.request(`/listings/${id}/report`, reportSchema, {
    method: 'POST',
    body: { reason },
  });
}

/** GET /v1/listings/{id}/reviews */
export async function getListingReviews(id: ListingId, cursor?: string): Promise<ReviewsResponse> {
  return apiClient.request(`/listings/${id}/reviews`, reviewsResponseSchema, {
    query: { cursor },
  });
}
