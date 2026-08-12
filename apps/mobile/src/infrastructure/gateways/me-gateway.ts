import { actorSchema, type ActorResponse } from '@cerca/contract';
import { apiClient } from '../api-client';

/** GET /v1/me — fetches the current authenticated Actor profile. */
export async function getMe(): Promise<ActorResponse> {
  return apiClient.request('/me', actorSchema);
}

/** POST /v1/me/capacities/provider — upgrades current user account to have provider capacity. */
export async function addProviderCapacity(): Promise<ActorResponse> {
  return apiClient.request('/me/capacities/provider', actorSchema, {
    method: 'POST',
  });
}
