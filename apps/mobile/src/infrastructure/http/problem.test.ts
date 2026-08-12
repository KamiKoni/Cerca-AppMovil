import { describe, expect, it } from "vitest";
import { problemDetailsSchema as sharedProblemSchema } from "@cerca/contract";
import { kindForStatus, toApiError } from "./problem";

// Real responses captured from the running backend, not hand-written JSON.
// If the server changes an error shape, re-capturing the fixtures makes these
// tests fail — which is the point.
import problem401 from "../__fixtures__/problem.401.json";
import problem403 from "../__fixtures__/problem.403-not-owner.json";
import problem404 from "../__fixtures__/problem.404.json";
import problem422Validation from "../__fixtures__/problem.422-validation.json";
import problem422Idempotency from "../__fixtures__/problem.422-idempotency-key-required.json";
import problem422Location from "../__fixtures__/problem.422-location-required.json";

describe("toApiError", () => {
  it("carries the machine-readable reason of a policy 403", () => {
    const error = toApiError(403, problem403);

    expect(error.kind).toBe("forbidden");
    expect(error.code).toBe("LISTING_EDIT_FORBIDDEN");
    // The field the i18n story hangs on: the screen renders
    // t(`listing.blocked.${reason}`) without duplicating the rule.
    expect(error.reason).toBe("not_owner");
    expect(error.traceId).toBeDefined();
  });

  it("maps an unauthenticated response without inventing a reason", () => {
    const error = toApiError(401, problem401);

    expect(error.kind).toBe("unauthorized");
    expect(error.code).toBe("UNAUTHENTICATED");
    // No policy produced this, so there is no reason. Absent, not empty string.
    expect(error.reason).toBeUndefined();
  });

  it("maps a missing resource", () => {
    const error = toApiError(404, problem404);

    expect(error.kind).toBe("not_found");
    expect(error.code).toBe("LISTING_NOT_FOUND");
  });

  it("keeps the field-level issues of a validation failure", () => {
    const error = toApiError(422, problem422Validation);

    expect(error.kind).toBe("validation");
    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.fieldErrors.map((f) => f.path)).toEqual(["email", "password"]);
  });

  it("distinguishes the two 422s the data layer has to act on differently", () => {
    // Same status, same kind — only `code` separates "you forgot the header"
    // from "you did not give me a location". This is why code must survive.
    expect(toApiError(422, problem422Idempotency).code).toBe(
      "IDEMPOTENCY_KEY_REQUIRED",
    );
    expect(toApiError(422, problem422Location).code).toBe("LOCATION_REQUIRED");
  });

  it("never throws on a body that is not problem+json", () => {
    // Throwing here would replace the server's real failure with a ZodError
    // about the shape of the failure, and the user would lose the actual reason.
    const error = toApiError(503, "<html>502 Bad Gateway</html>");

    expect(error.kind).toBe("server");
    expect(error.code).toBe("MALFORMED_PROBLEM_RESPONSE");
    expect(error.status).toBe(503);
  });

  it("trusts the status line over the body", () => {
    const error = toApiError(403, { ...problem404, status: 404 });

    expect(error.kind).toBe("forbidden");
  });

  it("documents why this schema is not the shared one", () => {
    // Regression guard: @cerca/contract's problemDetailsSchema parses the same
    // payload happily but drops `code`, `traceId` and `errors[]`, because Zod
    // strips what a schema does not declare. Delete this test — and the local
    // schema — once the shared one carries them.
    const viaShared = sharedProblemSchema.parse(problem403) as Record<
      string,
      unknown
    >;

    expect(viaShared.code).toBeUndefined();
    expect(viaShared.traceId).toBeUndefined();
    expect(toApiError(403, problem403).code).toBe("LISTING_EDIT_FORBIDDEN");
  });
});

describe("kindForStatus", () => {
  it("mirrors the statuses the API produces", () => {
    expect(kindForStatus(401)).toBe("unauthorized");
    expect(kindForStatus(403)).toBe("forbidden");
    expect(kindForStatus(404)).toBe("not_found");
    expect(kindForStatus(409)).toBe("conflict");
    expect(kindForStatus(422)).toBe("validation");
    expect(kindForStatus(500)).toBe("server");
    expect(kindForStatus(418)).toBe("unknown");
  });
});
