import { z } from 'zod';
/** Every list paginates by keyset cursor — never OFFSET. `?cursor=&limit=`. */
export declare const paginationQuerySchema: z.ZodObject<{
    cursor: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    cursor?: string | undefined;
}, {
    cursor?: string | undefined;
    limit?: number | undefined;
}>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
/** Uniform page envelope: `{ items, nextCursor }`. `nextCursor === null` ⇒ last page. */
export interface Page<T> {
    items: T[];
    nextCursor: string | null;
}
