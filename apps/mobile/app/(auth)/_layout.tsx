import { Stack } from 'expo-router';
import { SessionGuard } from '../../src/presentation/SessionGuard';

export default function AuthLayout() {
  return (
    <SessionGuard group="auth">
      {/* The sign-in screen paints its own title; a header bar would repeat it. */}
      <Stack screenOptions={{ headerShown: false }} />
    </SessionGuard>
  );
}
