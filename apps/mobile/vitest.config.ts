import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // Pure-TypeScript tests only (`.ts`). The component test in src/presentation
    // is `.tsx` and needs a React Native preset plus @testing-library/react-native,
    // which this package does not declare — it fails to resolve today. Scoping the
    // data layer's runner to `.ts` keeps that unrelated breakage from turning
    // every run red. Widening this to `.tsx` belongs to SETUP-02, together with
    // installing the missing dependency.
    include: ['src/**/*.test.ts'],
  },
});
