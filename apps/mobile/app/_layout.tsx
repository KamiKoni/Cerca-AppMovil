import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApiError } from '../src/domain/errors';
import { AuthProvider } from '../src/presentation/context/AuthContext';
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
      <AuthProvider>
        <SafeAreaProvider>
          <StatusBar barStyle="dark-content" />
          <Stack screenOptions={{ headerTitleStyle: { fontWeight: '700' } }} />
        </SafeAreaProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
