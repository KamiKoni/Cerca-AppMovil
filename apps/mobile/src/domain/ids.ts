/**
 * Identifier aliases. The API issues UUIDs for every resource; naming them makes
 * signatures read as intent (`detail(id: ListingId)`) instead of `string`.
 *
 * These belong in @cerca/contract eventually — the package already exports
 * `UserId` but no resource ids. Kept local until that is agreed.
 */
export type ListingId = string;
export type BookingId = string;
export type CategoryId = string;
