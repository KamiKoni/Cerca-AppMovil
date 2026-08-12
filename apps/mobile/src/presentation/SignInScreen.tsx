import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ApiError } from '../domain/errors';
import { useSignIn } from '../infrastructure/query/hooks';
import { useSession } from './SessionProvider';

export function SignInScreen() {
  const { t } = useTranslation();
  const { signedIn } = useSession();
  const [email, setEmail] = useState('customer@cerca.app');
  const [password, setPassword] = useState('Password123!');

  const signIn = useSignIn();

  /**
   * Announces the new session and navigates nowhere. The `(auth)` guard sees an
   * authenticated state and forwards to the app; a `router.replace` here would
   * be a second opinion on the same question, and the two would race.
   */
  function handleSubmit() {
    signIn.mutate({ email, password }, { onSuccess: (session) => signedIn(session.actor) });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('signIn.title')}</Text>
      <Text style={styles.description}>{t('signIn.description')}</Text>

      <TextInput
        placeholder={t('signIn.email')}
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        accessibilityLabel={t('signIn.email')}
      />
      <TextInput
        placeholder={t('signIn.password')}
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        accessibilityLabel={t('signIn.password')}
      />

      {signIn.error ? (
        <Text style={styles.errorText}>{describe(signIn.error, t)}</Text>
      ) : null}

      <Pressable
        style={[styles.primaryButton, signIn.isPending && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={signIn.isPending}
        accessibilityRole="button"
      >
        {signIn.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>{t('signIn.submit')}</Text>
        )}
      </Pressable>
    </View>
  );
}

function describe(error: unknown, t: (key: string) => string): string {
  if (error instanceof ApiError) {
    if (error.kind === 'network') return t('error.network');
    if (error.kind === 'unauthorized') return t('error.badCredentials');
    if (error.kind === 'validation') return t('error.validation');
  }
  return t('error.unknown');
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 24,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#111827',
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    marginBottom: 16,
  },
  primaryButton: {
    minHeight: 48,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
