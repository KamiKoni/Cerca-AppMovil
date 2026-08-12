import { describe, expect, it } from "vitest";
import { hasCapacity, isProvider } from "./actor";
import type { Actor } from "@cerca/contract";

const ACTOR_WITH_BOTH_CAPACITIES: Actor = {
  id: "user-1",
  capacities: ["customer", "provider"],
  platformRole: "user",
};

describe("actor capacities", () => {
  it("treats an actor with customer and provider capacities as a provider", () => {
    expect(isProvider(ACTOR_WITH_BOTH_CAPACITIES)).toBe(true);
    expect(hasCapacity(ACTOR_WITH_BOTH_CAPACITIES, "customer")).toBe(true);
    expect(hasCapacity(ACTOR_WITH_BOTH_CAPACITIES, "provider")).toBe(true);
  });
});
