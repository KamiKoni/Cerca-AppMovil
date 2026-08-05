import { useState } from 'react';
import { ActivityIndicator, Button, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import '../infrastructure/i18n';
import { signIn } from '../infrastructure/api';
import type { AuthSignInResponse } from '@cerca/contract';

export function SignInScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    try {
      const response: AuthSignInResponse = await signIn(email, password);
      console.log('Signed in', response.actor.id);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 16 }}>{t('signIn.title')}</Text>
      <TextInput
        placeholder={t('signIn.email')}
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 }}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder={t('signIn.password')}
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 }}
        secureTextEntry
      />
      {error ? <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text> : null}
      <Button title={loading ? t('signIn.loading') : t('signIn.submit')} onPress={handleSubmit} disabled={loading} />
      {loading ? <ActivityIndicator style={{ marginTop: 16 }} /> : null}
    </View>
  );
}
