import type { Actor } from '@cerca/contract';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  actor: Actor;
};

export interface AuthStorage {
  saveTokens(tokens: AuthTokens): Promise<void>;
  clear(): Promise<void>;
  getTokens(): Promise<AuthTokens | null>;
}
