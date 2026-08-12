import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateBookingInput, CreateListingInput, CreateReviewInput, ListingDetail } from '@cerca/contract';
import type { ListingId } from '../../domain/ids';
import type { SearchFilters } from '../../domain/search';
import { signIn, signOut } from '../gateways/auth-gateway';
import {
  acceptBooking,
  cancelBooking,
  completeBooking,
  createBooking,
  declineBooking,
  getBookingDetail,
  getBookings,
  submitReview,
} from '../gateways/bookings-gateway';
import {
  createListing,
  getFavoriteListings,
  getListingDetail,
  getListingReviews,
  getMyListings,
  pauseListing,
  publishListing,
  searchListings,
  setFavorite,
  updateListing,
} from '../gateways/listings-gateway';
import { addProviderCapacity, getMe } from '../gateways/me-gateway';
import { getReports, moderateListing, resolveReport } from '../gateways/moderation-gateway';
import { listingKeys } from './listing-keys';

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddProviderCapacity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProviderCapacity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
}

export function useSearchListings(filters: SearchFilters) {
  return useInfiniteQuery({
    queryKey: listingKeys.search(filters),
    queryFn: ({ pageParam }) => searchListings(filters, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useListingDetail(id: ListingId) {
  return useQuery<ListingDetail>({
    queryKey: listingKeys.detail(id),
    queryFn: () => getListingDetail(id),
    enabled: Boolean(id),
  });
}

export function useMyListings() {
  return useQuery({
    queryKey: listingKeys.mine(),
    queryFn: getMyListings,
  });
}

export function useFavoriteListings(enabled = true) {
  return useInfiniteQuery({
    enabled,
    queryKey: listingKeys.favorites(),
    queryFn: ({ pageParam }) => getFavoriteListings(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateListingInput) => createListing(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingKeys.mine() });
      queryClient.invalidateQueries({ queryKey: listingKeys.searches() });
    },
  });
}

export function useUpdateListing(id: ListingId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<CreateListingInput>) => updateListing(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: listingKeys.mine() });
      queryClient.invalidateQueries({ queryKey: listingKeys.searches() });
    },
  });
}

export function usePublishListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: ListingId) => publishListing(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: listingKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: listingKeys.mine() });
      queryClient.invalidateQueries({ queryKey: listingKeys.searches() });
    },
  });
}

export function usePauseListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: ListingId) => pauseListing(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: listingKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: listingKeys.mine() });
      queryClient.invalidateQueries({ queryKey: listingKeys.searches() });
    },
  });
}

/** Optimistic favorite mutation with rollback & full search invalidation */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, next }: { id: ListingId; next: boolean }) => setFavorite(id, next),
    onMutate: async ({ id, next }) => {
      await queryClient.cancelQueries({ queryKey: listingKeys.detail(id) });
      const prev = queryClient.getQueryData<ListingDetail>(listingKeys.detail(id));
      queryClient.setQueryData<ListingDetail | undefined>(listingKeys.detail(id), (old) =>
        old ? { ...old, isFavorite: next } : old,
      );
      return { prev };
    },
    onError: (_err, { id }, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(listingKeys.detail(id), ctx.prev);
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: listingKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: listingKeys.searches() });
      queryClient.invalidateQueries({ queryKey: listingKeys.favorites() });
    },
  });
}

export function useBookings(role: 'customer' | 'provider') {
  return useInfiniteQuery({
    queryKey: ['bookings', role],
    queryFn: ({ pageParam }) => getBookings(role, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useBookingDetail(id: string) {
  return useQuery({
    queryKey: ['bookings', 'detail', id],
    queryFn: () => getBookingDetail(id),
    enabled: Boolean(id),
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ input, idempotencyKey }: { input: CreateBookingInput; idempotencyKey: string }) =>
      createBooking(input, idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useAcceptBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => acceptBooking(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'detail', id] });
    },
  });
}

export function useDeclineBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => declineBooking(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'detail', id] });
    },
  });
}

export function useCompleteBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => completeBooking(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'detail', id] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => cancelBooking(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'detail', id] });
    },
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookingId,
      input,
      idempotencyKey,
    }: {
      bookingId: string;
      input: CreateReviewInput;
      idempotencyKey: string;
    }) => submitReview(bookingId, input, idempotencyKey),
    onSuccess: (_, { bookingId }) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'detail', bookingId] });
      queryClient.invalidateQueries({ queryKey: listingKeys.all });
    },
  });
}

export function useListingReviews(listingId: ListingId) {
  return useInfiniteQuery({
    queryKey: ['reviews', listingId],
    queryFn: ({ pageParam }) => getListingReviews(listingId, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: Boolean(listingId),
  });
}

export function useReports() {
  return useInfiniteQuery({
    queryKey: ['reports'],
    queryFn: ({ pageParam }) => getReports(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useResolveReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resolveReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useModerateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      listingId,
      status,
      reason,
    }: {
      listingId: string;
      status: 'under_review' | 'removed';
      reason?: string;
    }) => moderateListing(listingId, status, reason),
    onSuccess: (_, { listingId }) => {
      queryClient.invalidateQueries({ queryKey: listingKeys.detail(listingId) });
      queryClient.invalidateQueries({ queryKey: listingKeys.searches() });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useSignIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signIn,
    onSuccess: () => queryClient.clear(),
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signOut,
    onSuccess: () => queryClient.clear(),
  });
}
