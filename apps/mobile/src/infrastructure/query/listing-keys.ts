import { snapToGrid, type Coords } from "../../domain/geo";
import type { ListingId } from "../../domain/ids";
import type { SearchFilters } from "../../domain/search";

/**
 * The canonical filter object that actually goes into a cache key. Absent and
 * empty values are dropped so `{ query: '' }`, `{ query: undefined }` and `{}`
 * all describe the same search and share one cache entry.
 */
interface CanonicalFilters {
  query?: string;
  categoryId?: string;
  coords?: Coords;
  cityId?: string;
  radiusKm?: number;
}

/**
 * Hierarchical cache keys for listings. The hierarchy is the whole point: every
 * key is prefixed by the one above it, so
 * `invalidateQueries({ queryKey: listingKeys.searches() })` matches every search
 * by prefix — no need to enumerate the filter combinations that exist.
 *
 *   all        ['listings']
 *   searches   ['listings', 'search']
 *   search(f)  ['listings', 'search', { …canonical filters… }]
 *   details    ['listings', 'detail']
 *   detail(id) ['listings', 'detail', id]
 *   mine       ['listings', 'mine']
 *
 * The trap this avoids: after toggling a favourite, invalidating only the detail
 * leaves the search results showing a stale heart. `searches()` exists so that
 * invalidation is one call, not a loop.
 */
export const listingKeys = {
  all: ["listings"] as const,
  searches: () => [...listingKeys.all, "search"] as const,
  search: (filters: SearchFilters) =>
    [...listingKeys.searches(), canonical(filters)] as const,
  details: () => [...listingKeys.all, "detail"] as const,
  detail: (id: ListingId) => [...listingKeys.details(), id] as const,
  mine: () => [...listingKeys.all, "mine"] as const,
  favorites: () => [...listingKeys.all, "favorites"] as const,
} as const;

/**
 * Normalises filters into the value that gets hashed.
 *
 * Coordinates are snapped HERE, not left to the caller: applying it at the key
 * boundary makes an unsnapped key impossible to construct. `snapToGrid` is
 * idempotent, so a caller that already snapped (to send the same coordinates in
 * the request) loses nothing by it.
 *
 * `query` is trimmed but deliberately NOT lower-cased. Case folding would merge
 * two keys into one, and if the server ever turns out to be case-sensitive that
 * merge serves the wrong cached results. Under-normalising costs a duplicate
 * cache entry; over-normalising costs correctness.
 *
 * Property order is irrelevant — React Query hashes keys with a stable
 * stringify that sorts object keys.
 */
function canonical(filters: SearchFilters): CanonicalFilters {
  const result: CanonicalFilters = {};

  const query = filters.query?.trim();
  if (query) result.query = query;
  if (filters.categoryId) result.categoryId = filters.categoryId;
  if (filters.coords) result.coords = snapToGrid(filters.coords);
  if (filters.cityId) result.cityId = filters.cityId;
  if (filters.radiusKm !== undefined) result.radiusKm = filters.radiusKm;

  return result;
}
