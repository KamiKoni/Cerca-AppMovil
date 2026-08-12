import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MyListingsScreen } from '../../src/presentation/MyListingsScreen';

export default function MyListingsPage() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t('provider.myServices') }} />
      <MyListingsScreen />
    </>
  );
}
