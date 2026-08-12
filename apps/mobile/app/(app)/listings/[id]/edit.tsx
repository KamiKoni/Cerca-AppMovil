import { Stack, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ListingEditScreen } from '../../../../src/presentation/ListingEditScreen';

export default function ListingEditPage() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen options={{ title: t('listing.editTitle') }} />
      <ListingEditScreen id={id} />
    </>
  );
}
