import { createElement, Fragment, type ReactNode } from "react";
import { can, type Capacity, type Permission } from "@cerca/contract";
import { useActor } from "./SessionProvider";

export function useCan(permission: Permission): boolean {
  const actor = useActor();
  return actor ? can(actor, permission) : false;
}

export function Can({
  permission,
  children,
  fallback = null,
}: {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return createElement(
    Fragment,
    null,
    useCan(permission) ? children : fallback,
  );
}

export function withCapacity(capacity: Capacity): boolean {
  const actor = useActor();
  return actor?.capacities.includes(capacity) ?? false;
}
