import { z } from 'zod';
import { actorSchema as actorResponseSchema } from '../schemas';

export const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8).max(200),
    displayName: z.string().min(1).max(120),
    capacities: z.array(z.enum(['customer', 'provider'])).min(1).max(2).default(['customer']),
  })
  .strict();
export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1).max(200),
  })
  .strict();
export type SignInInput = z.infer<typeof signInSchema>;

export const refreshSchema = z.object({ refreshToken: z.string().min(1) }).strict();
export type RefreshInput = z.infer<typeof refreshSchema>;

export const signOutSchema = z.object({ refreshToken: z.string().min(1) }).strict();
export type SignOutInput = z.infer<typeof signOutSchema>;

export const authResultSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  actor: actorResponseSchema,
});
export type AuthResult = z.infer<typeof authResultSchema>;
