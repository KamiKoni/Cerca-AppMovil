/** A date a provider can offer when accepting, as an ISO instant. */
export interface ScheduleSlot {
  /** Days from today. The label is built from this, in the reader's locale. */
  readonly inDays: number;
  /** What goes on the wire: `scheduledFor`. */
  readonly iso: string;
}

/** 09:00 local time. A booking accepted "for Tuesday" means Tuesday morning. */
const DEFAULT_HOUR = 9;

export const SLOT_OFFSETS_IN_DAYS = [1, 2, 3, 7] as const;

/**
 * The dates offered when accepting a request.
 *
 * Fixed offsets rather than a calendar because a calendar is a native module
 * and this screen has to run in Expo Go. The trade is real and worth naming: a
 * provider cannot yet offer an arbitrary date. What it buys is that the choice
 * is a pure function of `now`, so the rule that a scheduled date must be in the
 * future is testable without a device.
 *
 * `now` is a parameter, never `new Date()` inside: a function that reads the
 * clock cannot be tested at a chosen moment, and "tomorrow" is exactly the kind
 * of value that behaves differently at 23:59.
 */
export function scheduleSlots(now: Date): ScheduleSlot[] {
  return SLOT_OFFSETS_IN_DAYS.map((inDays) => ({
    inDays,
    iso: atLocalHour(now, inDays, DEFAULT_HOUR).toISOString(),
  }));
}

function atLocalHour(now: Date, inDays: number, hour: number): Date {
  const date = new Date(now);
  date.setDate(date.getDate() + inDays);
  date.setHours(hour, 0, 0, 0);
  return date;
}

/**
 * Whether a date can still be offered.
 *
 * The server has the final say — it knows about the provider's other bookings
 * and this screen does not. This only rules out the one case the UI can be sure
 * of: a slot the user has been staring at long enough for it to fall into the
 * past.
 */
export function isSchedulable(iso: string, now: Date): boolean {
  const at = new Date(iso).getTime();
  return Number.isFinite(at) && at > now.getTime();
}
