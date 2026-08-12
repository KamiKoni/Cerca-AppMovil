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
import {
  useModerateListing,
  useReports,
  useResolveReport,
} from "../infrastructure/query/hooks";
import { useCan } from "./authorization";

export function ModerationQueueScreen() {
  const { t } = useTranslation();
  const reportsQuery = useReports();
  const resolveReport = useResolveReport();
  const moderateListing = useModerateListing();
  const isModerator = useCan("listing:moderate");

  if (!isModerator) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>{t("moderation.accessDeniedTitle")}</Text>
        <Text style={styles.subtitle}>
          {t("moderation.accessDeniedMessage")}
        </Text>
      </View>
    );
  }

  if (reportsQuery.isPending) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const reports = reportsQuery.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("moderation.openReports")}</Text>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reportCard}>
            <Text style={styles.reportReason}>Motivo: {item.reason}</Text>
            <Text style={styles.reportMeta}>Anuncio ID: {item.listingId}</Text>
            <Text style={styles.reportMeta}>
              Fecha: {new Date(item.createdAt).toLocaleDateString()}
            </Text>

            <View style={styles.actionsRow}>
              <Pressable
                style={styles.warningButton}
                onPress={() =>
                  moderateListing.mutate({
                    listingId: item.listingId,
                    status: "under_review",
                    reason: item.reason,
                  })
                }
              >
                <Text style={styles.buttonText}>
                  {t("moderation.underReview")}
                </Text>
              </Pressable>

              <Pressable
                style={styles.dangerButton}
                onPress={() =>
                  moderateListing.mutate({
                    listingId: item.listingId,
                    status: "removed",
                    reason: item.reason,
                  })
                }
              >
                <Text style={styles.buttonText}>{t("moderation.remove")}</Text>
              </Pressable>

              <Pressable
                style={styles.secondaryButton}
                onPress={() => resolveReport.mutate(item.id)}
              >
                <Text style={styles.secondaryText}>
                  {t("moderation.resolve")}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.subtitle}>
              No hay reportes pendientes en la cola de moderación.
            </Text>
          </View>
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
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    color: "#4b5563",
    textAlign: "center",
  },
  reportCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fefce8",
  },
  reportReason: {
    fontSize: 16,
    fontWeight: "700",
    color: "#854d0e",
    marginBottom: 4,
  },
  reportMeta: {
    fontSize: 13,
    color: "#713f12",
    marginBottom: 4,
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  warningButton: {
    minHeight: 36,
    paddingHorizontal: 12,
    backgroundColor: "#d97706",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  dangerButton: {
    minHeight: 36,
    paddingHorizontal: 12,
    backgroundColor: "#dc2626",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButton: {
    minHeight: 36,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  secondaryText: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "600",
  },
});
