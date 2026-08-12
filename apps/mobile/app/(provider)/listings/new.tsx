import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ListingFormWizard } from '../../../src/presentation/ListingFormWizard';

export default function CreateListingPage() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t('provider.newListing') }} />
      <ListingFormWizard />
    </>
  );
}
