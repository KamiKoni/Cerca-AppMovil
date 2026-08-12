import type { Capacity, Permission, PlatformRole } from "./actor";

export const CAPACITY_PERMISSIONS: Record<Capacity, readonly Permission[]> = {
  customer: ["listing:read", "booking:request", "review:write"],
  provider: [
    "listing:read",
    "listing:create",
    "listing:update",
    "booking:accept",
    "review:write",
  ],
};

export const PLATFORM_PERMISSIONS: Record<PlatformRole, readonly Permission[]> =
  {
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
