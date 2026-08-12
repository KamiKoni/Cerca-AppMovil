import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import {
  formatDistance,
  formatMoney,
  type ListingSummary,
  type Category,
} from "@cerca/contract";
import type { Coords } from "../domain/geo";
import type { LocationResult } from "../application/ports/location-provider";
import { ApiError } from "../domain/errors";
import { useCan, Can } from "./authorization";
import { useSession } from "./SessionProvider";
import { useAppStateChange } from "./useForegroundLocationRetry";
import { DEFAULT_SEARCH_COORDS } from "../infrastructure/config";
import {
  ExpoLocationAdapter,
  openSettings,
} from "../infrastructure/location/expo-location-adapter";
import {
  getSelectedCity,
  saveSelectedCity,
} from "../infrastructure/storage/city-storage";
import {
  useAddProviderCapacity,
  useCategories,
  useSearchListings,
} from "../infrastructure/query/hooks";
import { CardSkeleton, SkeletonList } from "./components/CardSkeleton";
import {
  CitySelectorModal,
  type CityOption,
} from "./components/CitySelectorModal";
import { withCapacity } from "./authorization";

const locationAdapter = new ExpoLocationAdapter();

export function SearchScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { signedIn } = useSession();
  const becomeProvider = useAddProviderCapacity();
  const categories = useCategories();
  const [text, setText] = useState("");
  const [radiusKm, setRadiusKm] = useState(10);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [selectedCity, setSelectedCity] = useState<CityOption | null>(null);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [deviceCoords, setDeviceCoords] = useState<Coords | null>(null);
  const [locationStatus, setLocationStatus] = useState<
    "pending" | "granted" | "fallback"
  >("pending");
  const [canOpenSettings, setCanOpenSettings] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);

  const query = useDebounced(text, 350);
  const locale = i18n.language || "es-CO";

  const isProvider = withCapacity("provider");
  const isModerator = useCan("listing:moderate");
  const isLoading = becomeProvider.isPending;
  const useDeviceLocation =
    locationStatus === "granted" && deviceCoords !== null;
  const searchCoords = useDeviceLocation
    ? deviceCoords!
    : selectedCity
      ? selectedCity.coords
      : DEFAULT_SEARCH_COORDS;
  const cityId = useDeviceLocation
    ? undefined
    : selectedCity
      ? selectedCity.id
      : undefined;

  const selectedCategory = useMemo(
    () => categories.data?.find((item) => item.id === categoryId),
    [categories.data, categoryId],
  );

  const handleLocationResult = useCallback(
    (result: LocationResult) => {
      if (result.status === "granted") {
        setDeviceCoords(result.coords);
        setLocationStatus("granted");
        setLocationMessage(t("search.usingDeviceLocation"));
        setCanOpenSettings(false);
        return;
      }

      const fallbackMessage =
        result.status === "denied"
          ? result.canAskAgain
            ? t("search.locationDenied")
            : t("search.locationDeniedPermanent")
          : t("search.locationUnavailable");

      setLocationStatus("fallback");
      setLocationMessage(fallbackMessage);
      setCanOpenSettings(result.status === "denied" && !result.canAskAgain);
      if (!selectedCity) setShowCityModal(true);
    },
    [selectedCity, t],
  );

  useAppStateChange(() => {
    if (locationStatus !== "granted") {
      void locationAdapter.checkStatus().then((result) => {
        if (result.status === "granted") {
          handleLocationResult(result);
        }
      });
    }
  });

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const persistedCity = await getSelectedCity();
      if (cancelled) return;

      if (persistedCity) {
        setSelectedCity(persistedCity);
        setLocationStatus("fallback");
        setLocationMessage(t("search.usingCity", { city: persistedCity.name }));
        return;
      }

      const locationResult = await locationAdapter.getLocation();
      if (cancelled) return;
      handleLocationResult(locationResult);
    })();

    return () => {
      cancelled = true;
    };
  }, [handleLocationResult, t]);

  const filters = useMemo(
    () => ({
      query,
      coords: searchCoords,
      cityId,
      radiusKm,
      categoryId,
    }),
    [query, searchCoords, cityId, radiusKm, categoryId],
  );

  const search = useSearchListings(filters);

  const items = search.data?.pages.flatMap((page) => page.items) ?? [];
  const isInitialState = !query && radiusKm === 10;
  const cityLabel = useDeviceLocation
    ? t("search.currentLocation")
    : selectedCity
      ? selectedCity.name
      : t("search.selectCity");

  return (
    <View style={styles.container}>
      {locationMessage ? (
        <View style={styles.locationBanner}>
          <Text style={styles.locationBannerText}>{locationMessage}</Text>
          {canOpenSettings ? (
            <Pressable
              style={styles.locationBannerButton}
              onPress={openSettings}
              accessibilityRole="button"
            >
              <Text style={styles.locationBannerButtonText}>
                {t("search.openSettings")}
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
      {/* Top Header bar with search input and city selector */}
      <View style={styles.header}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={t("search.placeholder")}
            value={text}
            onChangeText={setText}
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel={t("search.placeholder")}
          />
        </View>

        <View style={styles.headerBadgeRow}>
          <Pressable
            style={styles.cityBadge}
            onPress={() => setShowCityModal(true)}
            accessibilityRole="button"
            accessibilityLabel={t("search.selectCity")}
          >
            <Text style={styles.cityBadgeText}>📍 {cityLabel}</Text>
          </Pressable>
          <Pressable
            style={styles.filterBadge}
            onPress={() => setShowFilterModal(true)}
            accessibilityRole="button"
            accessibilityLabel={t("search.filters")}
          >
            <Text style={styles.filterBadgeText}>
              {selectedCategory?.name ?? t("search.allCategories")} · {radiusKm}{" "}
              km
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.actionRowTop}>
        <Pressable
          style={styles.actionButton}
          onPress={() => router.push("/favorites" as never)}
          accessibilityRole="button"
        >
          <Text style={styles.actionText}>{t("favorites.title")}</Text>
        </Pressable>

        <Pressable
          style={styles.actionButton}
          onPress={async () => {
            if (isProvider) {
              router.push("/my-listings" as never);
              return;
            }

            try {
              const updated = await becomeProvider.mutateAsync();
              await signedIn(updated);
              router.push("/my-listings" as never);
            } catch {
              // Keep current screen if provider upgrade fails.
            }
          }}
          accessibilityRole="button"
          disabled={isLoading}
        >
          <Text style={styles.actionText}>
            {isProvider
              ? t("provider.myServices")
              : t("provider.becomeProvider")}
          </Text>
        </Pressable>
        <Can permission="listing:moderate">
          <Pressable
            style={styles.actionButton}
            onPress={() => router.push("/moderation" as never)}
            accessibilityRole="button"
          >
            <Text style={styles.actionText}>{t("moderation.title")}</Text>
          </Pressable>
        </Can>
      </View>

      {/* State 1: Skeleton Loading */}
      {search.isPending ? <SkeletonList count={5} /> : null}

      {/* State 2: Error State */}
      {search.error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{describe(search.error, t)}</Text>
          <Pressable
            style={styles.primaryButton}
            onPress={() => search.refetch()}
          >
            <Text style={styles.primaryButtonText}>{t("search.retry")}</Text>
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
            if (search.hasNextPage && !search.isFetchingNextPage)
              search.fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            isInitialState ? (
              /* State 3: Empty Initial State */
              <View style={styles.centerContainer}>
                <Text style={styles.emptyTitle}>
                  {t("search.emptyInitial")}
                </Text>
                <Pressable
                  style={styles.secondaryButton}
                  onPress={() => setRadiusKm(20)}
                >
                  <Text style={styles.secondaryButtonText}>
                    {t("search.expandRadius")}
                  </Text>
                </Pressable>
              </View>
            ) : (
              /* State 4: Empty Filter State */
              <View style={styles.centerContainer}>
                <Text style={styles.emptyTitle}>{t("search.emptyFilter")}</Text>
                <View style={styles.actionRow}>
                  <Pressable
                    style={styles.primaryButton}
                    onPress={() => setRadiusKm(20)}
                  >
                    <Text style={styles.primaryButtonText}>
                      {t("search.expandRadius")}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={styles.secondaryButton}
                    onPress={() => {
                      setText("");
                      setRadiusKm(10);
                    }}
                  >
                    <Text style={styles.secondaryButtonText}>
                      {t("search.clearFilters")}
                    </Text>
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
        onSelectCity={async (city) => {
          setSelectedCity(city);
          await saveSelectedCity(city);
          setLocationStatus("fallback");
          setLocationMessage(t("search.usingCity", { city: city.name }));
          setCanOpenSettings(false);
        }}
      />

      <FilterModal
        visible={showFilterModal}
        categories={categories.data ?? []}
        selectedCategoryId={categoryId}
        radiusKm={radiusKm}
        onClose={() => setShowFilterModal(false)}
        onSelectCategory={(next) => setCategoryId(next)}
        onChangeRadius={setRadiusKm}
        onClear={() => {
          setCategoryId(undefined);
          setRadiusKm(10);
        }}
      />
    </View>
  );
}

function FilterModal({
  visible,
  categories,
  selectedCategoryId,
  radiusKm,
  onClose,
  onSelectCategory,
  onChangeRadius,
  onClear,
}: {
  visible: boolean;
  categories: Category[];
  selectedCategoryId?: string;
  radiusKm: number;
  onClose: () => void;
  onSelectCategory: (id: string | undefined) => void;
  onChangeRadius: (next: number) => void;
  onClear: () => void;
}) {
  const { t } = useTranslation();
  const radiusOptions = [10, 20, 50];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t("search.filters")}</Text>
          <Text style={styles.modalSubtitle}>{t("search.filterSubtitle")}</Text>

          <Text style={styles.filterHeading}>{t("search.categoryLabel")}</Text>
          <View style={styles.filterOptionsContainer}>
            <Pressable
              style={[
                styles.filterOption,
                selectedCategoryId === undefined && styles.filterOptionSelected,
              ]}
              onPress={() => onSelectCategory(undefined)}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  selectedCategoryId === undefined &&
                    styles.filterOptionTextSelected,
                ]}
              >
                {t("search.allCategories")}
              </Text>
            </Pressable>
            {categories.map((category) => (
              <Pressable
                key={category.id}
                style={[
                  styles.filterOption,
                  category.id === selectedCategoryId &&
                    styles.filterOptionSelected,
                ]}
                onPress={() => onSelectCategory(category.id)}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    category.id === selectedCategoryId &&
                      styles.filterOptionTextSelected,
                  ]}
                >
                  {category.name}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.filterHeading}>{t("search.radiusLabel")}</Text>
          <View style={styles.filterOptionsContainer}>
            {radiusOptions.map((distance) => (
              <Pressable
                key={distance}
                style={[
                  styles.filterOption,
                  radiusKm === distance && styles.filterOptionSelected,
                ]}
                onPress={() => onChangeRadius(distance)}
              >
                <Text style={styles.filterOptionText}>
                  {t("search.radiusOption", { distance })}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.modalActionRow}>
            <Pressable style={styles.secondaryButton} onPress={onClear}>
              <Text style={styles.secondaryButtonText}>
                {t("search.clearFilters")}
              </Text>
            </Pressable>
            <Pressable style={styles.primaryButton} onPress={onClose}>
              <Text style={styles.primaryButtonText}>
                {t("search.applyFilters")}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
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
  const formattedPrice = listing.priceFrom
    ? formatMoney(listing.priceFrom, locale)
    : t("listing.onQuote");
  const formattedDist = formatDistance(listing.distanceMeters, locale);
  const reviewsText =
    listing.ratingCount > 0
      ? t("listing.reviewsCount", { count: listing.ratingCount })
      : t("listing.noReviews");

  const accessibilityLabel = `${listing.title}, ${formattedPrice}, a ${formattedDist}, ${
    listing.ratingCount > 0
      ? `${listing.ratingAvg.toFixed(1)} estrellas, ${reviewsText}`
      : t("listing.noReviews")
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
          <Text style={styles.cardRating}>· {t("listing.noReviews")}</Text>
        )}
        {listing.isFavorite ? (
          <Text style={styles.cardFavorite}> · ❤️</Text>
        ) : null}
      </View>

      {listing.status !== "published" ? (
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
  if (error instanceof ApiError && error.kind === "network")
    return t("error.network");
  return t("error.unknown");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    gap: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#111827",
  },
  cityBadge: {
    alignSelf: "flex-start",
    minHeight: 36,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
  },
  cityBadgeText: {
    color: "#1d4ed8",
    fontWeight: "600",
    fontSize: 14,
  },
  headerBadgeRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  filterBadge: {
    alignSelf: "flex-start",
    minHeight: 36,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#eef2ff",
    justifyContent: "center",
  },
  filterBadgeText: {
    color: "#4338ca",
    fontWeight: "600",
    fontSize: 14,
  },
  card: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    minHeight: 64,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  cardDetailRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#059669",
  },
  cardDistance: {
    fontSize: 14,
    color: "#4b5563",
  },
  cardRating: {
    fontSize: 14,
    color: "#4b5563",
  },
  cardFavorite: {
    fontSize: 14,
    color: "#dc2626",
    fontWeight: "600",
  },
  statusBadge: {
    marginTop: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4b5563",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.42)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  filterHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  filterOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#f8fafc",
  },
  filterOptionSelected: {
    backgroundColor: "#2563eb",
  },
  filterOptionText: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "600",
  },
  filterOptionTextSelected: {
    color: "#ffffff",
  },
  modalActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
  },
  centerContainer: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 15,
    color: "#dc2626",
    textAlign: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 16,
  },
  actionRow: {
    gap: 12,
    alignItems: "center",
  },
  actionRowTop: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionButton: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: 16,
    backgroundColor: "#2563eb",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  primaryButton: {
    minHeight: 44,
    paddingHorizontal: 20,
    backgroundColor: "#2563eb",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },
  secondaryButton: {
    minHeight: 44,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  secondaryButtonText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 15,
  },
  locationBanner: {
    backgroundColor: "#f8fafc",
    borderBottomWidth: 1,
    borderBottomColor: "#dbeafe",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  locationBannerText: {
    color: "#1d4ed8",
    flex: 1,
    fontSize: 14,
    marginRight: 12,
  },
  locationBannerButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#2563eb",
    borderRadius: 8,
  },
  locationBannerButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
});
