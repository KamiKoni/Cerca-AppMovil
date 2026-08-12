"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLATFORM_PERMISSIONS = exports.CAPACITY_PERMISSIONS = void 0;
exports.CAPACITY_PERMISSIONS = {
    customer: ["listing:read", "booking:request", "review:write"],
    provider: [
        "listing:read",
        "listing:create",
        "listing:update",
        "booking:accept",
        "review:write",
    ],
};
exports.PLATFORM_PERMISSIONS = {
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
