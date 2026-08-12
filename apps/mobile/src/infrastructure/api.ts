import { z } from 'zod';
import {
  authSignInSchema,
  AuthSignInResponse,
  listingSummarySchema,
  listingsSearchResponseSchema,
  ListingSummary,
  ListingsSearchResponse,
  problemDetailsSchema,
} from '@cerca/contract';

const API_BASE = 'https://api.cerca.app/v1';

async function parseResponse<T>(response: Response, schema: z.ZodType<T>): Promise<T> {
  const raw = await response.json();
  if (response.ok) {
    return schema.parse(raw);
  }

  if (response.headers.get('content-type')?.includes('application/problem+json')) {
    const problem = problemDetailsSchema.parse(raw);
    throw new Error(problem.reason ?? problem.title);
  }

  throw new Error('api.unknown_error');
}

export async function signIn(email: string, password: string): Promise<AuthSignInResponse> {
  const response = await fetch(`${API_BASE}/auth/sign-in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return parseResponse(response, authSignInSchema);
}

export async function searchListings(query: string): Promise<ListingsSearchResponse> {
  const response = await fetch(`${API_BASE}/listings?query=${encodeURIComponent(query)}&limit=20`);
  return parseResponse(response, listingsSearchResponseSchema);
}

export async function getListingSummary(id: string): Promise<ListingSummary> {
  const response = await fetch(`${API_BASE}/listings/${id}`);
  return parseResponse(response, listingSummarySchema);
}
