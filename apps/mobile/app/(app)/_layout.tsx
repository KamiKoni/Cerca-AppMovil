import { Stack } from 'expo-router';
import { SessionGuard } from '../../src/presentation/SessionGuard';

export default function AppLayout() {
  return (
    <SessionGuard group="protected">
      <Stack screenOptions={{ headerTitleStyle: { fontWeight: '700' } }} />
    </SessionGuard>
  );
}
