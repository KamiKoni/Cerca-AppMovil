import * as SecureStore from "expo-secure-store";
import type { CityOption } from "../../presentation/components/CitySelectorModal";

const CITY_KEY = "cerca.selectedCity";

export async function saveSelectedCity(city: CityOption): Promise<void> {
  await SecureStore.setItemAsync(CITY_KEY, JSON.stringify(city));
}

export async function getSelectedCity(): Promise<CityOption | null> {
  const raw = await SecureStore.getItemAsync(CITY_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as CityOption;
  } catch {
    return null;
  }
}

export async function clearSelectedCity(): Promise<void> {
  await SecureStore.deleteItemAsync(CITY_KEY);
}
