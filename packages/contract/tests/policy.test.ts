import { describe, expect, it } from 'vitest';
import { canEditListing, type Actor } from '../src/auth/actor';
import { canReviewBooking } from '../src/review/review.policy';

const providerActor: Actor = {
  id: 'user-1',
  capacities: ['customer', 'provider'],
  platformRole: 'user',
};

const customerOnlyActor: Actor = {
  id: 'user-1',
  capacities: ['customer'],
  platformRole: 'user',
};

const adminActor: Actor = {
  id: 'user-1',
  capacities: ['customer'],
  platformRole: 'admin',
};

const completedBooking = {
  id: 'booking-1',
  customerId: 'user-1',
  status: { kind: 'completed' as const, completedAt: new Date('2026-07-01T00:00:00.000Z').toISOString() },
  reviewId: null,
};

const listing = { ownerId: 'user-1' };

describe('@cerca/contract policies - canEditListing', () => {
  it('allows editing own listing when provider capacity is present', () => {
    expect(canEditListing(providerActor, listing)).toBe(true);
  });

  it('blocks editing another listing when provider capacity is present', () => {
    expect(canEditListing(providerActor, { ownerId: 'user-2' })).toBe(false);
  });

  it('blocks editing own listing if actor lacks listing:update capacity', () => {
    expect(canEditListing(customerOnlyActor, listing)).toBe(false);
  });

  it('allows editing own listing when admin role is present', () => {
    expect(canEditListing(adminActor, listing)).toBe(true);
  });

  it('blocks editing another listing even when admin role is present', () => {
    expect(canEditListing(adminActor, { ownerId: 'user-2' })).toBe(false);
  });
});

describe('@cerca/contract policies - canReviewBooking', () => {
  it('allows reviewing a completed booking within the 30-day window', () => {
    const now = new Date('2026-07-20T00:00:00.000Z');
    expect(canReviewBooking(providerActor, completedBooking, now)).toEqual({ ok: true });
  });

  it('allows reviewing at EXACTLY 30 days boundary', () => {
    // 30 days after 2026-07-01T00:00:00.000Z is 2026-07-31T00:00:00.000Z
    const exact30Days = new Date('2026-07-31T00:00:00.000Z');
    expect(canReviewBooking(providerActor, completedBooking, exact30Days)).toEqual({ ok: true });
  });

  it('blocks reviewing at JUST PAST 30 days boundary (30 days + 1 millisecond)', () => {
    const justPast30Days = new Date(new Date('2026-07-31T00:00:00.000Z').getTime() + 1);
    expect(canReviewBooking(providerActor, completedBooking, justPast30Days)).toEqual({
      ok: false,
      reason: 'window_closed',
    });
  });

  it('blocks reviewing when actor is not the customer', () => {
    const now = new Date('2026-07-20T00:00:00.000Z');
    expect(canReviewBooking({ ...providerActor, id: 'user-other' }, completedBooking, now)).toEqual({
      ok: false,
      reason: 'not_your_booking',
    });
  });

  it('blocks reviewing when booking is not completed', () => {
    const now = new Date('2026-07-20T00:00:00.000Z');
    const requestedBooking = {
      ...completedBooking,
      status: { kind: 'requested' as const, requestedAt: new Date('2026-07-01T00:00:00.000Z').toISOString() },
    };
    expect(canReviewBooking(providerActor, requestedBooking, now)).toEqual({
      ok: false,
      reason: 'not_completed',
    });
  });

  it('blocks reviewing when booking has already been reviewed', () => {
    const now = new Date('2026-07-20T00:00:00.000Z');
    const reviewedBooking = { ...completedBooking, reviewId: 'rev-100' };
    expect(canReviewBooking(providerActor, reviewedBooking, now)).toEqual({
      ok: false,
      reason: 'already_reviewed',
    });
  });

  it('blocks reviewing after the review window has closed', () => {
    const now = new Date('2026-09-01T00:00:00.000Z');
    expect(canReviewBooking(providerActor, completedBooking, now)).toEqual({
      ok: false,
      reason: 'window_closed',
    });
  });
});
