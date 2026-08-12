import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { formatDistance, formatMoney, type ListingSummary } from '@cerca/contract';
import { ApiError } from '../domain/errors';
import { useAuthSession } from './context/AuthContext';
import { DEFAULT_SEARCH_COORDS } from '../infrastructure/config';
import { useSearchListings } from '../infrastructure/query/hooks';
import { CardSkeleton, SkeletonList } from './components/CardSkeleton';
import { CitySelectorModal, type CityOption } from './components/CitySelectorModal';

export function SearchScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { actor, becomeProvider, isLoading: authLoading } = useAuthSession();
  const [text, setText] = useState('');
  const [radiusKm, setRadiusKm] = useState(10);
  const [selectedCity, setSelectedCity] = useState<CityOption | null>(null);
  const [showCityModal, setShowCityModal] = useState(false);

  const query = useDebounced(text, 350);
  const locale = i18n.language || 'es-CO';

  const isProvider = actor?.capacities.includes('provider');
  const isModerator = actor?.platformRole === 'moderator' || actor?.platformRole === 'admin';
  const searchCoords = selectedCity ? selectedCity.coords : DEFAULT_SEARCH_COORDS;
  const cityId = selectedCity ? selectedCity.id : undefined;

  const search = useSearchListings({
    query,
    coords: searchCoords,
    cityId,
    radiusKm,
  });

  const items = search.data?.pages.flatMap((page) => page.items) ?? [];
  const isInitialState = !query && radiusKm === 10;

  return (
    <View style={styles.container}>
      {/* Top Header bar with search input and city selector */}
      <View style={styles.header}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={t('search.placeholder')}
            value={text}
            onChangeText={setText}
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel={t('search.placeholder')}
          />
        </View>

        <Pressable
          style={styles.cityBadge}
          onPress={() => setShowCityModal(true)}
          accessibilityRole="button"
          accessibilityLabel={t('search.selectCity')}
        >
          <Text style={styles.cityBadgeText}>
            📍 {selectedCity ? selectedCity.name : t('search.selectCity')}
          </Text>
        </Pressable>
      </View>

      <View style={styles.actionRowTop}>
        <Pressable
          style={styles.actionButton}
          onPress={() => router.push('/favorites' as never)}
          accessibilityRole="button"
        >
          <Text style={styles.actionText}>{t('favorites.title')}</Text>
        </Pressable>

        <Pressable
          style={styles.actionButton}
          onPress={async () => {
            if (isProvider) {
              router.push('/my-listings' as never);
              return;
            }

            try {
              await becomeProvider();
              router.push('/my-listings' as never);
            } catch {
              // Keep current screen if provider upgrade fails.
            }
          }}
          accessibilityRole="button"
          disabled={authLoading}
        >
          <Text style={styles.actionText}>
            {isProvider ? t('provider.myServices') : t('provider.becomeProvider')}
          </Text>
        </Pressable>
        {isModerator ? (
          <Pressable
            style={styles.actionButton}
            onPress={() => router.push('/moderation' as never)}
            accessibilityRole="button"
          >
            <Text style={styles.actionText}>{t('moderation.title')}</Text>
          </Pressable>
        ) : null}
      </View>

      {/* State 1: Skeleton Loading */}
      {search.isPending ? <SkeletonList count={5} /> : null}

      {/* State 2: Error State */}
      {search.error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{describe(search.error, t)}</Text>
          <Pressable style={styles.primaryButton} onPress={() => search.refetch()}>
            <Text style={styles.primaryButtonText}>{t('search.retry')}</Text>
          </Pressable>
        </View>
      ) : null}

      {/* Content list or Empty states */}
      {!search.isPending && !search.error ? (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListingCard
              listing={item}
              locale={locale}
              onPress={() => router.push(`/listings/${item.id}` as never)}
            />
          )}
          onEndReached={() => {
            if (search.hasNextPage && !search.isFetchingNextPage) search.fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            isInitialState ? (
              /* State 3: Empty Initial State */
              <View style={styles.centerContainer}>
                <Text style={styles.emptyTitle}>{t('search.emptyInitial')}</Text>
                <Pressable style={styles.secondaryButton} onPress={() => setRadiusKm(20)}>
                  <Text style={styles.secondaryButtonText}>{t('search.expandRadius')}</Text>
                </Pressable>
              </View>
            ) : (
              /* State 4: Empty Filter State */
              <View style={styles.centerContainer}>
                <Text style={styles.emptyTitle}>{t('search.emptyFilter')}</Text>
                <View style={styles.actionRow}>
                  <Pressable style={styles.primaryButton} onPress={() => setRadiusKm(20)}>
                    <Text style={styles.primaryButtonText}>{t('search.expandRadius')}</Text>
                  </Pressable>
                  <Pressable
                    style={styles.secondaryButton}
                    onPress={() => {
                      setText('');
                      setRadiusKm(10);
                    }}
                  >
                    <Text style={styles.secondaryButtonText}>{t('search.clearFilters')}</Text>
                  </Pressable>
                </View>
              </View>
            )
          }
          ListFooterComponent={
            search.isFetchingNextPage ? (
              <View style={{ paddingVertical: 16 }}>
                <CardSkeleton />
              </View>
            ) : null
          }
        />
      ) : null}

      {/* City Selector Modal for location fallback */}
      <CitySelectorModal
        visible={showCityModal}
        onClose={() => setShowCityModal(false)}
        onSelectCity={(city) => setSelectedCity(city)}
      />
    </View>
  );
}

function ListingCard({
  listing,
  locale,
  onPress,
}: {
  listing: ListingSummary;
  locale: string;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const formattedPrice = listing.priceFrom ? formatMoney(listing.priceFrom, locale) : t('listing.onQuote');
  const formattedDist = formatDistance(listing.distanceMeters, locale);
  const reviewsText =
    listing.ratingCount > 0
      ? t('listing.reviewsCount', { count: listing.ratingCount })
      : t('listing.noReviews');

  const accessibilityLabel = `${listing.title}, ${formattedPrice}, a ${formattedDist}, ${
    listing.ratingCount > 0 ? `${listing.ratingAvg.toFixed(1)} estrellas, ${reviewsText}` : t('listing.noReviews')
  }`;

  return (
    <Pressable
      onPress={onPress}
      style={styles.card}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={styles.cardTitle}>{listing.title}</Text>

      <View style={styles.cardDetailRow}>
        <Text style={styles.cardPrice}>{formattedPrice}</Text>
        <Text style={styles.cardDistance}>· {formattedDist}</Text>
        {listing.ratingCount > 0 ? (
          <Text style={styles.cardRating}>
            · ⭐ {listing.ratingAvg.toFixed(1)} ({reviewsText})
          </Text>
        ) : (
          <Text style={styles.cardRating}>· {t('listing.noReviews')}</Text>
        )}
      {listing.isFavorite ? <Text style={styles.cardFavorite}> · ❤️</Text> : null}
      </View>

      {listing.status !== 'published' ? (
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>
            {t(`listing.status.${listing.status}`, listing.status)}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

function useDebounced<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

function describe(error: unknown, t: (key: string) => string): string {
  if (error instanceof ApiError && error.kind === 'network') return t('error.network');
  return t('error.unknown');
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#111827',
  },
  cityBadge: {
    alignSelf: 'flex-start',
    minHeight: 36,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
  },
  cityBadgeText: {
    color: '#1d4ed8',
    fontWeight: '600',
    fontSize: 14,
  },
  card: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    minHeight: 64,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  cardDetailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  cardDistance: {
    fontSize: 14,
    color: '#4b5563',
  },
  cardRating: {
    fontSize: 14,
    color: '#4b5563',
  },
  cardFavorite: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '600',
  },
  statusBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
  },
  centerContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 15,
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 16,
  },
  actionRow: {
    gap: 12,
    alignItems: 'center',
  },  actionRowTop: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionButton: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: 16,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },  primaryButton: {
    minHeight: 44,
    paddingHorizontal: 20,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
  secondaryButton: {
    minHeight: 44,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 15,
  },
});
