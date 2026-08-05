export type ListingStatus =
  | { kind: 'draft' }
  | { kind: 'published'; publishedAt: string }
  | { kind: 'paused' }
  | { kind: 'under_review'; reportId: string }
  | { kind: 'removed'; removedBy: string; reason: string };

export type BookingStatus =
  | { kind: 'requested'; requestedAt: string }
  | { kind: 'accepted'; acceptedAt: string; scheduledFor: string }
  | { kind: 'declined'; reason: string }
  | { kind: 'completed'; completedAt: string }
  | { kind: 'cancelled'; cancelledBy: string; at: string };
