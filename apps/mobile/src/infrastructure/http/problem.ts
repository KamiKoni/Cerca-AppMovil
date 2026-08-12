import { z } from "zod";
import {
  ApiError,
  type ApiErrorKind,
  type FieldError,
} from "../../domain/errors";

/**
 * RFC 9457 `application/problem+json`, as this API actually emits it.
 *
 * It is defined here rather than taken from @cerca/contract because the shared
 * schema is missing three fields the server always sends — `code`, `traceId` and
 * the 422 `errors[]` — and Zod drops what a schema does not declare. `code` in
 * particular is the field this whole mapping branches on. Reported to Argenis;
 * this schema goes away when the shared one carries them.
 */
export const problemDetailsSchema = z.object({
  type: z.string(),
  title: z.string(),
  status: z.number().int(),
  code: z.string(),
  detail: z.string().optional(),
  instance: z.string().optional(),
  /** Present only on the domain 403/409 raised by a policy. */
  reason: z.string().optional(),
  errors: z
    .array(z.object({ path: z.string(), message: z.string() }))
    .optional(),
  traceId: z.string().optional(),
});

export type ProblemDetails = z.infer<typeof problemDetailsSchema>;

/**
 * The API's status codes, in the app's vocabulary. Mirrors the server's own
 * DomainError table, so the two stay legible side by side.
 */
export function kindForStatus(status: number): ApiErrorKind {
  switch (status) {
    case 401:
      return "unauthorized";
    case 403:
      return "forbidden";
    case 404:
      return "not_found";
    case 409:
      return "conflict";
    case 422:
      return "validation";
    default:
      return status >= 500 ? "server" : "unknown";
  }
}

/**
 * Turns an error response body into a typed domain error.
 *
 * Uses `safeParse`, and this is the one place where that is the right call
 * instead of `parse`. On a success payload a validation failure is real news and
 * must be thrown. Here, throwing would REPLACE the server's 403 with a ZodError
 * about the shape of the 403 — the actual failure would be lost, and the user
 * would see "something went wrong" instead of "you already reviewed this".
 * So a body that does not conform degrades to an error built from the status,
 * which is always trustworthy because it comes from the status line.
 */
export function toApiError(status: number, body: unknown): ApiError {
  const parsed = problemDetailsSchema.safeParse(body);

  if (!parsed.success) {
    return new ApiError({
      kind: kindForStatus(status),
      status,
      code: "MALFORMED_PROBLEM_RESPONSE",
      message: `The server returned ${status} with a body that is not problem+json.`,
    });
  }

  const problem = parsed.data;
  return new ApiError({
    // The status line wins over the body: they always agree here, but a proxy
    // rewriting one of them must not be able to downgrade an error's class.
    kind: kindForStatus(status),
    status,
    code: problem.code,
    message: problem.detail ?? problem.title,
    reason: problem.reason,
    fieldErrors: problem.errors as readonly FieldError[] | undefined,
    traceId: problem.traceId,
  });
}
