import { Stack, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ReviewBookingScreen } from '../../../../src/presentation/ReviewBookingScreen';

export default function ReviewBookingPage() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen options={{ title: t('review.title') }} />
      <ReviewBookingScreen bookingId={id} />
    </>
  );
}
