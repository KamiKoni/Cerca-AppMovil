import { describe, expect, it } from 'vitest';
import { canEditListing } from '../src/auth/actor';
import { canReviewBooking, REVIEW_WINDOW_DAYS } from '../src/review/review.policy';
import type { Actor } from '../src/auth/actor';

const actor: Actor = {
  id: 'user-1',
  capacities: ['provider'],
  platformRole: 'user',
};

const booking = {
  id: 'booking-1',
  customerId: 'user-1',
  status: { kind: 'completed', completedAt: new Date('2026-07-01').toISOString() },
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
    expect(canReviewBooking(actor, booking, now)).toEqual({ ok: true });
  });

  it('blocks reviewing after the review window has closed', () => {
    const now = new Date('2026-09-01');
    expect(canReviewBooking(actor, booking, now)).toEqual({ ok: false, reason: 'window_closed' });
  });
});
