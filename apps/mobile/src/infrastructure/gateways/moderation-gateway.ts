import {
  listingDetailSchema,
  reportSchema,
  reportsResponseSchema,
  reviewSchema,
  type ListingDetail,
  type ReportResponse,
  type ReportsResponse,
  type ReviewResponse,
} from '@cerca/contract';
import { z } from 'zod';
import { apiClient } from '../api-client';

/** GET /v1/reports */
export async function getReports(cursor?: string): Promise<ReportsResponse> {
  return apiClient.request('/reports', reportsResponseSchema, {
    query: { cursor },
  });
}

/** POST /v1/reports/{id}/resolve */
export async function resolveReport(id: string): Promise<ReportResponse> {
  return apiClient.request(`/reports/${id}/resolve`, reportSchema, {
    method: 'POST',
  });
}

/** POST /v1/listings/{id}/moderate */
export async function moderateListing(
  listingId: string,
  status: 'under_review' | 'removed',
  reason?: string,
): Promise<ListingDetail> {
  return apiClient.request(`/listings/${listingId}/moderate`, listingDetailSchema, {
    method: 'POST',
    body: { status, reason },
  });
}

/** POST /v1/reviews/{id}/moderate */
export async function moderateReview(
  reviewId: string,
  action: 'approve' | 'remove',
  reason?: string,
): Promise<ReviewResponse> {
  return apiClient.request(`/reviews/${reviewId}/moderate`, reviewSchema, {
    method: 'POST',
    body: { action, reason },
  });
}

/** POST /v1/users/{id}/suspend */
export async function suspendUser(userId: string, reason: string): Promise<void> {
  await apiClient.request(`/users/${userId}/suspend`, z.undefined(), {
    method: 'POST',
    body: { reason },
  });
}
