import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

export interface CityOption {
  id: string;
  name: string;
  coords: { lat: number; lng: number };
}

export const CITIES: CityOption[] = [
  { id: "bogota", name: "Bogotá", coords: { lat: 4.711, lng: -74.0721 } },
  {
    id: "cdmx",
    name: "Ciudad de México",
    coords: { lat: 19.4326, lng: -99.1332 },
  },
  { id: "medellin", name: "Medellín", coords: { lat: 6.2442, lng: -75.5812 } },
  {
    id: "buenos_aires",
    name: "Buenos Aires",
    coords: { lat: -34.6037, lng: -58.3816 },
  },
  { id: "madrid", name: "Madrid", coords: { lat: 40.4168, lng: -3.7038 } },
];

interface CitySelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCity: (city: CityOption) => void;
}

export function CitySelectorModal({
  visible,
  onClose,
  onSelectCity,
}: CitySelectorModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{t("search.citySelectorTitle")}</Text>
          <Text style={styles.subtitle}>{t("error.locationDenied")}</Text>

          {CITIES.map((city) => (
            <Pressable
              key={city.id}
              style={styles.cityOption}
              accessibilityRole="button"
              accessibilityLabel={`Seleccionar ciudad ${city.name}`}
              onPress={() => {
                onSelectCity(city);
                onClose();
              }}
            >
              <Text style={styles.cityName}>{city.name}</Text>
            </Pressable>
          ))}

          <Pressable
            style={styles.closeButton}
            accessibilityRole="button"
            onPress={onClose}
          >
            <Text style={styles.closeText}>{t("provider.back")}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  cityOption: {
    minHeight: 44,
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    marginBottom: 8,
  },
  cityName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  closeButton: {
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  closeText: {
    fontSize: 16,
    color: "#4b5563",
  },
});
