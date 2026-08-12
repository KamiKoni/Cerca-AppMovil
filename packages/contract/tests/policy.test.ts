import { describe, expect, it } from 'vitest';
import { canEditListing } from '../src/auth/actor';
import { canReviewBooking } from '../src/review/review.policy';
import type { Actor } from '../src/auth/actor';

const actor: Actor = {
  id: 'user-1',
  capacities: ['customer', 'provider'],
  platformRole: 'user',
};

const completedBooking = {
  id: 'booking-1',
  customerId: 'user-1',
  status: { kind: 'completed' as const, completedAt: new Date('2026-07-01').toISOString() },
  reviewId: null,
};

const listing = { ownerId: 'user-1' };

describe('@cerca/contract policies', () => {
  it('allows editing own listing when provider', () => {
    expect(canEditListing(actor, listing)).toBe(true);
  });

  it('blocks editing another listing', () => {
    expect(canEditListing(actor, { ownerId: 'user-2' })).toBe(false);
  });

  it('allows reviewing a completed booking within the window', () => {
    const now = new Date('2026-07-20');
    expect(canReviewBooking(actor, completedBooking, now)).toEqual({ ok: true });
  });

  it('blocks reviewing when actor is not the customer', () => {
    const now = new Date('2026-07-20');
    expect(canReviewBooking({ ...actor, id: 'user-other' }, completedBooking, now)).toEqual({
      ok: false,
      reason: 'not_your_booking',
    });
  });

  it('blocks reviewing when booking is not completed', () => {
    const now = new Date('2026-07-20');
    const requestedBooking = {
      ...completedBooking,
      status: { kind: 'requested' as const, requestedAt: new Date('2026-07-01').toISOString() },
    };
    expect(canReviewBooking(actor, requestedBooking, now)).toEqual({
      ok: false,
      reason: 'not_completed',
    });
  });

  it('blocks reviewing when booking has already been reviewed', () => {
    const now = new Date('2026-07-20');
    const reviewedBooking = { ...completedBooking, reviewId: 'rev-100' };
    expect(canReviewBooking(actor, reviewedBooking, now)).toEqual({
      ok: false,
      reason: 'already_reviewed',
    });
  });

  it('blocks reviewing after the review window has closed', () => {
    const now = new Date('2026-09-01');
    expect(canReviewBooking(actor, completedBooking, now)).toEqual({
      ok: false,
      reason: 'window_closed',
    });
  });
});
