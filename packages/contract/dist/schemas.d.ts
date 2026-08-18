import { z } from "zod";
import type { BookingStatus } from "./status";
export declare const moneySchema: z.ZodObject<{
    amountMinor: z.ZodNumber;
    currency: z.ZodString;
}, "strip", z.ZodTypeAny, {
    amountMinor: number;
    currency: string;
}, {
    amountMinor: number;
    currency: string;
}>;
export declare const pricingFixed: z.ZodObject<{
    model: z.ZodLiteral<"fixed">;
    price: z.ZodObject<{
        amountMinor: z.ZodNumber;
        currency: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        amountMinor: number;
        currency: string;
    }, {
        amountMinor: number;
        currency: string;
    }>;
}, "strip", z.ZodTypeAny, {
    model: "fixed";
    price: {
        amountMinor: number;
        currency: string;
    };
}, {
    model: "fixed";
    price: {
        amountMinor: number;
        currency: string;
    };
}>;
export declare const pricingHourly: z.ZodObject<{
    model: z.ZodLiteral<"hourly">;
    hourlyRate: z.ZodObject<{
        amountMinor: z.ZodNumber;
        currency: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        amountMinor: number;
        currency: string;
    }, {
        amountMinor: number;
        currency: string;
    }>;
    minimumHours: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    model: "hourly";
    hourlyRate: {
        amountMinor: number;
        currency: string;
    };
    minimumHours: number;
}, {
    model: "hourly";
    hourlyRate: {
        amountMinor: number;
        currency: string;
    };
    minimumHours: number;
}>;
export declare const pricingQuote: z.ZodObject<{
    model: z.ZodLiteral<"quote">;
    startingFrom: z.ZodOptional<z.ZodObject<{
        amountMinor: z.ZodNumber;
        currency: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        amountMinor: number;
        currency: string;
    }, {
        amountMinor: number;
        currency: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    model: "quote";
    startingFrom?: {
        amountMinor: number;
        currency: string;
    } | undefined;
}, {
    model: "quote";
    startingFrom?: {
        amountMinor: number;
        currency: string;
    } | undefined;
}>;
export declare const pricingSchema: z.ZodUnion<[z.ZodObject<{
    model: z.ZodLiteral<"fixed">;
    price: z.ZodObject<{
        amountMinor: z.ZodNumber;
        currency: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        amountMinor: number;
        currency: string;
    }, {
        amountMinor: number;
        currency: string;
    }>;
}, "strip", z.ZodTypeAny, {
    model: "fixed";
    price: {
        amountMinor: number;
        currency: string;
    };
}, {
    model: "fixed";
    price: {
        amountMinor: number;
        currency: string;
    };
}>, z.ZodObject<{
    model: z.ZodLiteral<"hourly">;
    hourlyRate: z.ZodObject<{
        amountMinor: z.ZodNumber;
        currency: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        amountMinor: number;
        currency: string;
    }, {
        amountMinor: number;
        currency: string;
    }>;
    minimumHours: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    model: "hourly";
    hourlyRate: {
        amountMinor: number;
        currency: string;
    };
    minimumHours: number;
}, {
    model: "hourly";
    hourlyRate: {
        amountMinor: number;
        currency: string;
    };
    minimumHours: number;
}>, z.ZodObject<{
    model: z.ZodLiteral<"quote">;
    startingFrom: z.ZodOptional<z.ZodObject<{
        amountMinor: z.ZodNumber;
        currency: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        amountMinor: number;
        currency: string;
    }, {
        amountMinor: number;
        currency: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    model: "quote";
    startingFrom?: {
        amountMinor: number;
        currency: string;
    } | undefined;
}, {
    model: "quote";
    startingFrom?: {
        amountMinor: number;
        currency: string;
    } | undefined;
}>]>;
/**
 * The wire format the API actually sends: a flat string, not a tagged union.
 *
 * `status.ts` keeps the richer `ListingStatus` union that the domain policies
 * reason about. These are two different things — transport and domain — and
 * conflating them is what made every listing response fail to parse.
 */
export declare const listingStatusSchema: z.ZodEnum<["draft", "published", "paused", "under_review", "removed"]>;
/**
 * The status field exactly as the API sends it: one of five strings.
 *
 * It used to be modelled here as a discriminated union, which meant
 * `bookingSchema.parse` rejected every real response with
 * "Expected object, received string" — the booking list could not read its own
 * data. The union still exists, as `BookingStatus`, on the far side of
 * `toBookingStatus`.
 */
export declare const bookingStatusKindSchema: z.ZodEnum<["requested", "accepted", "declined", "completed", "cancelled"]>;
export declare const declineReasonSchema: z.ZodEnum<["unavailable", "not_a_fit", "other"]>;
export declare const actorSchema: z.ZodObject<{
    id: z.ZodString;
    capacities: z.ZodArray<z.ZodEnum<["customer", "provider"]>, "atleastone">;
    platformRole: z.ZodEnum<["user", "moderator", "admin"]>;
}, "strip", z.ZodTypeAny, {
    id: string;
    capacities: ["customer" | "provider", ...("customer" | "provider")[]];
    platformRole: "user" | "moderator" | "admin";
}, {
    id: string;
    capacities: ["customer" | "provider", ...("customer" | "provider")[]];
    platformRole: "user" | "moderator" | "admin";
}>;
export declare const authSignInSchema: z.ZodObject<{
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
    actor: z.ZodObject<{
        id: z.ZodString;
        capacities: z.ZodArray<z.ZodEnum<["customer", "provider"]>, "atleastone">;
        platformRole: z.ZodEnum<["user", "moderator", "admin"]>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        capacities: ["customer" | "provider", ...("customer" | "provider")[]];
        platformRole: "user" | "moderator" | "admin";
    }, {
        id: string;
        capacities: ["customer" | "provider", ...("customer" | "provider")[]];
        platformRole: "user" | "moderator" | "admin";
    }>;
}, "strip", z.ZodTypeAny, {
    accessToken: string;
    refreshToken: string;
    actor: {
        id: string;
        capacities: ["customer" | "provider", ...("customer" | "provider")[]];
        platformRole: "user" | "moderator" | "admin";
    };
}, {
    accessToken: string;
    refreshToken: string;
    actor: {
        id: string;
        capacities: ["customer" | "provider", ...("customer" | "provider")[]];
        platformRole: "user" | "moderator" | "admin";
    };
}>;
export declare const categorySchema: z.ZodObject<{
    id: z.ZodString;
    slug: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    slug: string;
    name: string;
}, {
    id: string;
    slug: string;
    name: string;
}>;
export type Category = z.infer<typeof categorySchema>;
export declare const categoriesSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    slug: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    slug: string;
    name: string;
}, {
    id: string;
    slug: string;
    name: string;
}>, "many">;
/**
 * A row in the search results. Deliberately narrower than the detail: search
 * returns 2000 rows and does not carry `description` or `pricing`, only the
 * denormalized `priceFrom` the server can sort by.
 *
 * `priceFrom` is nullable and not optional — a `quote` listing with no floor has
 * no sortable price, and the server sends an explicit null for it.
 */
export declare const listingSummarySchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    categoryId: z.ZodString;
    priceFrom: z.ZodNullable<z.ZodObject<{
        amountMinor: z.ZodNumber;
        currency: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        amountMinor: number;
        currency: string;
    }, {
        amountMinor: number;
        currency: string;
    }>>;
    status: z.ZodEnum<["draft", "published", "paused", "under_review", "removed"]>;
    ratingAvg: z.ZodNumber;
    ratingCount: z.ZodNumber;
    distanceMeters: z.ZodNumber;
    isFavorite: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    status: "draft" | "published" | "paused" | "under_review" | "removed";
    id: string;
    title: string;
    categoryId: string;
    priceFrom: {
        amountMinor: number;
        currency: string;
    } | null;
    ratingAvg: number;
    ratingCount: number;
    distanceMeters: number;
    isFavorite?: boolean | undefined;
}, {
    status: "draft" | "published" | "paused" | "under_review" | "removed";
    id: string;
    title: string;
    categoryId: string;
    priceFrom: {
        amountMinor: number;
        currency: string;
    } | null;
    ratingAvg: number;
    ratingCount: number;
    distanceMeters: number;
    isFavorite?: boolean | undefined;
}>;
/** The single-listing response. Carries `pricing`, which search omits. */
export declare const listingDetailSchema: z.ZodObject<{
    id: z.ZodString;
    ownerId: z.ZodString;
    categoryId: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    cityId: z.ZodOptional<z.ZodString>;
    pricing: z.ZodUnion<[z.ZodObject<{
        model: z.ZodLiteral<"fixed">;
        price: z.ZodObject<{
            amountMinor: z.ZodNumber;
            currency: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            amountMinor: number;
            currency: string;
        }, {
            amountMinor: number;
            currency: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        model: "fixed";
        price: {
            amountMinor: number;
            currency: string;
        };
    }, {
        model: "fixed";
        price: {
            amountMinor: number;
            currency: string;
        };
    }>, z.ZodObject<{
        model: z.ZodLiteral<"hourly">;
        hourlyRate: z.ZodObject<{
            amountMinor: z.ZodNumber;
            currency: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            amountMinor: number;
            currency: string;
        }, {
            amountMinor: number;
            currency: string;
        }>;
        minimumHours: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        model: "hourly";
        hourlyRate: {
            amountMinor: number;
            currency: string;
        };
        minimumHours: number;
    }, {
        model: "hourly";
        hourlyRate: {
            amountMinor: number;
            currency: string;
        };
        minimumHours: number;
    }>, z.ZodObject<{
        model: z.ZodLiteral<"quote">;
        startingFrom: z.ZodOptional<z.ZodObject<{
            amountMinor: z.ZodNumber;
            currency: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            amountMinor: number;
            currency: string;
        }, {
            amountMinor: number;
            currency: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        model: "quote";
        startingFrom?: {
            amountMinor: number;
            currency: string;
        } | undefined;
    }, {
        model: "quote";
        startingFrom?: {
            amountMinor: number;
            currency: string;
        } | undefined;
    }>]>;
    priceFrom: z.ZodNullable<z.ZodObject<{
        amountMinor: z.ZodNumber;
        currency: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        amountMinor: number;
        currency: string;
    }, {
        amountMinor: number;
        currency: string;
    }>>;
    status: z.ZodEnum<["draft", "published", "paused", "under_review", "removed"]>;
    ratingAvg: z.ZodNumber;
    ratingCount: z.ZodNumber;
    isFavorite: z.ZodOptional<z.ZodBoolean>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "draft" | "published" | "paused" | "under_review" | "removed";
    id: string;
    title: string;
    categoryId: string;
    priceFrom: {
        amountMinor: number;
        currency: string;
    } | null;
    ratingAvg: number;
    ratingCount: number;
    ownerId: string;
    description: string;
    pricing: {
        model: "fixed";
        price: {
            amountMinor: number;
            currency: string;
        };
    } | {
        model: "hourly";
        hourlyRate: {
            amountMinor: number;
            currency: string;
        };
        minimumHours: number;
    } | {
        model: "quote";
        startingFrom?: {
            amountMinor: number;
            currency: string;
        } | undefined;
    };
    createdAt: string;
    isFavorite?: boolean | undefined;
    cityId?: string | undefined;
}, {
    status: "draft" | "published" | "paused" | "under_review" | "removed";
    id: string;
    title: string;
    categoryId: string;
    priceFrom: {
        amountMinor: number;
        currency: string;
    } | null;
    ratingAvg: number;
    ratingCount: number;
    ownerId: string;
    description: string;
    pricing: {
        model: "fixed";
        price: {
            amountMinor: number;
            currency: string;
        };
    } | {
        model: "hourly";
        hourlyRate: {
            amountMinor: number;
            currency: string;
        };
        minimumHours: number;
    } | {
        model: "quote";
        startingFrom?: {
            amountMinor: number;
            currency: string;
        } | undefined;
    };
    createdAt: string;
    isFavorite?: boolean | undefined;
    cityId?: string | undefined;
}>;
export declare const listingsSearchResponseSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        categoryId: z.ZodString;
        priceFrom: z.ZodNullable<z.ZodObject<{
            amountMinor: z.ZodNumber;
            currency: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            amountMinor: number;
            currency: string;
        }, {
            amountMinor: number;
            currency: string;
        }>>;
        status: z.ZodEnum<["draft", "published", "paused", "under_review", "removed"]>;
        ratingAvg: z.ZodNumber;
        ratingCount: z.ZodNumber;
        distanceMeters: z.ZodNumber;
        isFavorite: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        status: "draft" | "published" | "paused" | "under_review" | "removed";
        id: string;
        title: string;
        categoryId: string;
        priceFrom: {
            amountMinor: number;
            currency: string;
        } | null;
        ratingAvg: number;
        ratingCount: number;
        distanceMeters: number;
        isFavorite?: boolean | undefined;
    }, {
        status: "draft" | "published" | "paused" | "under_review" | "removed";
        id: string;
        title: string;
        categoryId: string;
        priceFrom: {
            amountMinor: number;
            currency: string;
        } | null;
        ratingAvg: number;
        ratingCount: number;
        distanceMeters: number;
        isFavorite?: boolean | undefined;
    }>, "many">;
    nextCursor: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    items: {
        status: "draft" | "published" | "paused" | "under_review" | "removed";
        id: string;
        title: string;
        categoryId: string;
        priceFrom: {
            amountMinor: number;
            currency: string;
        } | null;
        ratingAvg: number;
        ratingCount: number;
        distanceMeters: number;
        isFavorite?: boolean | undefined;
    }[];
    nextCursor: string | null;
}, {
    items: {
        status: "draft" | "published" | "paused" | "under_review" | "removed";
        id: string;
        title: string;
        categoryId: string;
        priceFrom: {
            amountMinor: number;
            currency: string;
        } | null;
        ratingAvg: number;
        ratingCount: number;
        distanceMeters: number;
        isFavorite?: boolean | undefined;
    }[];
    nextCursor: string | null;
}>;
/**
 * GET /v1/me/listings answers with the same cursor-paginated envelope as the
 * search endpoint, not a bare array. It was typed as an array here, so Zod
 * rejected every response and `MyListingsScreen` — which had no error branch —
 * rendered the empty state instead. A provider with 191 listings was told they
 * had published none.
 */
export declare const myListingsResponseSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        ownerId: z.ZodString;
        categoryId: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        cityId: z.ZodOptional<z.ZodString>;
        pricing: z.ZodUnion<[z.ZodObject<{
            model: z.ZodLiteral<"fixed">;
            price: z.ZodObject<{
                amountMinor: z.ZodNumber;
                currency: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                amountMinor: number;
                currency: string;
            }, {
                amountMinor: number;
                currency: string;
            }>;
        }, "strip", z.ZodTypeAny, {
            model: "fixed";
            price: {
                amountMinor: number;
                currency: string;
            };
        }, {
            model: "fixed";
            price: {
                amountMinor: number;
                currency: string;
            };
        }>, z.ZodObject<{
            model: z.ZodLiteral<"hourly">;
            hourlyRate: z.ZodObject<{
                amountMinor: z.ZodNumber;
                currency: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                amountMinor: number;
                currency: string;
            }, {
                amountMinor: number;
                currency: string;
            }>;
            minimumHours: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            model: "hourly";
            hourlyRate: {
                amountMinor: number;
                currency: string;
            };
            minimumHours: number;
        }, {
            model: "hourly";
            hourlyRate: {
                amountMinor: number;
                currency: string;
            };
            minimumHours: number;
        }>, z.ZodObject<{
            model: z.ZodLiteral<"quote">;
            startingFrom: z.ZodOptional<z.ZodObject<{
                amountMinor: z.ZodNumber;
                currency: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                amountMinor: number;
                currency: string;
            }, {
                amountMinor: number;
                currency: string;
            }>>;
        }, "strip", z.ZodTypeAny, {
            model: "quote";
            startingFrom?: {
                amountMinor: number;
                currency: string;
            } | undefined;
        }, {
            model: "quote";
            startingFrom?: {
                amountMinor: number;
                currency: string;
            } | undefined;
        }>]>;
        priceFrom: z.ZodNullable<z.ZodObject<{
            amountMinor: z.ZodNumber;
            currency: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            amountMinor: number;
            currency: string;
        }, {
            amountMinor: number;
            currency: string;
        }>>;
        status: z.ZodEnum<["draft", "published", "paused", "under_review", "removed"]>;
        ratingAvg: z.ZodNumber;
        ratingCount: z.ZodNumber;
        isFavorite: z.ZodOptional<z.ZodBoolean>;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        status: "draft" | "published" | "paused" | "under_review" | "removed";
        id: string;
        title: string;
        categoryId: string;
        priceFrom: {
            amountMinor: number;
            currency: string;
        } | null;
        ratingAvg: number;
        ratingCount: number;
        ownerId: string;
        description: string;
        pricing: {
            model: "fixed";
            price: {
                amountMinor: number;
                currency: string;
            };
        } | {
            model: "hourly";
            hourlyRate: {
                amountMinor: number;
                currency: string;
            };
            minimumHours: number;
        } | {
            model: "quote";
            startingFrom?: {
                amountMinor: number;
                currency: string;
            } | undefined;
        };
        createdAt: string;
        isFavorite?: boolean | undefined;
        cityId?: string | undefined;
    }, {
        status: "draft" | "published" | "paused" | "under_review" | "removed";
        id: string;
        title: string;
        categoryId: string;
        priceFrom: {
            amountMinor: number;
            currency: string;
        } | null;
        ratingAvg: number;
        ratingCount: number;
        ownerId: string;
        description: string;
        pricing: {
            model: "fixed";
            price: {
                amountMinor: number;
                currency: string;
            };
        } | {
            model: "hourly";
            hourlyRate: {
                amountMinor: number;
                currency: string;
            };
            minimumHours: number;
        } | {
            model: "quote";
            startingFrom?: {
                amountMinor: number;
                currency: string;
            } | undefined;
        };
        createdAt: string;
        isFavorite?: boolean | undefined;
        cityId?: string | undefined;
    }>, "many">;
    nextCursor: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    items: {
        status: "draft" | "published" | "paused" | "under_review" | "removed";
        id: string;
        title: string;
        categoryId: string;
        priceFrom: {
            amountMinor: number;
            currency: string;
        } | null;
        ratingAvg: number;
        ratingCount: number;
        ownerId: string;
        description: string;
        pricing: {
            model: "fixed";
            price: {
                amountMinor: number;
                currency: string;
            };
        } | {
            model: "hourly";
            hourlyRate: {
                amountMinor: number;
                currency: string;
            };
            minimumHours: number;
        } | {
            model: "quote";
            startingFrom?: {
                amountMinor: number;
                currency: string;
            } | undefined;
        };
        createdAt: string;
        isFavorite?: boolean | undefined;
        cityId?: string | undefined;
    }[];
    nextCursor: string | null;
}, {
    items: {
        status: "draft" | "published" | "paused" | "under_review" | "removed";
        id: string;
        title: string;
        categoryId: string;
        priceFrom: {
            amountMinor: number;
            currency: string;
        } | null;
        ratingAvg: number;
        ratingCount: number;
        ownerId: string;
        description: string;
        pricing: {
            model: "fixed";
            price: {
                amountMinor: number;
                currency: string;
            };
        } | {
            model: "hourly";
            hourlyRate: {
                amountMinor: number;
                currency: string;
            };
            minimumHours: number;
        } | {
            model: "quote";
            startingFrom?: {
                amountMinor: number;
                currency: string;
            } | undefined;
        };
        createdAt: string;
        isFavorite?: boolean | undefined;
        cityId?: string | undefined;
    }[];
    nextCursor: string | null;
}>;
/**
 * A booking as it arrives. Flat, with the timestamps beside the status rather
 * than inside it, and no `providerId` — the API does not send one.
 */
export declare const bookingSchema: z.ZodObject<{
    id: z.ZodString;
    listingId: z.ZodString;
    customerId: z.ZodString;
    status: z.ZodEnum<["requested", "accepted", "declined", "completed", "cancelled"]>;
    requestedAt: z.ZodString;
    scheduledFor: z.ZodNullable<z.ZodString>;
    completedAt: z.ZodNullable<z.ZodString>;
    reviewId: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "requested" | "accepted" | "declined" | "completed" | "cancelled";
    id: string;
    listingId: string;
    customerId: string;
    requestedAt: string;
    scheduledFor: string | null;
    completedAt: string | null;
    reviewId: string | null;
}, {
    status: "requested" | "accepted" | "declined" | "completed" | "cancelled";
    id: string;
    listingId: string;
    customerId: string;
    requestedAt: string;
    scheduledFor: string | null;
    completedAt: string | null;
    reviewId: string | null;
}>;
export declare const bookingsResponseSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        listingId: z.ZodString;
        customerId: z.ZodString;
        status: z.ZodEnum<["requested", "accepted", "declined", "completed", "cancelled"]>;
        requestedAt: z.ZodString;
        scheduledFor: z.ZodNullable<z.ZodString>;
        completedAt: z.ZodNullable<z.ZodString>;
        reviewId: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: "requested" | "accepted" | "declined" | "completed" | "cancelled";
        id: string;
        listingId: string;
        customerId: string;
        requestedAt: string;
        scheduledFor: string | null;
        completedAt: string | null;
        reviewId: string | null;
    }, {
        status: "requested" | "accepted" | "declined" | "completed" | "cancelled";
        id: string;
        listingId: string;
        customerId: string;
        requestedAt: string;
        scheduledFor: string | null;
        completedAt: string | null;
        reviewId: string | null;
    }>, "many">;
    nextCursor: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    items: {
        status: "requested" | "accepted" | "declined" | "completed" | "cancelled";
        id: string;
        listingId: string;
        customerId: string;
        requestedAt: string;
        scheduledFor: string | null;
        completedAt: string | null;
        reviewId: string | null;
    }[];
    nextCursor: string | null;
}, {
    items: {
        status: "requested" | "accepted" | "declined" | "completed" | "cancelled";
        id: string;
        listingId: string;
        customerId: string;
        requestedAt: string;
        scheduledFor: string | null;
        completedAt: string | null;
        reviewId: string | null;
    }[];
    nextCursor: string | null;
}>;
/**
 * `body`, not `comment`. The API calls it `body` on the way in and on the way
 * out; this schema said `comment` and, because it is not strict, silently
 * accepted every response and dropped the text. Reviews rendered blank and
 * nothing reported an error.
 */
export declare const reviewSchema: z.ZodObject<{
    id: z.ZodString;
    bookingId: z.ZodString;
    listingId: z.ZodString;
    authorId: z.ZodString;
    rating: z.ZodNumber;
    body: z.ZodString;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    listingId: string;
    bookingId: string;
    authorId: string;
    rating: number;
    body: string;
}, {
    id: string;
    createdAt: string;
    listingId: string;
    bookingId: string;
    authorId: string;
    rating: number;
    body: string;
}>;
export declare const reviewsResponseSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        bookingId: z.ZodString;
        listingId: z.ZodString;
        authorId: z.ZodString;
        rating: z.ZodNumber;
        body: z.ZodString;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        createdAt: string;
        listingId: string;
        bookingId: string;
        authorId: string;
        rating: number;
        body: string;
    }, {
        id: string;
        createdAt: string;
        listingId: string;
        bookingId: string;
        authorId: string;
        rating: number;
        body: string;
    }>, "many">;
    nextCursor: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    items: {
        id: string;
        createdAt: string;
        listingId: string;
        bookingId: string;
        authorId: string;
        rating: number;
        body: string;
    }[];
    nextCursor: string | null;
}, {
    items: {
        id: string;
        createdAt: string;
        listingId: string;
        bookingId: string;
        authorId: string;
        rating: number;
        body: string;
    }[];
    nextCursor: string | null;
}>;
export declare const reportSchema: z.ZodObject<{
    id: z.ZodString;
    listingId: z.ZodString;
    reporterId: z.ZodString;
    reason: z.ZodString;
    createdAt: z.ZodString;
    status: z.ZodEnum<["open", "resolved"]>;
}, "strip", z.ZodTypeAny, {
    status: "open" | "resolved";
    id: string;
    createdAt: string;
    listingId: string;
    reporterId: string;
    reason: string;
}, {
    status: "open" | "resolved";
    id: string;
    createdAt: string;
    listingId: string;
    reporterId: string;
    reason: string;
}>;
export declare const reportsResponseSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        listingId: z.ZodString;
        reporterId: z.ZodString;
        reason: z.ZodString;
        createdAt: z.ZodString;
        status: z.ZodEnum<["open", "resolved"]>;
    }, "strip", z.ZodTypeAny, {
        status: "open" | "resolved";
        id: string;
        createdAt: string;
        listingId: string;
        reporterId: string;
        reason: string;
    }, {
        status: "open" | "resolved";
        id: string;
        createdAt: string;
        listingId: string;
        reporterId: string;
        reason: string;
    }>, "many">;
    nextCursor: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    items: {
        status: "open" | "resolved";
        id: string;
        createdAt: string;
        listingId: string;
        reporterId: string;
        reason: string;
    }[];
    nextCursor: string | null;
}, {
    items: {
        status: "open" | "resolved";
        id: string;
        createdAt: string;
        listingId: string;
        reporterId: string;
        reason: string;
    }[];
    nextCursor: string | null;
}>;
export declare const problemDetailsSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    status: z.ZodNumber;
    detail: z.ZodOptional<z.ZodString>;
    instance: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: number;
    title: string;
    type?: string | undefined;
    reason?: string | undefined;
    detail?: string | undefined;
    instance?: string | undefined;
}, {
    status: number;
    title: string;
    type?: string | undefined;
    reason?: string | undefined;
    detail?: string | undefined;
    instance?: string | undefined;
}>;
/**
 * `note`, singular, and no `scheduledFor`.
 *
 * The API's own schema is `.strict()`, so the extra key this used to send came
 * back as `422 Unrecognized key: "notes"` on every single booking request. The
 * date is not the customer's to propose: it is set by the provider when they
 * accept.
 */
export declare const createBookingSchema: z.ZodObject<{
    listingId: z.ZodString;
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    listingId: string;
    note?: string | undefined;
}, {
    listingId: string;
    note?: string | undefined;
}>;
/** Body of `POST /bookings/{id}/accept`. The server rejects a 422 without it. */
export declare const acceptBookingSchema: z.ZodObject<{
    scheduledFor: z.ZodString;
}, "strip", z.ZodTypeAny, {
    scheduledFor: string;
}, {
    scheduledFor: string;
}>;
/** Body of `POST /bookings/{id}/decline`. Free text is rejected. */
export declare const declineBookingSchema: z.ZodObject<{
    reason: z.ZodEnum<["unavailable", "not_a_fit", "other"]>;
}, "strip", z.ZodTypeAny, {
    reason: "unavailable" | "not_a_fit" | "other";
}, {
    reason: "unavailable" | "not_a_fit" | "other";
}>;
export declare const createReviewSchema: z.ZodObject<{
    rating: z.ZodNumber;
    body: z.ZodString;
}, "strip", z.ZodTypeAny, {
    rating: number;
    body: string;
}, {
    rating: number;
    body: string;
}>;
export declare const createListingSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    categoryId: z.ZodString;
    pricing: z.ZodUnion<[z.ZodObject<{
        model: z.ZodLiteral<"fixed">;
        price: z.ZodObject<{
            amountMinor: z.ZodNumber;
            currency: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            amountMinor: number;
            currency: string;
        }, {
            amountMinor: number;
            currency: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        model: "fixed";
        price: {
            amountMinor: number;
            currency: string;
        };
    }, {
        model: "fixed";
        price: {
            amountMinor: number;
            currency: string;
        };
    }>, z.ZodObject<{
        model: z.ZodLiteral<"hourly">;
        hourlyRate: z.ZodObject<{
            amountMinor: z.ZodNumber;
            currency: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            amountMinor: number;
            currency: string;
        }, {
            amountMinor: number;
            currency: string;
        }>;
        minimumHours: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        model: "hourly";
        hourlyRate: {
            amountMinor: number;
            currency: string;
        };
        minimumHours: number;
    }, {
        model: "hourly";
        hourlyRate: {
            amountMinor: number;
            currency: string;
        };
        minimumHours: number;
    }>, z.ZodObject<{
        model: z.ZodLiteral<"quote">;
        startingFrom: z.ZodOptional<z.ZodObject<{
            amountMinor: z.ZodNumber;
            currency: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            amountMinor: number;
            currency: string;
        }, {
            amountMinor: number;
            currency: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        model: "quote";
        startingFrom?: {
            amountMinor: number;
            currency: string;
        } | undefined;
    }, {
        model: "quote";
        startingFrom?: {
            amountMinor: number;
            currency: string;
        } | undefined;
    }>]>;
    cityId: z.ZodOptional<z.ZodString>;
    photoKeys: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    title: string;
    categoryId: string;
    description: string;
    pricing: {
        model: "fixed";
        price: {
            amountMinor: number;
            currency: string;
        };
    } | {
        model: "hourly";
        hourlyRate: {
            amountMinor: number;
            currency: string;
        };
        minimumHours: number;
    } | {
        model: "quote";
        startingFrom?: {
            amountMinor: number;
            currency: string;
        } | undefined;
    };
    cityId?: string | undefined;
    photoKeys?: string[] | undefined;
}, {
    title: string;
    categoryId: string;
    description: string;
    pricing: {
        model: "fixed";
        price: {
            amountMinor: number;
            currency: string;
        };
    } | {
        model: "hourly";
        hourlyRate: {
            amountMinor: number;
            currency: string;
        };
        minimumHours: number;
    } | {
        model: "quote";
        startingFrom?: {
            amountMinor: number;
            currency: string;
        } | undefined;
    };
    cityId?: string | undefined;
    photoKeys?: string[] | undefined;
}>;
export declare const updateListingSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
    pricing: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
        model: z.ZodLiteral<"fixed">;
        price: z.ZodObject<{
            amountMinor: z.ZodNumber;
            currency: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            amountMinor: number;
            currency: string;
        }, {
            amountMinor: number;
            currency: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        model: "fixed";
        price: {
            amountMinor: number;
            currency: string;
        };
    }, {
        model: "fixed";
        price: {
            amountMinor: number;
            currency: string;
        };
    }>, z.ZodObject<{
        model: z.ZodLiteral<"hourly">;
        hourlyRate: z.ZodObject<{
            amountMinor: z.ZodNumber;
            currency: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            amountMinor: number;
            currency: string;
        }, {
            amountMinor: number;
            currency: string;
        }>;
        minimumHours: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        model: "hourly";
        hourlyRate: {
            amountMinor: number;
            currency: string;
        };
        minimumHours: number;
    }, {
        model: "hourly";
        hourlyRate: {
            amountMinor: number;
            currency: string;
        };
        minimumHours: number;
    }>, z.ZodObject<{
        model: z.ZodLiteral<"quote">;
        startingFrom: z.ZodOptional<z.ZodObject<{
            amountMinor: z.ZodNumber;
            currency: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            amountMinor: number;
            currency: string;
        }, {
            amountMinor: number;
            currency: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        model: "quote";
        startingFrom?: {
            amountMinor: number;
            currency: string;
        } | undefined;
    }, {
        model: "quote";
        startingFrom?: {
            amountMinor: number;
            currency: string;
        } | undefined;
    }>]>>;
    cityId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    photoKeys: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    categoryId?: string | undefined;
    description?: string | undefined;
    cityId?: string | undefined;
    pricing?: {
        model: "fixed";
        price: {
            amountMinor: number;
            currency: string;
        };
    } | {
        model: "hourly";
        hourlyRate: {
            amountMinor: number;
            currency: string;
        };
        minimumHours: number;
    } | {
        model: "quote";
        startingFrom?: {
            amountMinor: number;
            currency: string;
        } | undefined;
    } | undefined;
    photoKeys?: string[] | undefined;
}, {
    title?: string | undefined;
    categoryId?: string | undefined;
    description?: string | undefined;
    cityId?: string | undefined;
    pricing?: {
        model: "fixed";
        price: {
            amountMinor: number;
            currency: string;
        };
    } | {
        model: "hourly";
        hourlyRate: {
            amountMinor: number;
            currency: string;
        };
        minimumHours: number;
    } | {
        model: "quote";
        startingFrom?: {
            amountMinor: number;
            currency: string;
        } | undefined;
    } | undefined;
    photoKeys?: string[] | undefined;
}>;
export declare const presignPhotoRequestSchema: z.ZodObject<{
    fileName: z.ZodString;
    contentType: z.ZodString;
}, "strip", z.ZodTypeAny, {
    fileName: string;
    contentType: string;
}, {
    fileName: string;
    contentType: string;
}>;
export declare const presignPhotoResponseSchema: z.ZodObject<{
    uploadUrl: z.ZodString;
    key: z.ZodString;
}, "strip", z.ZodTypeAny, {
    uploadUrl: string;
    key: string;
}, {
    uploadUrl: string;
    key: string;
}>;
export type PricingSchemaType = z.infer<typeof pricingSchema>;
export type ListingSummary = z.infer<typeof listingSummarySchema>;
export type ListingDetail = z.infer<typeof listingDetailSchema>;
export type ListingsSearchResponse = z.infer<typeof listingsSearchResponseSchema>;
export type MyListingsResponse = z.infer<typeof myListingsResponseSchema>;
export type BookingResponse = z.infer<typeof bookingSchema>;
export type BookingsResponse = z.infer<typeof bookingsResponseSchema>;
export type ReviewResponse = z.infer<typeof reviewSchema>;
export type ReviewsResponse = z.infer<typeof reviewsResponseSchema>;
export type ReportResponse = z.infer<typeof reportSchema>;
export type ReportsResponse = z.infer<typeof reportsResponseSchema>;
export type ProblemDetails = z.infer<typeof problemDetailsSchema>;
export type ActorResponse = z.infer<typeof actorSchema>;
export type AuthSignInResponse = z.infer<typeof authSignInSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type PresignPhotoResponse = z.infer<typeof presignPhotoResponseSchema>;
export type BookingStatusKind = z.infer<typeof bookingStatusKindSchema>;
export type DeclineReason = z.infer<typeof declineReasonSchema>;
export type AcceptBookingInput = z.infer<typeof acceptBookingSchema>;
export type DeclineBookingInput = z.infer<typeof declineBookingSchema>;
/**
 * The one crossing between the wire and the domain.
 *
 * The API leaves `scheduledFor` and `completedAt` nullable regardless of the
 * status, so `{ status: "accepted", scheduledFor: null }` is a value it can
 * technically produce. The union exists precisely so the rest of the app never
 * has to consider that combination, and this function is where it is ruled out:
 * a state whose timestamp is missing is reported as the state before it, rather
 * than as an accepted booking with no date.
 */
export declare function toBookingStatus(booking: BookingResponse): BookingStatus;
/** A booking with its status as the union, which is what screens work with. */
export interface Booking {
    readonly id: string;
    readonly listingId: string;
    readonly customerId: string;
    readonly status: BookingStatus;
    readonly reviewId: string | null;
}
export declare function toBooking(response: BookingResponse): Booking;
