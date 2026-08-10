import { describe, expect, it } from 'vitest';
import { SNAP_DECIMALS, snapToGrid } from './geo';

describe('snapToGrid', () => {
  it('collapses a micro-movement of the map onto the same cell', () => {
    // The exact pair from the brief: ~30 cm apart, which is noise from the GPS,
    // not a new search. Before snapping these are two different cache keys.
    const a = snapToGrid({ lat: 19.432608, lng: -99.133209 });
    const b = snapToGrid({ lat: 19.432611, lng: -99.13321 });

    expect(a).toEqual(b);
    expect(a).toEqual({ lat: 19.43, lng: -99.13 });
  });

  it('keeps genuinely different places in different cells', () => {
    // ~2.2 km apart in latitude: a real move, and it must invalidate the cache.
    const here = snapToGrid({ lat: 6.2442, lng: -75.5812 });
    const there = snapToGrid({ lat: 6.2642, lng: -75.5812 });

    expect(here).not.toEqual(there);
  });

  it('is idempotent, which is what lets the key factory apply it defensively', () => {
    const once = snapToGrid({ lat: 6.2442, lng: -75.5812 });
    const twice = snapToGrid(once);

    expect(twice).toEqual(once);
  });

  it('rounds to SNAP_DECIMALS places in both hemispheres', () => {
    expect(snapToGrid({ lat: -33.868821, lng: 151.209295 })).toEqual({ lat: -33.87, lng: 151.21 });
    expect(SNAP_DECIMALS).toBe(2);
  });

  it('normalises negative zero, so the key stays canonical', () => {
    // Math.round(-0.001 * 100) is -0. Object.is(-0, 0) is false, and a cache key
    // must not depend on which side of the equator a rounding error landed on.
    const snapped = snapToGrid({ lat: -0.001, lng: -0.004 });

    expect(Object.is(snapped.lat, 0)).toBe(true);
    expect(Object.is(snapped.lng, 0)).toBe(true);
  });

  it('leaves an already-coarse coordinate untouched', () => {
    expect(snapToGrid({ lat: 40.42, lng: -3.7 })).toEqual({ lat: 40.42, lng: -3.7 });
  });
});
