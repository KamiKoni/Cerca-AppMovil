import { describe, expect, it } from "vitest";
import { mapProblemReasonToI18nKey } from "./authorizationMapper";

describe("mapProblemReasonToI18nKey", () => {
  it("returns the namespaced key for a known reason", () => {
    expect(mapProblemReasonToI18nKey("not_owner", "listing.blocked")).toBe(
      "listing.blocked.not_owner",
    );
  });

  it("falls back to the unknown key when reason is undefined", () => {
    expect(mapProblemReasonToI18nKey(undefined, "listing.blocked")).toBe(
      "listing.blocked.unknown",
    );
  });
});
