import { describe, expect, it } from 'vitest';
import { MONEY_SCHEMA } from '../src/money';
import { authSignInSchema } from '../src/schemas';

describe('contract schemas', () => {
  it('validates auth sign-in response shape', () => {
    const result = authSignInSchema.safeParse({
      accessToken: 'token',
      refreshToken: 'refresh',
      actor: { id: 'user-1', capacities: ['customer'], platformRole: 'user' },
    });
    expect(result.success).toBe(true);
  });

  it('fails with i18n key error messages', () => {
    const result = authSignInSchema.safeParse({
      accessToken: '',
      refreshToken: '',
      actor: { id: 'user-1', capacities: ['customer'], platformRole: 'user' },
    });
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe('error.auth.accessToken');
  });
});
