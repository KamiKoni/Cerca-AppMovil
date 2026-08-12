import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import type { ListingDetail, UpdateListingInput } from "@cerca/contract";
import { ApiError } from "../domain/errors";
import { useAuthSession } from "./context/AuthContext";
import {
  useListingDetail,
  useUpdateListing,
} from "../infrastructure/query/hooks";
import { canEditOwnListing } from "../domain/actor";
import { mapProblemReasonToI18nKey } from "./authorizationMapper";

export function ListingEditScreen({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { actor } = useAuthSession();

  const detailQuery = useListingDetail(id);
  const updateMutation = useUpdateListing(id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [cityId, setCityId] = useState("");
  const [model, setModel] = useState<"fixed" | "hourly" | "quote">("fixed");
  const [fixedAmount, setFixedAmount] = useState("");
  const [hourlyAmount, setHourlyAmount] = useState("");
  const [minimumHours, setMinimumHours] = useState("1");
  const [startingAmount, setStartingAmount] = useState("");

  useEffect(() => {
    const listing = detailQuery.data;
    if (!listing) return;

    setTitle(listing.title);
    setDescription(listing.description);
    setCategoryId(listing.categoryId);
    setCityId(listing.cityId ?? "");
    setModel(listing.pricing.model);

    if (listing.pricing.model === "fixed") {
      setFixedAmount((listing.pricing.price.amountMinor / 100).toString());
    } else if (listing.pricing.model === "hourly") {
      setHourlyAmount(
        (listing.pricing.hourlyRate.amountMinor / 100).toString(),
      );
      setMinimumHours(listing.pricing.minimumHours.toString());
    } else {
      setStartingAmount(
        listing.pricing.startingFrom
          ? (listing.pricing.startingFrom.amountMinor / 100).toString()
          : "",
      );
    }
  }, [detailQuery.data]);

  if (detailQuery.isPending) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (detailQuery.error || !detailQuery.data) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{t("error.unknown")}</Text>
      </View>
    );
  }

  const listing = detailQuery.data as ListingDetail & { ownerId: string };
  const isOwner = actor ? canEditOwnListing(actor, listing) : false;

  if (!isOwner) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{t("listing.editUnauthorized")}</Text>
      </View>
    );
  }

  function buildPayload(): UpdateListingInput {
    const payload: UpdateListingInput = {
      title,
      description,
      categoryId,
      cityId,
      pricing:
        model === "fixed"
          ? {
              model: "fixed",
              price: {
                amountMinor: Math.round((parseFloat(fixedAmount) || 0) * 100),
                currency:
                  listing.pricing.model === "fixed"
                    ? listing.pricing.price.currency
                    : "USD",
              },
            }
          : model === "hourly"
            ? {
                model: "hourly",
                hourlyRate: {
                  amountMinor: Math.round(
                    (parseFloat(hourlyAmount) || 0) * 100,
                  ),
                  currency:
                    listing.pricing.model === "hourly"
                      ? listing.pricing.hourlyRate.currency
                      : "USD",
                },
                minimumHours: parseInt(minimumHours, 10) || 1,
              }
            : {
                model: "quote",
                startingFrom: startingAmount
                  ? {
                      amountMinor: Math.round(
                        (parseFloat(startingAmount) || 0) * 100,
                      ),
                      currency:
                        listing.pricing.model === "quote" &&
                        listing.pricing.startingFrom
                          ? listing.pricing.startingFrom.currency
                          : "USD",
                    }
                  : undefined,
              },
    };
    return payload;
  }

  function handleSave() {
    updateMutation.mutate(buildPayload(), {
      onSuccess: () => {
        router.replace(`/listings/${id}` as any);
      },
    });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t("listing.editTitle")}</Text>

      <Text style={styles.label}>{t("listing.title")}</Text>
      <TextInput value={title} onChangeText={setTitle} style={styles.input} />

      <Text style={styles.label}>{t("listing.description")}</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>{t("provider.category")}</Text>
      <TextInput
        value={categoryId}
        onChangeText={setCategoryId}
        style={styles.input}
      />

      <Text style={styles.label}>{t("provider.cityId")}</Text>
      <TextInput value={cityId} onChangeText={setCityId} style={styles.input} />

      <Text style={styles.label}>{t("provider.pricingModel")}</Text>
      <View style={styles.modelRow}>
        {(["fixed", "hourly", "quote"] as const).map((option) => (
          <Pressable
            key={option}
            style={[
              styles.modelChip,
              model === option && styles.modelChipActive,
            ]}
            onPress={() => setModel(option)}
          >
            <Text
              style={[
                styles.modelChipText,
                model === option && styles.modelChipTextActive,
              ]}
            >
              {t(`provider.pricingModel.${option}`)}
            </Text>
          </Pressable>
        ))}
      </View>

      {model === "fixed" ? (
        <>
          <Text style={styles.label}>{t("provider.fixedPrice")}</Text>
          <TextInput
            value={fixedAmount}
            onChangeText={setFixedAmount}
            style={styles.input}
            keyboardType="numeric"
          />
        </>
      ) : null}

      {model === "hourly" ? (
        <>
          <Text style={styles.label}>{t("provider.hourlyRate")}</Text>
          <TextInput
            value={hourlyAmount}
            onChangeText={setHourlyAmount}
            style={styles.input}
            keyboardType="numeric"
          />
          <Text style={styles.label}>{t("provider.minimumHours")}</Text>
          <TextInput
            value={minimumHours}
            onChangeText={setMinimumHours}
            style={styles.input}
            keyboardType="numeric"
          />
        </>
      ) : null}

      {model === "quote" ? (
        <>
          <Text style={styles.label}>{t("provider.startingFrom")}</Text>
          <TextInput
            value={startingAmount}
            onChangeText={setStartingAmount}
            style={styles.input}
            keyboardType="numeric"
          />
        </>
      ) : null}

      {updateMutation.error ? (
        <Text style={styles.errorText}>
          {updateMutation.error instanceof ApiError &&
          updateMutation.error.reason
            ? t(
                mapProblemReasonToI18nKey(
                  updateMutation.error.reason,
                  "listing.blocked",
                ),
              )
            : t("error.unknown")}
        </Text>
      ) : null}

      <Pressable
        style={[
          styles.primaryButton,
          updateMutation.isPending && styles.disabledButton,
        ]}
        onPress={handleSave}
        disabled={updateMutation.isPending}
      >
        {updateMutation.isPending ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.primaryButtonText}>{t("listing.save")}</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    padding: 20,
    gap: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#ffffff",
    marginBottom: 12,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  modelRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  modelChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#f8fafc",
  },
  modelChipActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  modelChipText: {
    color: "#1f2937",
    fontWeight: "600",
  },
  modelChipTextActive: {
    color: "#ffffff",
  },
  primaryButton: {
    minHeight: 48,
    backgroundColor: "#2563eb",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.65,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
  },
});
