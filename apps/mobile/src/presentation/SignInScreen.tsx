import { useState } from 'react';
import { ActivityIndicator, Button, Text, TextInput, View } from 'react-native';
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
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 4 }}>{t('signIn.title')}</Text>
      <Text style={{ color: '#666', marginBottom: 20 }}>{t('signIn.description')}</Text>

      <TextInput
        placeholder={t('signIn.email')}
        value={email}
        onChangeText={setEmail}
        style={inputStyle}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
      />
      <TextInput
        placeholder={t('signIn.password')}
        value={password}
        onChangeText={setPassword}
        style={inputStyle}
        secureTextEntry
      />

      {signIn.error ? (
        <Text style={{ color: '#c00', marginBottom: 12 }}>{describe(signIn.error, t)}</Text>
      ) : null}

      <Button
        title={signIn.isPending ? t('signIn.loading') : t('signIn.submit')}
        onPress={handleSubmit}
        disabled={signIn.isPending}
      />
      {signIn.isPending ? <ActivityIndicator style={{ marginTop: 16 }} /> : null}
    </View>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 12,
  marginBottom: 12,
} as const;

/**
 * The server's `message` is English and developer-facing, so it is never shown.
 * The kind is what the user can act on: wrong password vs. unreachable server
 * are different problems with different fixes.
 */
function describe(error: unknown, t: (key: string) => string): string {
  if (error instanceof ApiError) {
    if (error.kind === 'network') return t('error.network');
    if (error.kind === 'unauthorized') return t('error.badCredentials');
    if (error.kind === 'validation') return t('error.validation');
  }
  return t('error.unknown');
}
