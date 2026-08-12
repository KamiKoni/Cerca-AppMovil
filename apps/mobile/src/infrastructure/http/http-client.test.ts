import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { ApiError } from '../../domain/errors';
import { createHttpClient } from './http-client';
import meFixture from '../__fixtures__/me.json';
import problem403 from '../__fixtures__/problem.403-not-owner.json';

const actorSchema = z.object({
  id: z.string(),
  capacities: z.array(z.enum(['customer', 'provider'])),
  platformRole: z.enum(['user', 'moderator', 'admin']),
});

/** A fetch that answers with a canned response and records what it was asked. */
function fakeFetch(body: unknown, init: { status?: number; contentType?: string } = {}) {
  const status = init.status ?? 200;
  return vi.fn(async () =>
    new Response(typeof body === 'string' ? body : JSON.stringify(body), {
      status,
      headers: { 'Content-Type': init.contentType ?? 'application/json' },
    }),
  );
}

const lastCall = (fetchFn: ReturnType<typeof fakeFetch>) => fetchFn.mock.calls[0] as unknown as [string, RequestInit];
const headersOf = (fetchFn: ReturnType<typeof fakeFetch>) =>
  lastCall(fetchFn)[1].headers as Record<string, string>;

describe('createHttpClient', () => {
  it('validates the response instead of trusting it', async () => {
    const fetchFn = fakeFetch(meFixture);
    const client = createHttpClient({ baseUrl: 'http://localhost:3333/v1', fetchFn });

    const actor = await client.request('/me', actorSchema);

    expect(actor.capacities).toEqual(['customer', 'provider']);
  });

  it('throws when the payload does not match, at the boundary', async () => {
    // A renamed or missing required field surfaces here, by name — not three
    // screens later as an undefined.
    const fetchFn = fakeFetch({ id: 'u1', capacities: ['customer'] });
    const client = createHttpClient({ baseUrl: 'http://localhost:3333/v1', fetchFn });

    await expect(client.request('/me', actorSchema)).rejects.toThrowError();
  });

  it('injects the bearer token centrally', async () => {
    const fetchFn = fakeFetch(meFixture);
    const client = createHttpClient({
      baseUrl: 'http://localhost:3333/v1',
      fetchFn,
      tokenProvider: {
        getAccessToken: async () => 'jwt-123',
        getRefreshToken: async () => null,
        saveTokens: async () => {},
      },
    });

    await client.request('/me', actorSchema);

    expect(headersOf(fetchFn).Authorization).toBe('Bearer jwt-123');
  });

  it('sends no Authorization header when there is no session', async () => {
    const fetchFn = fakeFetch(meFixture);
    const client = createHttpClient({
      baseUrl: 'http://localhost:3333/v1',
      fetchFn,
      tokenProvider: {
        getAccessToken: async () => null,
        getRefreshToken: async () => null,
        saveTokens: async () => {},
      },
    });

    await client.request('/me', actorSchema);

    // Not `Bearer null`: an empty session must look like no session.
    expect(headersOf(fetchFn).Authorization).toBeUndefined();
  });

  it('sends Idempotency-Key only when one is given', async () => {
    const withKey = fakeFetch({ ok: true });
    const client = createHttpClient({ baseUrl: 'http://localhost:3333/v1', fetchFn: withKey });
    await client.request('/bookings', z.object({ ok: z.boolean() }), {
      method: 'POST',
      body: { listingId: 'l1' },
      idempotencyKey: 'key-abc',
    });
    expect(headersOf(withKey)['Idempotency-Key']).toBe('key-abc');

    const withoutKey = fakeFetch(meFixture);
    const plain = createHttpClient({ baseUrl: 'http://localhost:3333/v1', fetchFn: withoutKey });
    await plain.request('/me', actorSchema);
    expect(headersOf(withoutKey)['Idempotency-Key']).toBeUndefined();
  });

  it('turns an error response into a typed domain error', async () => {
    const fetchFn = fakeFetch(problem403, { status: 403, contentType: 'application/problem+json' });
    const client = createHttpClient({ baseUrl: 'http://localhost:3333/v1', fetchFn });

    const error = await client.request('/listings/l1', actorSchema).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).kind).toBe('forbidden');
    expect((error as ApiError).reason).toBe('not_owner');
  });

  it('reports an unreachable server as network, not as a server error', async () => {
    // status 0 means "no answer at all" — a wrong LAN IP or airplane mode. The
    // UI retries this; it must not retry a 403.
    const fetchFn = vi.fn(async () => {
      throw new TypeError('Network request failed');
    });
    const client = createHttpClient({ baseUrl: 'http://localhost:3333/v1', fetchFn });

    const error = (await client.request('/me', actorSchema).catch((e: unknown) => e)) as ApiError;

    expect(error.kind).toBe('network');
    expect(error.status).toBe(0);
  });

  it('drops absent and blank query parameters', async () => {
    const fetchFn = fakeFetch({ items: [], nextCursor: null });
    const client = createHttpClient({ baseUrl: 'http://localhost:3333/v1', fetchFn });

    await client.request('/listings', z.object({ items: z.array(z.unknown()), nextCursor: z.null() }), {
      query: { lat: 6.24, lng: -75.58, query: '', categoryId: undefined, radiusKm: 10 },
    });

    // `?query=` would read as a deliberate search for the empty string.
    expect(lastCall(fetchFn)[0]).toBe('http://localhost:3333/v1/listings?lat=6.24&lng=-75.58&radiusKm=10');
  });

  it('joins base and path without doubling the slash', async () => {
    const fetchFn = fakeFetch(meFixture);
    const client = createHttpClient({ baseUrl: 'http://localhost:3333/v1/', fetchFn });

    await client.request('me', actorSchema);

    expect(lastCall(fetchFn)[0]).toBe('http://localhost:3333/v1/me');
  });
});
