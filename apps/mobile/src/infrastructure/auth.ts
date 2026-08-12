import type { AuthTokens } from "../application/ports/token-provider";

export interface AuthStorage {
  saveTokens(tokens: AuthTokens): Promise<void>;
  clear(): Promise<void>;
  getTokens(): Promise<AuthTokens | null>;
}
