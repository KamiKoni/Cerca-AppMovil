import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { ProviderBookingsScreen } from "../../src/presentation/ProviderBookingsScreen";

export default function ProviderBookingsPage() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t("bookings.receivedTitle") }} />
      <ProviderBookingsScreen />
    </>
  );
}
