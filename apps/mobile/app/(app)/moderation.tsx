import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ModerationQueueScreen } from '../../src/presentation/ModerationQueueScreen';

export default function ModerationPage() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t('moderation.title') }} />
      <ModerationQueueScreen />
    </>
  );
}
