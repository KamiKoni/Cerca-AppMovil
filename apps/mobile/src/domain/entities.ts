import type { Capacity, PlatformRole } from './actor';

export type ActorEntity = {
  readonly id: string;
  readonly capacities: readonly Capacity[];
  readonly platformRole: PlatformRole;
};
