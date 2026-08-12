import { z } from 'zod';
import { authSignInSchema } from '@cerca/contract';
import type { AuthTokens, TokenProvider } from '../../application/ports/token-provider';
import { ApiError } from '../../domain/errors';
import { toApiError } from './problem';

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

export interface RequestOptions {
  method?: HttpMethod;
  query?: QueryParams;
  body?: unknown;
  headers?: Record<string, string>;
  /**
   * Required by POST /bookings and POST /bookings/{id}/review; the server answers
   * 422 IDEMPOTENCY_KEY_REQUIRED without it. Deliberately NOT generated here —
   * see `createIdempotencyKey`.
   */
  idempotencyKey?: string;
  signal?: AbortSignal;
}

export interface HttpClient {
  request<T>(path: string, schema: z.ZodType<T>, options?: RequestOptions): Promise<T>;
}

export interface HttpClientConfig {
  /** e.g. `http://10.126.52.199:3333/v1` — a LAN address on a physical device. */
  baseUrl: string;
  /** Omitted for a signed-out client; then no Authorization header is sent. */
  tokenProvider?: TokenProvider;
  /** Injected so tests never touch the network. Defaults to global fetch. */
  fetchFn?: typeof fetch;
}

/**
 * The single place every request passes through.
 *
 * Central by design: the bearer token, the problem+json mapping and the response
 * validation all happen once, here. Scatter any of them across gateways and one
 * of them will be forgotten in the gateway written under time pressure.
 */
export function createHttpClient(config: HttpClientConfig): HttpClient {
  const doFetch = config.fetchFn ?? globalThis.fetch;
  const baseUrl = config.baseUrl.replace(/\/+$/, '');
  let refreshInProgress: Promise<void> | undefined;

  async function request<T>(path: string, schema: z.ZodType<T>, options: RequestOptions = {}): Promise<T> {
    return requestInternal(path, schema, options, false);
  }

  async function requestInternal<T>(
    path: string,
    schema: z.ZodType<T>,
    options: RequestOptions,
    hasRefreshed: boolean,
  ): Promise<T> {
    const url = baseUrl + (path.startsWith('/') ? path : `/${path}`) + buildQuery(options.query);
    const headers = await buildHeaders(options);

    let response: Response;
    try {
      response = await doFetch(url, {
        method: options.method ?? 'GET',
        headers,
        ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
        ...(options.signal ? { signal: options.signal } : {}),
      });
    } catch (cause) {
      throw new ApiError({
        kind: 'network',
        status: 0,
        code: 'NETWORK_ERROR',
        message: cause instanceof Error ? cause.message : 'The request could not be sent.',
      });
    }

    const raw = await readBody(response);

    if (!response.ok) {
      if (response.status === 401 && !hasRefreshed && shouldAttemptRefresh(path)) {
        await refreshAccessToken();
        return requestInternal(path, schema, options, true);
      }
      throw toApiError(response.status, raw);
    }

    return schema.parse(raw);
  }

  function shouldAttemptRefresh(path: string): boolean {
    return Boolean(
      config.tokenProvider &&
        !path.startsWith('/auth/'),
    );
  }

  async function refreshAccessToken(): Promise<void> {
    const provider = config.tokenProvider;
    if (!provider) {
      throw new ApiError({
        kind: 'unauthorized',
        status: 401,
        code: 'REFRESH_UNAVAILABLE',
        message: 'No token provider is configured for refresh.',
      });
    }

    if (refreshInProgress) {
      await refreshInProgress;
      return;
    }

    refreshInProgress = (async () => {
      const refreshToken = await provider.getRefreshToken();
      if (!refreshToken) {
        throw new ApiError({
          kind: 'unauthorized',
          status: 401,
          code: 'REFRESH_TOKEN_MISSING',
          message: 'No refresh token is available.',
        });
      }

      const url = `${baseUrl}/auth/refresh`;
      const response = await doFetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const raw = await readBody(response);
      if (!response.ok) {
        throw toApiError(response.status, raw);
      }

      const tokens = authSignInSchema.parse(raw) as AuthTokens;
      await provider.saveTokens(tokens);
    })();

    try {
      await refreshInProgress;
    } finally {
      refreshInProgress = undefined;
    }
  }

  async function buildHeaders(options: RequestOptions): Promise<Record<string, string>> {
    const headers: Record<string, string> = { Accept: 'application/json' };

    if (options.body !== undefined) headers['Content-Type'] = 'application/json';
    if (options.idempotencyKey) headers['Idempotency-Key'] = options.idempotencyKey;

    // Attached whenever a session exists, including on public routes: the server
    // uses it to personalise responses (a listing knows it is your favourite),
    // and one rule is easier to defend than a per-endpoint allow-list.
    const token = await config.tokenProvider?.getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    return headers;
  }

  return { request };
}

function buildQuery(query: QueryParams | undefined): string {
  if (!query) return '';
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    // Absent is absent: sending `?query=` would make an empty filter look like a
    // deliberate search for the empty string.
    if (value === undefined || value === null || value === '') continue;
    params.append(key, String(value));
  }
  const serialised = params.toString();
  return serialised ? `?${serialised}` : '';
}

/**
 * Reads the body without ever throwing. A 204, an empty body, or HTML from a
 * proxy all become `undefined`, which the schema then rejects on the success
 * path and `toApiError` degrades gracefully on the error path.
 */
async function readBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}

/**
 * Creates one key per user INTENT — call it when the user taps "Book", not on
 * every attempt.
 *
 * That distinction is the whole feature. A key generated per HTTP request would
 * differ on a retry, and the server would treat the retry as a new booking,
 * which is precisely what the header exists to prevent.
 *
 * Uses the platform CSPRNG and refuses to fall back to Math.random: the server
 * files these under `idem:<route>:<key>` without the user id, so a guessable key
 * could replay somebody else's stored response.
 */
export function createIdempotencyKey(): string {
  const uuid = globalThis.crypto?.randomUUID;
  if (typeof uuid !== 'function') {
    throw new Error(
      'crypto.randomUUID is unavailable. Install a CSPRNG polyfill (expo-crypto) ' +
        'rather than weakening idempotency keys to Math.random.',
    );
  }
  return globalThis.crypto.randomUUID();
}
