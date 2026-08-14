/**
 * Features the app has built and the API has not.
 *
 * A flag rather than deleted code: the screens, the optimistic update and the
 * rollback are all written and correct. What is missing is on the other side,
 * and `cerca-api` is delivered to this team read-only, so there is nothing to
 * fix here and nothing worth throwing away either.
 */

/**
 * Saving a listing to favourites.
 *
 * `POST /v1/listings/{id}/favorite` and `GET /v1/me/favorites` both answer 404:
 * `cerca-api` has a `Favorite` model in its Prisma schema but no controller, no
 * module and no use case. Verified against the running server, not read off the
 * docs.
 *
 * Left visible, the button failed on every tap and the 404 was rendered as
 * "this service is no longer available" — blaming the listing for a feature
 * that was never built, which is worse than not offering it.
 *
 * Flip to `true` the day the endpoints exist. Nothing else has to change.
 */
export const FAVOURITES_ENABLED = false;
