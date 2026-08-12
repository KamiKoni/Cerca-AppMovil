import { z } from "zod";
export declare const signUpSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    displayName: z.ZodString;
    capacities: z.ZodDefault<z.ZodArray<z.ZodEnum<["customer", "provider"]>, "many">>;
}, "strict", z.ZodTypeAny, {
    capacities: ("customer" | "provider")[];
    email: string;
    password: string;
    displayName: string;
}, {
    email: string;
    password: string;
    displayName: string;
    capacities?: ("customer" | "provider")[] | undefined;
}>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export declare const signInSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strict", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type SignInInput = z.infer<typeof signInSchema>;
export declare const refreshSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strict", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export declare const signOutSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strict", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export type SignOutInput = z.infer<typeof signOutSchema>;
export declare const authResultSchema: z.ZodObject<{
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
    actor: z.ZodObject<{
        id: z.ZodString;
        capacities: z.ZodArray<z.ZodEnum<["customer", "provider"]>, "atleastone">;
        platformRole: z.ZodEnum<["user", "moderator", "admin"]>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        capacities: ["customer" | "provider", ...("customer" | "provider")[]];
        platformRole: "user" | "moderator" | "admin";
    }, {
        id: string;
        capacities: ["customer" | "provider", ...("customer" | "provider")[]];
        platformRole: "user" | "moderator" | "admin";
    }>;
}, "strip", z.ZodTypeAny, {
    accessToken: string;
    refreshToken: string;
    actor: {
        id: string;
        capacities: ["customer" | "provider", ...("customer" | "provider")[]];
        platformRole: "user" | "moderator" | "admin";
    };
}, {
    accessToken: string;
    refreshToken: string;
    actor: {
        id: string;
        capacities: ["customer" | "provider", ...("customer" | "provider")[]];
        platformRole: "user" | "moderator" | "admin";
    };
}>;
export type AuthResult = z.infer<typeof authResultSchema>;
