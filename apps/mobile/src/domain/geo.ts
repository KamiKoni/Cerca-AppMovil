/**
 * Geographic coordinates as they travel through the app. Latitude and longitude
 * only: nothing in the search flow needs accuracy or a timestamp.
 */
export interface Coords {
  readonly lat: number;
  readonly lng: number;
}

/**
 * Two decimals of latitude is ~1.1 km. Longitude cells shrink as latitude grows
 * (~1.1 km at the equator, ~0.8 km in Bogota), so a cell is not a square — and it
 * does not need to be. The goal is a coarse, stable cell, not an exact distance.
 */
export const SNAP_DECIMALS = 2;

const FACTOR = 10 ** SNAP_DECIMALS;

/**
 * Rounds coordinates onto a ~1 km grid so that panning the map by a few metres
 * keeps producing the SAME value, and therefore the same cache key. Without it,
 * continuous coordinates make every pixel of map movement a new cache entry.
 *
 * Idempotent: snapping an already-snapped value returns it unchanged. That is
 * what lets `listingKeys.search()` apply it defensively without callers having
 * to track whether it was applied already.
 */
export function snapToGrid(coords: Coords): Coords {
  return { lat: snap(coords.lat), lng: snap(coords.lng) };
}

function snap(value: number): number {
  const rounded = Math.round(value * FACTOR) / FACTOR;
  // Math.round(-0.001 * 100) evaluates to -0, and Object.is(-0, 0) is false.
  // A cache key has to be canonical, so collapse the negative zero.
  return rounded === 0 ? 0 : rounded;
}
