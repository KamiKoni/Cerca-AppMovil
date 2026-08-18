import React, { useState } from "react";
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
import type { CreateListingInput } from "@cerca/contract";
import { useCreateListing } from "../infrastructure/query/hooks";

export function ListingFormWizard() {
  const { t } = useTranslation();
  const router = useRouter();
  const createListing = useCreateListing();

  // Three steps, not four. The fourth collected "photos" by typing a filename
  // into a text box and fabricating a key from it — no picker, no file, no
  // upload. It could not have worked: the API exposes no photo endpoints at all,
  // so `presignPhoto` in the gateway targets a route that answers 404, and
  // `createListingSchema` is `.strict()` and rejects `photoKeys` outright.
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("cat-general");
  const [model, setModel] = useState<"fixed" | "hourly" | "quote">("fixed");
  const [fixedAmount, setFixedAmount] = useState("500");
  const [hourlyAmount, setHourlyAmount] = useState("250");
  const [minimumHours, setMinimumHours] = useState("2");
  const [startingAmount, setStartingAmount] = useState("");
  const [currency, setCurrency] = useState("MXN");
  const [cityId, setCityId] = useState("cdmx");

  function buildPricingPayload() {
    if (model === "fixed") {
      return {
        model: "fixed" as const,
        price: {
          amountMinor: Math.round((parseFloat(fixedAmount) || 0) * 100),
          currency,
        },
      };
    }
    if (model === "hourly") {
      return {
        model: "hourly" as const,
        hourlyRate: {
          amountMinor: Math.round((parseFloat(hourlyAmount) || 0) * 100),
          currency,
        },
        minimumHours: parseInt(minimumHours, 10) || 1,
      };
    }
    return {
      model: "quote" as const,
      startingFrom: startingAmount
        ? {
            amountMinor: Math.round((parseFloat(startingAmount) || 0) * 100),
            currency,
          }
        : undefined,
    };
  }

  function handleFinalPublish() {
    const payload: CreateListingInput = {
      title,
      description,
      categoryId,
      pricing: buildPricingPayload(),
      cityId,
    };

    createListing.mutate(payload, {
      onSuccess: () => {
        router.replace("/(provider)/my-listings");
      },
    });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Wizard Header / Indicator */}
      <View style={styles.stepIndicatorRow}>
        {[1, 2, 3].map((s) => (
          <View
            key={s}
            style={[
              styles.stepDot,
              step === s && styles.stepDotActive,
              step > s && styles.stepDotDone,
            ]}
          >
            <Text
              style={[
                styles.stepDotText,
                (step === s || step > s) && styles.stepDotTextActive,
              ]}
            >
              {s}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.stepTitle}>
        {step === 1 && t("provider.step1")}
        {step === 2 && t("provider.step2")}
        {step === 3 && t("provider.step3")}
      </Text>

      {/* Step 1: Category & Details */}
      {step === 1 ? (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Categoría ID</Text>
          <TextInput
            style={styles.input}
            placeholder="cat-general"
            value={categoryId}
            onChangeText={setCategoryId}
          />

          <Text style={styles.label}>Título del servicio</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. Clases de guitarra acústica"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="Describe lo que incluye tu servicio..."
            value={description}
            onChangeText={setDescription}
          />
        </View>
      ) : null}

      {/* Step 2: Pricing Model */}
      {step === 2 ? (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Modelo de cobro</Text>

          <View style={styles.modelRow}>
            {(["fixed", "hourly", "quote"] as const).map((m) => (
              <Pressable
                key={m}
                style={[
                  styles.modelChip,
                  model === m && styles.modelChipActive,
                ]}
                onPress={() => setModel(m)}
              >
                <Text
                  style={[
                    styles.modelChipText,
                    model === m && styles.modelChipTextActive,
                  ]}
                >
                  {t(`provider.pricingModel.${m}`)}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Moneda</Text>
          <TextInput
            style={styles.input}
            value={currency}
            onChangeText={setCurrency}
          />

          {model === "fixed" ? (
            <>
              <Text style={styles.label}>Precio total</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={fixedAmount}
                onChangeText={setFixedAmount}
                placeholder="500"
              />
            </>
          ) : null}

          {model === "hourly" ? (
            <>
              <Text style={styles.label}>Tarifa por hora</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={hourlyAmount}
                onChangeText={setHourlyAmount}
                placeholder="250"
              />

              <Text style={styles.label}>Horas mínimas por contratación</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={minimumHours}
                onChangeText={setMinimumHours}
                placeholder="2"
              />
            </>
          ) : null}

          {model === "quote" ? (
            <>
              <Text style={styles.label}>Precio desde (opcional)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={startingAmount}
                onChangeText={setStartingAmount}
                placeholder="Presupuesto a convenir"
              />
            </>
          ) : null}
        </View>
      ) : null}

      {/* Step 3: Location / Zone */}
      {step === 3 ? (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Identificador de Ciudad / Zona</Text>
          <TextInput
            style={styles.input}
            value={cityId}
            onChangeText={setCityId}
            placeholder="cdmx"
          />
        </View>
      ) : null}

      {createListing.error ? (
        <Text style={styles.errorText}>{t("error.unknown")}</Text>
      ) : null}

      {/* Navigation Buttons */}
      <View style={styles.wizardFooter}>
        {step > 1 ? (
          <Pressable
            style={styles.secondaryButton}
            onPress={() => setStep((s) => (s > 1 ? s - 1 : s) as 1 | 2 | 3)}
          >
            <Text style={styles.secondaryButtonText}>{t("provider.back")}</Text>
          </Pressable>
        ) : (
          <View />
        )}

        {step < 3 ? (
          <Pressable
            style={styles.primaryButton}
            onPress={() => setStep((s) => (s < 3 ? s + 1 : s) as 1 | 2 | 3)}
            disabled={step === 1 && !title.trim()}
          >
            <Text style={styles.primaryButtonText}>{t("provider.next")}</Text>
          </Pressable>
        ) : (
          <Pressable
            style={[
              styles.publishButton,
              createListing.isPending && styles.disabledButton,
            ]}
            onPress={handleFinalPublish}
            disabled={createListing.isPending}
          >
            {createListing.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.publishButtonText}>
                {t("provider.publish")}
              </Text>
            )}
          </Pressable>
        )}
      </View>
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
  },
  stepIndicatorRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 20,
  },
  stepDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  stepDotActive: {
    backgroundColor: "#2563eb",
  },
  stepDotDone: {
    backgroundColor: "#059669",
  },
  stepDotText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4b5563",
  },
  stepDotTextActive: {
    color: "#ffffff",
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },
  formGroup: {
    gap: 12,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    color: "#111827",
  },
  textArea: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    textAlignVertical: "top",
    color: "#111827",
  },
  modelRow: {
    flexDirection: "row",
    gap: 8,
  },
  modelChip: {
    minHeight: 40,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  modelChipActive: {
    backgroundColor: "#2563eb",
  },
  modelChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  modelChipTextActive: {
    color: "#ffffff",
  },
  errorText: {
    color: "#dc2626",
    marginBottom: 12,
  },
  wizardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  primaryButton: {
    minHeight: 44,
    paddingHorizontal: 24,
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
  },
  secondaryButtonText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 15,
  },
  publishButton: {
    minHeight: 44,
    paddingHorizontal: 24,
    backgroundColor: "#059669",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  publishButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
