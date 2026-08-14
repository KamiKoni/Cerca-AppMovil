import { describe, expect, it } from "vitest";
import {
  isSchedulable,
  scheduleSlots,
  SLOT_OFFSETS_IN_DAYS,
} from "./booking-schedule";

const AT_NOON = new Date("2026-08-14T12:00:00.000Z");

describe("scheduleSlots", () => {
  it("offers one slot per configured offset, in order", () => {
    const slots = scheduleSlots(AT_NOON);

    expect(slots.map((s) => s.inDays)).toEqual([...SLOT_OFFSETS_IN_DAYS]);
  });

  it("puts every slot in the future", () => {
    // The whole point of the screen: a provider cannot accept for a date that
    // has already passed.
    for (const slot of scheduleSlots(AT_NOON)) {
      expect(new Date(slot.iso).getTime()).toBeGreaterThan(AT_NOON.getTime());
    }
  });

  it("stays in the future when the day is nearly over", () => {
    // 23:59 is where a naive "add one day, keep the time" lands on something
    // that is barely a minute away, or in the past once the request completes.
    const lateAtNight = new Date("2026-08-14T23:59:00.000Z");

    for (const slot of scheduleSlots(lateAtNight)) {
      expect(new Date(slot.iso).getTime()).toBeGreaterThan(
        lateAtNight.getTime(),
      );
    }
  });

  it("crosses a month boundary without producing an invalid date", () => {
    // 31 August + 7 days is 7 September, not the 38th.
    const endOfMonth = new Date("2026-08-31T12:00:00.000Z");

    for (const slot of scheduleSlots(endOfMonth)) {
      expect(Number.isNaN(new Date(slot.iso).getTime())).toBe(false);
    }
  });

  it("produces a string the server accepts as an instant", () => {
    for (const slot of scheduleSlots(AT_NOON)) {
      // The API validates scheduledFor as an ISO datetime.
      expect(slot.iso).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    }
  });
});

describe("isSchedulable", () => {
  it("accepts a future instant and refuses a past one", () => {
    expect(isSchedulable("2026-08-20T15:00:00.000Z", AT_NOON)).toBe(true);
    expect(isSchedulable("2026-08-01T15:00:00.000Z", AT_NOON)).toBe(false);
  });

  it("refuses the present moment", () => {
    expect(isSchedulable(AT_NOON.toISOString(), AT_NOON)).toBe(false);
  });

  it("refuses something that is not a date at all", () => {
    // Guards the case where a slot is round-tripped through storage or a
    // deep link and comes back as junk.
    expect(isSchedulable("next tuesday", AT_NOON)).toBe(false);
    expect(isSchedulable("", AT_NOON)).toBe(false);
  });

  it("still holds for a slot the user has been looking at for a while", () => {
    // The reason this check exists at all: the slots were computed when the
    // sheet opened, and the tap comes later.
    const [tomorrow] = scheduleSlots(AT_NOON);
    const twoDaysLater = new Date("2026-08-16T12:00:00.000Z");

    expect(isSchedulable(tomorrow.iso, AT_NOON)).toBe(true);
    expect(isSchedulable(tomorrow.iso, twoDaysLater)).toBe(false);
  });
});
