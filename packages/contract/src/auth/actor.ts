import type { UserId } from '../common/ids';

export type Capacity = 'customer' | 'provider';
export type PlatformRole = 'user' | 'moderator' | 'admin';

export interface Actor {
  readonly id: UserId;
  readonly capacities: readonly Capacity[];
  readonly platformRole: PlatformRole;
}

export type Permission =
  | 'listing:read'
  | 'listing:create'
  | 'listing:update'
  | 'listing:moderate'
  | 'booking:request'
  | 'booking:accept'
  | 'review:write'
  | 'review:moderate'
  | 'report:resolve'
  | 'user:suspend';

export interface OwnableResource {
  readonly ownerId: string;
}

export const has = (a: Actor, c: Capacity) => a.capacities.includes(c);

const CAPACITY_PERMISSIONS: Record<Capacity, Permission[]> = {
  customer: ['listing:read', 'booking:request', 'review:write'],
  provider: ['listing:read', 'listing:create', 'listing:update', 'booking:accept', 'review:write'],
};

const PLATFORM_PERMISSIONS: Record<PlatformRole, Permission[]> = {
  user: ['listing:read', 'booking:request', 'review:write'],
  moderator: ['listing:read', 'booking:request', 'review:write', 'listing:moderate', 'report:resolve', 'review:moderate'],
  admin: ['listing:read', 'listing:create', 'listing:update', 'listing:moderate', 'booking:request', 'booking:accept', 'review:write', 'review:moderate', 'report:resolve', 'user:suspend'],
};

export function can(actor: Actor, permission: Permission): boolean {
  const fromCapacities = actor.capacities.some((c) => CAPACITY_PERMISSIONS[c].includes(permission));
  const fromRole = PLATFORM_PERMISSIONS[actor.platformRole].includes(permission);
  return fromCapacities || fromRole;
}

export function canEditListing(actor: Actor, listing: OwnableResource): boolean {
  return can(actor, 'listing:update') && listing.ownerId === actor.id;
}
