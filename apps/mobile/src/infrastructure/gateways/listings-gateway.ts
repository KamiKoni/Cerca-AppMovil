import {
  listingDetailSchema,
  listingsSearchResponseSchema,
  categoriesSchema,
  type ListingDetail,
  type ListingsSearchResponse,
} from '@cerca/contract';
import { snapToGrid } from '../../domain/geo';
import type { ListingId } from '../../domain/ids';
import type { SearchFilters } from '../../domain/search';
import { apiClient } from '../api-client';

/**
 * GET /v1/listings — the geospatial search.
 *
 * Coordinates are snapped before they go out, matching what `listingKeys.search`
 * puts in the cache key. If the request and the key disagreed, every pixel of
 * map movement would fetch afresh while the cache filed the result under a
 * coordinate that was never requested.
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

/** GET /v1/listings/{id} — the detail, which carries `pricing` and `description`. */
export async function getListingDetail(id: ListingId): Promise<ListingDetail> {
  return apiClient.request(`/listings/${id}`, listingDetailSchema);
}

/** GET /v1/categories — public, cached hard by the server. */
export async function getCategories() {
  return apiClient.request('/categories', categoriesSchema);
}
