import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ListingId } from '../../domain/ids';
import type { SearchFilters } from '../../domain/search';
import { signIn } from '../gateways/auth-gateway';
import { getListingDetail, searchListings } from '../gateways/listings-gateway';
import { listingKeys } from './listing-keys';

/**
 * The search, paginated by the server's opaque cursor.
 *
 * `cursor` is the pageParam and deliberately never reaches `listingKeys.search`
 * — filing page 2 under a different key than page 1 would turn one search into
 * an unbounded family of cache entries.
 */
export function useSearchListings(filters: SearchFilters) {
  return useInfiniteQuery({
    queryKey: listingKeys.search(filters),
    queryFn: ({ pageParam }) => searchListings(filters, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useListingDetail(id: ListingId) {
  return useQuery({
    queryKey: listingKeys.detail(id),
    queryFn: () => getListingDetail(id),
    enabled: Boolean(id),
  });
}

/**
 * Signing in changes who the server thinks you are, so every cached response
 * from the previous session is suspect — a listing knows whether it is your
 * favourite. Clearing the cache is cheaper than reasoning about which entries
 * are personalised.
 */
export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signIn,
    onSuccess: () => queryClient.clear(),
  });
}
