import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SearchScreen } from '../../src/presentation/SearchScreen';

export default function SearchPage() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t('search.title') }} />
      <SearchScreen />
    </>
  );
}
