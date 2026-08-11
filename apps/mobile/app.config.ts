import type { ExpoConfig } from 'expo/config';

/**
 * The Expo config the project was missing entirely, which is why `expo start`
 * had nothing to boot.
 *
 * `scheme` is not decorative: expo-router builds its deep links on it, and
 * without one the router cannot resolve a route on a cold start from a link.
 */
const config: ExpoConfig = {
  name: 'Cerca',
  slug: 'cerca',
  version: '0.1.0',
  orientation: 'portrait',
  scheme: 'cerca',
  userInterfaceStyle: 'light',
  plugins: ['expo-router'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'app.cerca.mobile',
  },
  android: {
    package: 'app.cerca.mobile',
  },
};

export default config;
