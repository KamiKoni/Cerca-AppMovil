/**
 * How a failed request is classified once the transport details are gone.
 *
 * These mirror the statuses the API actually produces (its DomainError kinds map
 * to 401/403/404/409/422), plus the two failures that never reach the server:
 * `network` when the request could not be sent, `unknown` for anything unmapped.
 */
export type ApiErrorKind =
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'conflict'
  | 'validation'
  | 'server'
  | 'network'
  | 'unknown';

/** One invalid field, as reported by the API's `errors[]` on a 422. */
export interface FieldError {
  readonly path: string;
  readonly message: string;
}

/**
 * A failed API call, in the app's own vocabulary.
 *
 * It lives in the domain because screens and policies branch on it, and it
 * carries `status` even though that is an HTTP concept: the number is data, not
 * a dependency, and "403 vs 404" is a distinction the UI genuinely has to make.
 * What it deliberately does NOT carry is a Response, a header bag, or anything
 * else that would drag the transport inwards.
 */
export class ApiError extends Error {
  /** Which class of failure this is. Callers switch on this, not on `status`. */
  readonly kind: ApiErrorKind;

  /** HTTP status, or 0 when the request never made it out. */
  readonly status: number;

  /** Stable machine-readable identifier, e.g. `LISTING_EDIT_FORBIDDEN`. */
  readonly code: string;

  /**
   * The policy reason behind a domain 403/409: `not_owner`, `already_reviewed`,
   * `window_closed`… It is an i18n KEY, not a message — screens render
   * `t(\`review.blocked.\${reason}\`)`. Absent on errors that no policy produced.
   */
  readonly reason: string | undefined;

  /** Field-level issues from a 422. Empty for every other kind. */
  readonly fieldErrors: readonly FieldError[];

  /** Server-side correlation id, for matching a user report against the logs. */
  readonly traceId: string | undefined;

  constructor(props: {
    kind: ApiErrorKind;
    status: number;
    code: string;
    /**
     * English, server-authored, for developers and logs. Never rendered: the app
     * is bilingual and the server does not know the user's locale.
     */
    message: string;
    reason?: string;
    fieldErrors?: readonly FieldError[];
    traceId?: string;
  }) {
    super(props.message);
    this.name = 'ApiError';
    this.kind = props.kind;
    this.status = props.status;
    this.code = props.code;
    this.reason = props.reason;
    this.fieldErrors = props.fieldErrors ?? [];
    this.traceId = props.traceId;
  }
}

/**
 * True for the two kinds that must never be retried. Re-asking for a permission
 * that was denied cannot change the answer; it just delays the error by three
 * round trips and burns the user's data allowance.
 */
export const isAuthorizationError = (error: unknown): boolean =>
  error instanceof ApiError && (error.kind === 'unauthorized' || error.kind === 'forbidden');
