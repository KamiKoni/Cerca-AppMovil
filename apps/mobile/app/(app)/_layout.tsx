import { Stack } from 'expo-router';
import { SessionGuard } from '../../src/presentation/SessionGuard';
import { SignOutButton } from '../../src/presentation/SignOutButton';

export default function AppLayout() {
  return (
    <SessionGuard group="protected">
      <Stack
        screenOptions={{
          headerTitleStyle: { fontWeight: '700' },
          headerRight: () => <SignOutButton />,
        }}
      />
    </SessionGuard>
  );
}
