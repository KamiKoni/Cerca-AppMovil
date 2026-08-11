import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { formatDistance, formatMoney, type ListingSummary } from '@cerca/contract';
import { ApiError } from '../domain/errors';
import { DEFAULT_SEARCH_COORDS } from '../infrastructure/config';
import { useSearchListings } from '../infrastructure/query/hooks';

const LOCALE = 'es-CO';

export function SearchScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [text, setText] = useState('');
  const query = useDebounced(text, 350);

  const search = useSearchListings({ query, coords: DEFAULT_SEARCH_COORDS, radiusKm: 10 });

  const items = search.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
        <TextInput
          placeholder={t('search.placeholder')}
          value={text}
          onChangeText={setText}
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 }}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {search.isPending ? <ActivityIndicator style={{ marginTop: 32 }} /> : null}

      {search.error ? (
        <Text style={{ color: '#c00', padding: 16 }}>{describe(search.error, t)}</Text>
      ) : null}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListingRow listing={item} onPress={() => router.push(`/listings/${item.id}`)} />
        )}
        // The server paginates by cursor; asking for the next page as the user
        // approaches the end is what makes 2000 listings feel like one list.
        onEndReached={() => {
          if (search.hasNextPage && !search.isFetchingNextPage) search.fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          search.isPending ? null : (
            <Text style={{ padding: 16, color: '#666' }}>{t('search.empty')}</Text>
          )
        }
        ListFooterComponent={
          search.isFetchingNextPage ? <ActivityIndicator style={{ margin: 16 }} /> : null
        }
      />
    </View>
  );
}

function ListingRow({ listing, onPress }: { listing: ListingSummary; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}
    >
      <Text style={{ fontSize: 16, fontWeight: '600' }}>{listing.title}</Text>
      <View style={{ flexDirection: 'row', marginTop: 6, gap: 12 }}>
        <Text style={{ color: '#111' }}>
          {/* A `quote` listing with no floor has no price to show, and inventing
              "0" would be a lie about what the provider charges. */}
          {listing.priceFrom ? formatMoney(listing.priceFrom, LOCALE) : '—'}
        </Text>
        <Text style={{ color: '#666' }}>{formatDistance(listing.distanceMeters, LOCALE)}</Text>
        {listing.ratingCount > 0 ? (
          <Text style={{ color: '#666' }}>
            {listing.ratingAvg.toFixed(1)} ({listing.ratingCount})
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

/**
 * Keeps a keystroke from becoming a request. Without it, typing "manicure"
 * fires eight searches and the cache fills with prefixes nobody asked for.
 */
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
