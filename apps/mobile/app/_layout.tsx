import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApiError } from '../src/domain/errors';
import { SessionProvider } from '../src/presentation/SessionProvider';
import '../src/infrastructure/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false;
        return failureCount < 2;
      },
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <SafeAreaProvider>
          <StatusBar barStyle="dark-content" />
          {/* Headers belong to the group stacks: each group knows its own titles
              and, once signed in, carries the sign-out control. A header here as
              well would render a second bar stacked above theirs. */}
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
