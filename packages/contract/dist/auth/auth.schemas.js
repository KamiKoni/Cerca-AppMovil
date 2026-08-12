"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authResultSchema = exports.signOutSchema = exports.refreshSchema = exports.signInSchema = exports.signUpSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../schemas");
exports.signUpSchema = zod_1.z
    .object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).max(200),
    displayName: zod_1.z.string().min(1).max(120),
    capacities: zod_1.z
        .array(zod_1.z.enum(["customer", "provider"]))
        .min(1)
        .max(2)
        .default(["customer"]),
})
    .strict();
exports.signInSchema = zod_1.z
    .object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1).max(200),
})
    .strict();
exports.refreshSchema = zod_1.z
    .object({ refreshToken: zod_1.z.string().min(1) })
    .strict();
exports.signOutSchema = zod_1.z
    .object({ refreshToken: zod_1.z.string().min(1) })
    .strict();
exports.authResultSchema = zod_1.z.object({
    accessToken: zod_1.z.string(),
    refreshToken: zod_1.z.string(),
    actor: schemas_1.actorSchema,
});
