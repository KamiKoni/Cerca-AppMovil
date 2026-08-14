import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import {
  formatDistance,
  formatMoney,} from "@cerca/contract";
import { useSession } from "./SessionProvider";
import { useFavoriteListings } from "../infrastructure/query/hooks";

export function FavoritesScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  // Both reads come from the one session: this screen sits behind the guard, so
  // in practice it only ever renders authenticated, but keeping the two branches
  // costs nothing and survives the screen being moved out of `(app)` later.
  const { state } = useSession();
  const actor = state.status === "authenticated" ? state.actor : null;
  const isLoading = state.status === "bootstrapping";
  const favorites = useFavoriteListings(Boolean(actor));
  const locale = i18n.language || "es-CO";

  const items = favorites.data?.pages.flatMap((page) => page.items) ?? [];

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!actor) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>{t("favorites.title")}</Text>
        <Text style={styles.subtitle}>{t("favorites.loginPrompt")}</Text>
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push("/sign-in" as never)}
          accessibilityRole="button"
        >
          <Text style={styles.primaryButtonText}>{t("signIn.submit")}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{t("favorites.title")}</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => router.push(`/listings/${item.id}` as never)}
            accessibilityRole="button"
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={styles.cardDetailRow}>
              <Text style={styles.cardPrice}>
                {item.priceFrom
                  ? formatMoney(item.priceFrom, locale)
                  : t("listing.onQuote")}
              </Text>
              <Text style={styles.cardDistance}>
                · {formatDistance(item.distanceMeters, locale)}
              </Text>
              {item.ratingCount > 0 ? (
                <Text style={styles.cardRating}>
                  · ⭐ {item.ratingAvg.toFixed(1)}
                </Text>
              ) : null}
              {item.isFavorite ? (
                <Text style={styles.cardFavorite}>· ❤️</Text>
              ) : null}
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.subtitle}>{t("favorites.empty")}</Text>
          </View>
        }
        onEndReached={() => {
          if (favorites.hasNextPage && !favorites.isFetchingNextPage)
            favorites.fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          favorites.isFetchingNextPage ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator size="small" color="#2563eb" />
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 20,
  },
  primaryButton: {
    minHeight: 48,
    paddingHorizontal: 24,
    backgroundColor: "#2563eb",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  cardDetailRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  cardPrice: {
    fontSize: 15,
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
  loadingFooter: {
    paddingVertical: 16,
  },
});
