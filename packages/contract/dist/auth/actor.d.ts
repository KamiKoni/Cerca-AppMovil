export type Capacity = 'customer' | 'provider';
export type PlatformRole = 'user' | 'moderator' | 'admin';
export type UserId = string;
export interface Actor {
    readonly id: UserId;
    readonly capacities: readonly Capacity[];
    readonly platformRole: PlatformRole;
}
export type Permission = 'listing:read' | 'listing:create' | 'listing:update' | 'listing:moderate' | 'booking:request' | 'booking:accept' | 'review:write' | 'review:moderate' | 'report:resolve' | 'user:suspend';
export interface OwnableResource {
    readonly ownerId: string;
}
export declare const has: (a: Actor, c: Capacity) => boolean;
export declare function can(actor: Actor, permission: Permission): boolean;
export declare function canEditListing(actor: Actor, listing: OwnableResource): boolean;
