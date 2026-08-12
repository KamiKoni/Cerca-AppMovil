import { z } from 'zod';
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
export declare const bookingStatusSchema: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
    kind: z.ZodLiteral<"requested">;
    requestedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: "requested";
    requestedAt: string;
}, {
    kind: "requested";
    requestedAt: string;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"accepted">;
    acceptedAt: z.ZodString;
    scheduledFor: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: "accepted";
    acceptedAt: string;
    scheduledFor: string;
}, {
    kind: "accepted";
    acceptedAt: string;
    scheduledFor: string;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"declined">;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: "declined";
    reason: string;
}, {
    kind: "declined";
    reason: string;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"completed">;
    completedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: "completed";
    completedAt: string;
}, {
    kind: "completed";
    completedAt: string;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"cancelled">;
    cancelledBy: z.ZodString;
    at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: "cancelled";
    cancelledBy: string;
    at: string;
}, {
    kind: "cancelled";
    cancelledBy: string;
    at: string;
}>]>;
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
    }[];
    nextCursor: string | null;
}>;
export declare const myListingsResponseSchema: z.ZodArray<z.ZodObject<{
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
    cityId?: string | undefined;
}>, "many">;
export declare const bookingSchema: z.ZodObject<{
    id: z.ZodString;
    listingId: z.ZodString;
    customerId: z.ZodString;
    providerId: z.ZodString;
    status: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
        kind: z.ZodLiteral<"requested">;
        requestedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: "requested";
        requestedAt: string;
    }, {
        kind: "requested";
        requestedAt: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"accepted">;
        acceptedAt: z.ZodString;
        scheduledFor: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: "accepted";
        acceptedAt: string;
        scheduledFor: string;
    }, {
        kind: "accepted";
        acceptedAt: string;
        scheduledFor: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"declined">;
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: "declined";
        reason: string;
    }, {
        kind: "declined";
        reason: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"completed">;
        completedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: "completed";
        completedAt: string;
    }, {
        kind: "completed";
        completedAt: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"cancelled">;
        cancelledBy: z.ZodString;
        at: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: "cancelled";
        cancelledBy: string;
        at: string;
    }, {
        kind: "cancelled";
        cancelledBy: string;
        at: string;
    }>]>;
    reviewId: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: {
        kind: "requested";
        requestedAt: string;
    } | {
        kind: "accepted";
        acceptedAt: string;
        scheduledFor: string;
    } | {
        kind: "declined";
        reason: string;
    } | {
        kind: "completed";
        completedAt: string;
    } | {
        kind: "cancelled";
        cancelledBy: string;
        at: string;
    };
    id: string;
    listingId: string;
    customerId: string;
    providerId: string;
    reviewId: string | null;
    createdAt?: string | undefined;
}, {
    status: {
        kind: "requested";
        requestedAt: string;
    } | {
        kind: "accepted";
        acceptedAt: string;
        scheduledFor: string;
    } | {
        kind: "declined";
        reason: string;
    } | {
        kind: "completed";
        completedAt: string;
    } | {
        kind: "cancelled";
        cancelledBy: string;
        at: string;
    };
    id: string;
    listingId: string;
    customerId: string;
    providerId: string;
    reviewId: string | null;
    createdAt?: string | undefined;
}>;
export declare const bookingsResponseSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        listingId: z.ZodString;
        customerId: z.ZodString;
        providerId: z.ZodString;
        status: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
            kind: z.ZodLiteral<"requested">;
            requestedAt: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: "requested";
            requestedAt: string;
        }, {
            kind: "requested";
            requestedAt: string;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<"accepted">;
            acceptedAt: z.ZodString;
            scheduledFor: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: "accepted";
            acceptedAt: string;
            scheduledFor: string;
        }, {
            kind: "accepted";
            acceptedAt: string;
            scheduledFor: string;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<"declined">;
            reason: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: "declined";
            reason: string;
        }, {
            kind: "declined";
            reason: string;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<"completed">;
            completedAt: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: "completed";
            completedAt: string;
        }, {
            kind: "completed";
            completedAt: string;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<"cancelled">;
            cancelledBy: z.ZodString;
            at: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: "cancelled";
            cancelledBy: string;
            at: string;
        }, {
            kind: "cancelled";
            cancelledBy: string;
            at: string;
        }>]>;
        reviewId: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: {
            kind: "requested";
            requestedAt: string;
        } | {
            kind: "accepted";
            acceptedAt: string;
            scheduledFor: string;
        } | {
            kind: "declined";
            reason: string;
        } | {
            kind: "completed";
            completedAt: string;
        } | {
            kind: "cancelled";
            cancelledBy: string;
            at: string;
        };
        id: string;
        listingId: string;
        customerId: string;
        providerId: string;
        reviewId: string | null;
        createdAt?: string | undefined;
    }, {
        status: {
            kind: "requested";
            requestedAt: string;
        } | {
            kind: "accepted";
            acceptedAt: string;
            scheduledFor: string;
        } | {
            kind: "declined";
            reason: string;
        } | {
            kind: "completed";
            completedAt: string;
        } | {
            kind: "cancelled";
            cancelledBy: string;
            at: string;
        };
        id: string;
        listingId: string;
        customerId: string;
        providerId: string;
        reviewId: string | null;
        createdAt?: string | undefined;
    }>, "many">;
    nextCursor: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    items: {
        status: {
            kind: "requested";
            requestedAt: string;
        } | {
            kind: "accepted";
            acceptedAt: string;
            scheduledFor: string;
        } | {
            kind: "declined";
            reason: string;
        } | {
            kind: "completed";
            completedAt: string;
        } | {
            kind: "cancelled";
            cancelledBy: string;
            at: string;
        };
        id: string;
        listingId: string;
        customerId: string;
        providerId: string;
        reviewId: string | null;
        createdAt?: string | undefined;
    }[];
    nextCursor: string | null;
}, {
    items: {
        status: {
            kind: "requested";
            requestedAt: string;
        } | {
            kind: "accepted";
            acceptedAt: string;
            scheduledFor: string;
        } | {
            kind: "declined";
            reason: string;
        } | {
            kind: "completed";
            completedAt: string;
        } | {
            kind: "cancelled";
            cancelledBy: string;
            at: string;
        };
        id: string;
        listingId: string;
        customerId: string;
        providerId: string;
        reviewId: string | null;
        createdAt?: string | undefined;
    }[];
    nextCursor: string | null;
}>;
export declare const reviewSchema: z.ZodObject<{
    id: z.ZodString;
    bookingId: z.ZodString;
    listingId: z.ZodString;
    authorId: z.ZodString;
    rating: z.ZodNumber;
    comment: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: string;
    listingId: string;
    bookingId: string;
    authorId: string;
    rating: number;
    comment?: string | undefined;
}, {
    id: string;
    createdAt: string;
    listingId: string;
    bookingId: string;
    authorId: string;
    rating: number;
    comment?: string | undefined;
}>;
export declare const reviewsResponseSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        bookingId: z.ZodString;
        listingId: z.ZodString;
        authorId: z.ZodString;
        rating: z.ZodNumber;
        comment: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        createdAt: string;
        listingId: string;
        bookingId: string;
        authorId: string;
        rating: number;
        comment?: string | undefined;
    }, {
        id: string;
        createdAt: string;
        listingId: string;
        bookingId: string;
        authorId: string;
        rating: number;
        comment?: string | undefined;
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
        comment?: string | undefined;
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
        comment?: string | undefined;
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
    reason: string;
    id: string;
    createdAt: string;
    listingId: string;
    reporterId: string;
}, {
    status: "open" | "resolved";
    reason: string;
    id: string;
    createdAt: string;
    listingId: string;
    reporterId: string;
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
        reason: string;
        id: string;
        createdAt: string;
        listingId: string;
        reporterId: string;
    }, {
        status: "open" | "resolved";
        reason: string;
        id: string;
        createdAt: string;
        listingId: string;
        reporterId: string;
    }>, "many">;
    nextCursor: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    items: {
        status: "open" | "resolved";
        reason: string;
        id: string;
        createdAt: string;
        listingId: string;
        reporterId: string;
    }[];
    nextCursor: string | null;
}, {
    items: {
        status: "open" | "resolved";
        reason: string;
        id: string;
        createdAt: string;
        listingId: string;
        reporterId: string;
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
export declare const createBookingSchema: z.ZodObject<{
    listingId: z.ZodString;
    scheduledFor: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    listingId: string;
    scheduledFor?: string | undefined;
    notes?: string | undefined;
}, {
    listingId: string;
    scheduledFor?: string | undefined;
    notes?: string | undefined;
}>;
export declare const createReviewSchema: z.ZodObject<{
    rating: z.ZodNumber;
    comment: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    rating: number;
    comment?: string | undefined;
}, {
    rating: number;
    comment?: string | undefined;
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
