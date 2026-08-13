import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { createHttpClient } from "./http-client";
import meFixture from "../__fixtures__/me.json";
import problem401 from "../__fixtures__/problem.401.json";

const actorSchema = z.object({
  id: z.string(),
  capacities: z.array(z.enum(["customer", "provider"])),
  platformRole: z.enum(["user", "moderator", "admin"]),
});

const REFRESHED = {
  accessToken: "new-jwt",
  refreshToken: "new-refresh",
  actor: meFixture,
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type":
        status >= 400 ? "application/problem+json" : "application/json",
    },
  });

type Step = Response | "network-failure";

/**
 * A fetch driven by two queues, one per route, so a test can say "the first
 * call is a 401 and the second succeeds" without counting calls by hand.
 */
function scriptedFetch(script: { protected: Step[]; refresh: Step[] }) {
  return vi.fn(async (url: string) => {
    const queue = url.includes("/auth/refresh")
      ? script.refresh
      : script.protected;
    const step = queue.shift();

    if (step === undefined) throw new Error(`No scripted response for ${url}`);
    if (step === "network-failure") throw new TypeError("Network request failed");

    return step;
  }) as unknown as typeof fetch & { mock: { calls: unknown[][] } };
}

const tokenStub = (overrides: Record<string, unknown> = {}) => ({
  getAccessToken: async () => "stale-jwt",
  getRefreshToken: async () => "refresh-token",
  saveTokens: async () => {},
  ...overrides,
});

const refreshCalls = (fetchFn: { mock: { calls: unknown[][] } }) =>
  fetchFn.mock.calls.filter((call) => String(call[0]).includes("/auth/refresh"))
    .length;

describe("refreshing an expired session", () => {
  it("refreshes once and replays the original request", async () => {
    const saved: unknown[] = [];
    const fetchFn = scriptedFetch({
      protected: [json(problem401, 401), json(meFixture)],
      refresh: [json(REFRESHED)],
    });

    const client = createHttpClient({
      baseUrl: "http://localhost:3333/v1",
      fetchFn,
      tokenProvider: tokenStub({
        saveTokens: async (tokens: unknown) => {
          saved.push(tokens);
        },
      }),
    });

    const actor = await client.request("/me", actorSchema);

    expect(actor.id).toBe(meFixture.id);
    expect(refreshCalls(fetchFn)).toBe(1);
    expect(saved).toEqual([REFRESHED]);
  });

  it("gives up after one refresh instead of looping", async () => {
    // A second 401 on the replayed request means the new token is not the
    // problem. Retrying again would spend the rest of the session discovering
    // that, one round trip at a time.
    const fetchFn = scriptedFetch({
      protected: [json(problem401, 401), json(problem401, 401)],
      refresh: [json(REFRESHED)],
    });

    const client = createHttpClient({
      baseUrl: "http://localhost:3333/v1",
      fetchFn,
      tokenProvider: tokenStub(),
    });

    await expect(client.request("/me", actorSchema)).rejects.toThrowError();
    expect(refreshCalls(fetchFn)).toBe(1);
  });

  it("refreshes once for requests that expire together", async () => {
    // The single-flight guarantee. Three screens mounting at once produce three
    // 401s; three refreshes would race, and the last one to save would win with
    // tokens the other two had already replaced.
    const fetchFn = scriptedFetch({
      protected: [
        json(problem401, 401),
        json(problem401, 401),
        json(problem401, 401),
        json(meFixture),
        json(meFixture),
        json(meFixture),
      ],
      refresh: [json(REFRESHED)],
    });

    const client = createHttpClient({
      baseUrl: "http://localhost:3333/v1",
      fetchFn,
      tokenProvider: tokenStub(),
    });

    const actors = await Promise.all([
      client.request("/me", actorSchema),
      client.request("/me", actorSchema),
      client.request("/me", actorSchema),
    ]);

    expect(actors).toHaveLength(3);
    expect(refreshCalls(fetchFn)).toBe(1);
  });

  it("ends the session when the server refuses the refresh", async () => {
    const onSessionExpired = vi.fn();
    const fetchFn = scriptedFetch({
      protected: [json(problem401, 401)],
      refresh: [json(problem401, 401)],
    });

    const client = createHttpClient({
      baseUrl: "http://localhost:3333/v1",
      fetchFn,
      tokenProvider: tokenStub(),
      onSessionExpired,
    });

    await expect(client.request("/me", actorSchema)).rejects.toThrowError();
    expect(onSessionExpired).toHaveBeenCalledTimes(1);
  });

  it("keeps the session when the refresh cannot be delivered", async () => {
    // A blink of the Wi-Fi is not a revoked token. Signing the user out here
    // would lose their place for a problem that fixes itself.
    const onSessionExpired = vi.fn();
    const fetchFn = scriptedFetch({
      protected: [json(problem401, 401)],
      refresh: ["network-failure"],
    });

    const client = createHttpClient({
      baseUrl: "http://localhost:3333/v1",
      fetchFn,
      tokenProvider: tokenStub(),
      onSessionExpired,
    });

    await expect(client.request("/me", actorSchema)).rejects.toThrowError();
    expect(onSessionExpired).not.toHaveBeenCalled();
  });

  it("ends the session when there is no refresh token left to try", async () => {
    const onSessionExpired = vi.fn();
    const fetchFn = scriptedFetch({
      protected: [json(problem401, 401)],
      refresh: [],
    });

    const client = createHttpClient({
      baseUrl: "http://localhost:3333/v1",
      fetchFn,
      tokenProvider: tokenStub({ getRefreshToken: async () => null }),
      onSessionExpired,
    });

    await expect(client.request("/me", actorSchema)).rejects.toThrowError();
    expect(onSessionExpired).toHaveBeenCalledTimes(1);
    expect(refreshCalls(fetchFn)).toBe(0);
  });

  it("never tries to refresh the sign-in request itself", async () => {
    // Wrong credentials answer 401 too. Treating that as an expired session
    // would fire a refresh on every typo.
    const fetchFn = scriptedFetch({
      protected: [json(problem401, 401)],
      refresh: [],
    });

    const client = createHttpClient({
      baseUrl: "http://localhost:3333/v1",
      fetchFn,
      tokenProvider: tokenStub(),
    });

    await expect(
      client.request("/auth/sign-in", actorSchema, { method: "POST" }),
    ).rejects.toThrowError();
    expect(refreshCalls(fetchFn)).toBe(0);
  });
});
