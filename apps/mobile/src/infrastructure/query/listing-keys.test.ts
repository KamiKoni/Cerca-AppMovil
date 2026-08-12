import { describe, expect, it } from "vitest";
import { listingKeys } from "./listing-keys";

/** Mirrors how React Query decides whether a key falls under another one. */
const isPrefixOf = (
  prefix: readonly unknown[],
  key: readonly unknown[],
): boolean =>
  prefix.every(
    (segment, i) => JSON.stringify(segment) === JSON.stringify(key[i]),
  );

describe("listingKeys", () => {
  it("nests every key under a single root", () => {
    expect(listingKeys.all).toEqual(["listings"]);
    expect(listingKeys.searches()).toEqual(["listings", "search"]);
    expect(listingKeys.details()).toEqual(["listings", "detail"]);
    expect(listingKeys.mine()).toEqual(["listings", "mine"]);
    expect(listingKeys.detail("abc")).toEqual(["listings", "detail", "abc"]);
  });

  it("lets one invalidation reach every search", () => {
    // This is the hierarchy earning its keep: invalidating searches() after a
    // mutation refreshes all of them without enumerating filter combinations.
    const searches = listingKeys.searches();

    expect(isPrefixOf(searches, listingKeys.search({ query: "plumber" }))).toBe(
      true,
    );
    expect(
      isPrefixOf(searches, listingKeys.search({ categoryId: "cat-1" })),
    ).toBe(true);
    expect(isPrefixOf(listingKeys.all, listingKeys.detail("abc"))).toBe(true);
    expect(isPrefixOf(listingKeys.all, listingKeys.mine())).toBe(true);
  });

  it("does not let a detail key match the searches prefix", () => {
    expect(isPrefixOf(listingKeys.searches(), listingKeys.detail("abc"))).toBe(
      false,
    );
  });

  it("produces one key for a micro-movement of the map", () => {
    // The acceptance criterion, expressed as a key rather than as coordinates.
    const a = listingKeys.search({
      coords: { lat: 19.432608, lng: -99.133209 },
    });
    const b = listingKeys.search({
      coords: { lat: 19.432611, lng: -99.13321 },
    });

    expect(a).toEqual(b);
    expect(a[2]).toEqual({ coords: { lat: 19.43, lng: -99.13 } });
  });

  it("still separates searches that are genuinely far apart", () => {
    const medellin = listingKeys.search({
      coords: { lat: 6.2442, lng: -75.5812 },
    });
    const bogota = listingKeys.search({
      coords: { lat: 4.711, lng: -74.0721 },
    });

    expect(medellin).not.toEqual(bogota);
  });

  it("treats absent, undefined and blank filters as the same search", () => {
    const empty = listingKeys.search({});
    const undefinedQuery = listingKeys.search({ query: undefined });
    const blankQuery = listingKeys.search({ query: "   " });

    expect(undefinedQuery).toEqual(empty);
    expect(blankQuery).toEqual(empty);
  });

  it("trims the query but keeps its case", () => {
    expect(listingKeys.search({ query: "  plumber " })).toEqual(
      listingKeys.search({ query: "plumber" }),
    );
    // Case folding would merge two keys; if the server is case-sensitive that
    // merge would serve the wrong results. A duplicate entry is the safer cost.
    expect(listingKeys.search({ query: "Plumber" })).not.toEqual(
      listingKeys.search({ query: "plumber" }),
    );
  });

  it("separates searches that differ only by radius", () => {
    const near = listingKeys.search({
      coords: { lat: 6.24, lng: -75.58 },
      radiusKm: 5,
    });
    const wide = listingKeys.search({
      coords: { lat: 6.24, lng: -75.58 },
      radiusKm: 20,
    });

    // "Widen the radius" is an action offered on the empty state, so these two
    // must not share a cache entry.
    expect(near).not.toEqual(wide);
  });

  it("ignores the order the filters were written in", () => {
    const a = listingKeys.search({
      query: "plumber",
      categoryId: "cat-1",
      radiusKm: 5,
    });
    const b = listingKeys.search({
      radiusKm: 5,
      categoryId: "cat-1",
      query: "plumber",
    });

    expect(a).toEqual(b);
  });
});
