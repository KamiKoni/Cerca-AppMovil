"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.has = void 0;
exports.can = can;
exports.canEditListing = canEditListing;
const has = (a, c) => a.capacities.includes(c);
exports.has = has;
const CAPACITY_PERMISSIONS = {
    customer: ["listing:read", "booking:request", "review:write"],
    provider: [
        "listing:read",
        "listing:create",
        "listing:update",
        "booking:accept",
        "review:write",
    ],
};
const PLATFORM_PERMISSIONS = {
    user: ["listing:read", "booking:request", "review:write"],
    moderator: [
        "listing:read",
        "booking:request",
        "review:write",
        "listing:moderate",
        "report:resolve",
        "review:moderate",
    ],
    admin: [
        "listing:read",
        "listing:create",
        "listing:update",
        "listing:moderate",
        "booking:request",
        "booking:accept",
        "review:write",
        "review:moderate",
        "report:resolve",
        "user:suspend",
    ],
};
function can(actor, permission) {
    const fromCapacities = actor.capacities.some((c) => CAPACITY_PERMISSIONS[c].includes(permission));
    const fromRole = PLATFORM_PERMISSIONS[actor.platformRole].includes(permission);
    return fromCapacities || fromRole;
}
function canEditListing(actor, listing) {
    return can(actor, "listing:update") && listing.ownerId === actor.id;
}
