import type { AuthSignInResponse } from "@cerca/contract";

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface AuthService {
  signIn(credentials: SignInCredentials): Promise<AuthSignInResponse>;
  signOut(): Promise<void>;
}
