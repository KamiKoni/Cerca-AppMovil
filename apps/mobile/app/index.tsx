import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SignInScreen } from '../src/presentation/SignInScreen';

export default function Page() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t('signIn.title') }} />
      <SignInScreen />
    </>
  );
}
