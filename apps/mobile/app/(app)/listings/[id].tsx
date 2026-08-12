import { Stack, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ListingDetailScreen } from '../../../src/presentation/ListingDetailScreen';

export default function ListingDetailPage() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen options={{ title: t('listing.title') }} />
      <ListingDetailScreen id={id} />
    </>
  );
}
