module.exports = {
  root: true,
  env: { node: true, es2021: true },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'import/no-restricted-paths': ['error', {
      zones: [
        { target: './src/domain', from: './src/presentation', message: 'Domain must not depend on UI.' },
        { target: './src/domain', from: './src/infrastructure' },
        { target: './src/domain', from: './src/application' },
        { target: './src/application', from: './src/presentation' },
        { target: './apps/mobile/src/domain', from: './apps/mobile/src/presentation', message: 'Domain must not depend on UI.' },
        { target: './apps/mobile/src/domain', from: './apps/mobile/src/infrastructure' },
        { target: './apps/mobile/src/domain', from: './apps/mobile/src/application' },
        { target: './apps/mobile/src/application', from: './apps/mobile/src/presentation' },
      ]
    }]
  }
};
