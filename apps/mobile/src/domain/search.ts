import type { Coords } from "./geo";
import type { CategoryId } from "./ids";

/**
 * What a search is made of. Mirrors the query parameters of GET /v1/listings,
 * minus pagination on purpose: `cursor` is the infinite query's pageParam and
 * must never enter the cache key, or page 2 would be filed as a different search.
 *
 * The server requires `coords` OR `cityId`; with neither it answers
 * 422 LOCATION_REQUIRED. That is what makes the "location denied" path (US-08) a
 * functional requirement rather than a nicety — without a city fallback the
 * search screen simply cannot work.
 */
export interface SearchFilters {
  readonly query?: string;
  readonly categoryId?: CategoryId;
  readonly coords?: Coords;
  readonly cityId?: string;
  readonly radiusKm?: number;
}
