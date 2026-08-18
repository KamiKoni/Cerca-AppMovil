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
import { FAVOURITES_ENABLED } from "../infrastructure/features";
import { useRouter } from "expo-router";
import { ApiError } from "../domain/errors";
import {
  useMyListings,
  usePauseListing,
  usePublishListing,
} from "../infrastructure/query/hooks";
import { withCapacity } from "./authorization";

export function MyListingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const isProvider = withCapacity("provider");

  const myListings = useMyListings();
  const publishMutation = usePublishListing();
  const pauseMutation = usePauseListing();

  if (!isProvider) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>{t("provider.onboardingTitle")}</Text>
        <Text style={styles.subtitle}>
          {t("provider.onboardingDescription")}
        </Text>
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push("/search" as never)}
          accessibilityRole="button"
        >
          <Text style={styles.primaryButtonText}>
            {t("provider.becomeProvider")}
          </Text>
        </Pressable>
      </View>
    );
  }

  if (myListings.isPending) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  // A failed request is not an empty list. Without this branch a rejected
  // response left `data` undefined, fell through to the empty state, and told a
  // provider with listings that they had published none.
  if (myListings.error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>{t("provider.myServices")}</Text>
        <Text style={styles.subtitle}>{describe(myListings.error, t)}</Text>
        <Pressable
          style={styles.primaryButton}
          onPress={() => myListings.refetch()}
          accessibilityRole="button"
        >
          <Text style={styles.primaryButtonText}>{t("search.retry")}</Text>
        </Pressable>
      </View>
    );
  }

  const items = myListings.data?.items ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{t("provider.myServices")}</Text>
        <View style={styles.headerActions}>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push("/bookings" as never)}
            accessibilityRole="button"
          >
            <Text style={styles.secondaryButtonText}>
              {t("provider.receivedBookings")}
            </Text>
          </Pressable>
          {FAVOURITES_ENABLED ? (
            <Pressable
              style={styles.secondaryButton}
              onPress={() => router.push("/favorites" as never)}
              accessibilityRole="button"
            >
              <Text style={styles.secondaryButtonText}>
                {t("favorites.title")}
              </Text>
            </Pressable>
          ) : null}
          <Pressable
            style={styles.newButton}
            onPress={() => router.push("/(provider)/listings/new" as never)}
            accessibilityRole="button"
          >
            <Text style={styles.newButtonText}>
              + {t("provider.newListing")}
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {t(`listing.status.${item.status}`, item.status)}
                </Text>
              </View>
            </View>

            <View style={styles.cardActions}>
              {item.status === "published" ? (
                <Pressable
                  style={styles.actionButton}
                  onPress={() => pauseMutation.mutate(item.id)}
                  disabled={pauseMutation.isPending}
                >
                  <Text style={styles.actionText}>{t("provider.pause")}</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={styles.actionButton}
                  onPress={() => publishMutation.mutate(item.id)}
                  disabled={publishMutation.isPending}
                >
                  <Text style={styles.actionText}>
                    {t("provider.publishListing")}
                  </Text>
                </Pressable>
              )}

              <Pressable
                style={styles.actionButton}
                onPress={() => router.push(`/listings/${item.id}` as never)}
              >
                <Text style={styles.actionText}>
                  {t("provider.viewDetails")}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.subtitle}>{t("provider.noListings")}</Text>
          </View>
        }
      />
    </View>
  );
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
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 15,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 20,
  },
  newButton: {
    minHeight: 40,
    paddingHorizontal: 16,
    backgroundColor: "#2563eb",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  newButtonText: {
    color: "#ffffff",
    fontWeight: "600",
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#eff6ff",
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1d4ed8",
  },
  cardActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    minHeight: 36,
    paddingHorizontal: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  secondaryButton: {
    minHeight: 40,
    paddingHorizontal: 16,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#374151",
    fontWeight: "600",
  },
});
