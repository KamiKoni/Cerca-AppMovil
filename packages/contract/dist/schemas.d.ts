import { z } from 'zod';
export declare const moneySchema: z.ZodObject<{
    amountMinor: z.ZodNumber;
    currency: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currency: string;
    amountMinor: number;
}, {
    currency: string;
    amountMinor: number;
}>;
export declare const pricingFixed: z.ZodObject<{
    model: z.ZodLiteral<"fixed">;
    price: z.ZodObject<{
        amountMinor: z.ZodNumber;
        currency: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        currency: string;
        amountMinor: number;
    }, {
        currency: string;
        amountMinor: number;
    }>;
}, "strip", z.ZodTypeAny, {
    model: "fixed";
    price: {
        currency: string;
        amountMinor: number;
    };
}, {
    model: "fixed";
    price: {
        currency: string;
        amountMinor: number;
    };
}>;
export declare const pricingHourly: z.ZodObject<{
    model: z.ZodLiteral<"hourly">;
    hourlyRate: z.ZodObject<{
        amountMinor: z.ZodNumber;
        currency: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        currency: string;
        amountMinor: number;
    }, {
        currency: string;
        amountMinor: number;
    }>;
    minimumHours: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    model: "hourly";
    hourlyRate: {
        currency: string;
        amountMinor: number;
    };
    minimumHours: number;
}, {
    model: "hourly";
    hourlyRate: {
        currency: string;
        amountMinor: number;
    };
    minimumHours: number;
}>;
export declare const pricingQuote: z.ZodObject<{
    model: z.ZodLiteral<"quote">;
    startingFrom: z.ZodOptional<z.ZodObject<{
        amountMinor: z.ZodNumber;
        currency: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        currency: string;
        amountMinor: number;
    }, {
        currency: string;
        amountMinor: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    model: "quote";
    startingFrom?: {
        currency: string;
        amountMinor: number;
    } | undefined;
}, {
    model: "quote";
    startingFrom?: {
        currency: string;
        amountMinor: number;
    } | undefined;
}>;
export declare const pricingSchema: z.ZodUnion<[z.ZodObject<{
    model: z.ZodLiteral<"fixed">;
    price: z.ZodObject<{
        amountMinor: z.ZodNumber;
        currency: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        currency: string;
        amountMinor: number;
    }, {
        currency: string;
        amountMinor: number;
    }>;
}, "strip", z.ZodTypeAny, {
    model: "fixed";
    price: {
        currency: string;
        amountMinor: number;
    };
}, {
    model: "fixed";
    price: {
        currency: string;
        amountMinor: number;
    };
}>, z.ZodObject<{
    model: z.ZodLiteral<"hourly">;
    hourlyRate: z.ZodObject<{
        amountMinor: z.ZodNumber;
        currency: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        currency: string;
        amountMinor: number;
    }, {
        currency: string;
        amountMinor: number;
    }>;
    minimumHours: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    model: "hourly";
    hourlyRate: {
        currency: string;
        amountMinor: number;
    };
    minimumHours: number;
}, {
    model: "hourly";
    hourlyRate: {
        currency: string;
        amountMinor: number;
    };
    minimumHours: number;
}>, z.ZodObject<{
    model: z.ZodLiteral<"quote">;
    startingFrom: z.ZodOptional<z.ZodObject<{
        amountMinor: z.ZodNumber;
        currency: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        currency: string;
        amountMinor: number;
    }, {
        currency: string;
        amountMinor: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    model: "quote";
    startingFrom?: {
        currency: string;
        amountMinor: number;
    } | undefined;
}, {
    model: "quote";
    startingFrom?: {
        currency: string;
        amountMinor: number;
    } | undefined;
}>]>;
export declare const listingStatusSchema: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
    kind: z.ZodLiteral<"draft">;
}, "strip", z.ZodTypeAny, {
    kind: "draft";
}, {
    kind: "draft";
}>, z.ZodObject<{
    kind: z.ZodLiteral<"published">;
    publishedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: "published";
    publishedAt: string;
}, {
    kind: "published";
    publishedAt: string;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"paused">;
}, "strip", z.ZodTypeAny, {
    kind: "paused";
}, {
    kind: "paused";
}>, z.ZodObject<{
    kind: z.ZodLiteral<"under_review">;
    reportId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: "under_review";
    reportId: string;
}, {
    kind: "under_review";
    reportId: string;
}>, z.ZodObject<{
    kind: z.ZodLiteral<"removed">;
    removedBy: z.ZodString;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
    kind: "removed";
    removedBy: string;
}, {
    reason: string;
    kind: "removed";
    removedBy: string;
}>]>;
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
    reason: string;
    kind: "declined";
}, {
    reason: string;
    kind: "declined";
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
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
}, {
    id: string;
    name: string;
}>;
export declare const categoriesSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
}, {
    id: string;
    name: string;
}>, "many">;
export declare const listingSummarySchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodString;
    ownerId: z.ZodString;
    price: z.ZodUnion<[z.ZodObject<{
        model: z.ZodLiteral<"fixed">;
        price: z.ZodObject<{
            amountMinor: z.ZodNumber;
            currency: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            currency: string;
            amountMinor: number;
        }, {
            currency: string;
            amountMinor: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        model: "fixed";
        price: {
            currency: string;
            amountMinor: number;
        };
    }, {
        model: "fixed";
        price: {
            currency: string;
            amountMinor: number;
        };
    }>, z.ZodObject<{
        model: z.ZodLiteral<"hourly">;
        hourlyRate: z.ZodObject<{
            amountMinor: z.ZodNumber;
            currency: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            currency: string;
            amountMinor: number;
        }, {
            currency: string;
            amountMinor: number;
        }>;
        minimumHours: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        model: "hourly";
        hourlyRate: {
            currency: string;
            amountMinor: number;
        };
        minimumHours: number;
    }, {
        model: "hourly";
        hourlyRate: {
            currency: string;
            amountMinor: number;
        };
        minimumHours: number;
    }>, z.ZodObject<{
        model: z.ZodLiteral<"quote">;
        startingFrom: z.ZodOptional<z.ZodObject<{
            amountMinor: z.ZodNumber;
            currency: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            currency: string;
            amountMinor: number;
        }, {
            currency: string;
            amountMinor: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        model: "quote";
        startingFrom?: {
            currency: string;
            amountMinor: number;
        } | undefined;
    }, {
        model: "quote";
        startingFrom?: {
            currency: string;
            amountMinor: number;
        } | undefined;
    }>]>;
    distanceMeters: z.ZodNumber;
    isFavorite: z.ZodOptional<z.ZodBoolean>;
    status: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
        kind: z.ZodLiteral<"draft">;
    }, "strip", z.ZodTypeAny, {
        kind: "draft";
    }, {
        kind: "draft";
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"published">;
        publishedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: "published";
        publishedAt: string;
    }, {
        kind: "published";
        publishedAt: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"paused">;
    }, "strip", z.ZodTypeAny, {
        kind: "paused";
    }, {
        kind: "paused";
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"under_review">;
        reportId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: "under_review";
        reportId: string;
    }, {
        kind: "under_review";
        reportId: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"removed">;
        removedBy: z.ZodString;
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        reason: string;
        kind: "removed";
        removedBy: string;
    }, {
        reason: string;
        kind: "removed";
        removedBy: string;
    }>]>;
    rating: z.ZodOptional<z.ZodNumber>;
    reviewCount: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status: {
        kind: "draft";
    } | {
        kind: "published";
        publishedAt: string;
    } | {
        kind: "paused";
    } | {
        kind: "under_review";
        reportId: string;
    } | {
        reason: string;
        kind: "removed";
        removedBy: string;
    };
    price: {
        model: "fixed";
        price: {
            currency: string;
            amountMinor: number;
        };
    } | {
        model: "hourly";
        hourlyRate: {
            currency: string;
            amountMinor: number;
        };
        minimumHours: number;
    } | {
        model: "quote";
        startingFrom?: {
            currency: string;
            amountMinor: number;
        } | undefined;
    };
    id: string;
    title: string;
    categoryId: string;
    ownerId: string;
    distanceMeters: number;
    description?: string | undefined;
    isFavorite?: boolean | undefined;
    rating?: number | undefined;
    reviewCount?: number | undefined;
}, {
    status: {
        kind: "draft";
    } | {
        kind: "published";
        publishedAt: string;
    } | {
        kind: "paused";
    } | {
        kind: "under_review";
        reportId: string;
    } | {
        reason: string;
        kind: "removed";
        removedBy: string;
    };
    price: {
        model: "fixed";
        price: {
            currency: string;
            amountMinor: number;
        };
    } | {
        model: "hourly";
        hourlyRate: {
            currency: string;
            amountMinor: number;
        };
        minimumHours: number;
    } | {
        model: "quote";
        startingFrom?: {
            currency: string;
            amountMinor: number;
        } | undefined;
    };
    id: string;
    title: string;
    categoryId: string;
    ownerId: string;
    distanceMeters: number;
    description?: string | undefined;
    isFavorite?: boolean | undefined;
    rating?: number | undefined;
    reviewCount?: number | undefined;
}>;
export declare const listingDetailSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    categoryId: z.ZodString;
    ownerId: z.ZodString;
    price: z.ZodUnion<[z.ZodObject<{
        model: z.ZodLiteral<"fixed">;
        price: z.ZodObject<{
            amountMinor: z.ZodNumber;
            currency: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            currency: string;
            amountMinor: number;
        }, {
            currency: string;
            amountMinor: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        model: "fixed";
        price: {
            currency: string;
            amountMinor: number;
        };
    }, {
        model: "fixed";
        price: {
            currency: string;
            amountMinor: number;
        };
    }>, z.ZodObject<{
        model: z.ZodLiteral<"hourly">;
        hourlyRate: z.ZodObject<{
            amountMinor: z.ZodNumber;
            currency: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            currency: string;
            amountMinor: number;
        }, {
            currency: string;
            amountMinor: number;
        }>;
        minimumHours: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        model: "hourly";
        hourlyRate: {
            currency: string;
            amountMinor: number;
        };
        minimumHours: number;
    }, {
        model: "hourly";
        hourlyRate: {
            currency: string;
            amountMinor: number;
        };
        minimumHours: number;
    }>, z.ZodObject<{
        model: z.ZodLiteral<"quote">;
        startingFrom: z.ZodOptional<z.ZodObject<{
            amountMinor: z.ZodNumber;
            currency: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            currency: string;
            amountMinor: number;
        }, {
            currency: string;
            amountMinor: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        model: "quote";
        startingFrom?: {
            currency: string;
            amountMinor: number;
        } | undefined;
    }, {
        model: "quote";
        startingFrom?: {
            currency: string;
            amountMinor: number;
        } | undefined;
    }>]>;
    distanceMeters: z.ZodNumber;
    isFavorite: z.ZodOptional<z.ZodBoolean>;
    status: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
        kind: z.ZodLiteral<"draft">;
    }, "strip", z.ZodTypeAny, {
        kind: "draft";
    }, {
        kind: "draft";
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"published">;
        publishedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: "published";
        publishedAt: string;
    }, {
        kind: "published";
        publishedAt: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"paused">;
    }, "strip", z.ZodTypeAny, {
        kind: "paused";
    }, {
        kind: "paused";
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"under_review">;
        reportId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: "under_review";
        reportId: string;
    }, {
        kind: "under_review";
        reportId: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"removed">;
        removedBy: z.ZodString;
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        reason: string;
        kind: "removed";
        removedBy: string;
    }, {
        reason: string;
        kind: "removed";
        removedBy: string;
    }>]>;
    rating: z.ZodOptional<z.ZodNumber>;
    reviewCount: z.ZodOptional<z.ZodNumber>;
} & {
    photos: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    location: z.ZodObject<{
        lat: z.ZodNumber;
        lng: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        lat: number;
        lng: number;
    }, {
        lat: number;
        lng: number;
    }>;
    createdAt: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: {
        kind: "draft";
    } | {
        kind: "published";
        publishedAt: string;
    } | {
        kind: "paused";
    } | {
        kind: "under_review";
        reportId: string;
    } | {
        reason: string;
        kind: "removed";
        removedBy: string;
    };
    price: {
        model: "fixed";
        price: {
            currency: string;
            amountMinor: number;
        };
    } | {
        model: "hourly";
        hourlyRate: {
            currency: string;
            amountMinor: number;
        };
        minimumHours: number;
    } | {
        model: "quote";
        startingFrom?: {
            currency: string;
            amountMinor: number;
        } | undefined;
    };
    id: string;
    title: string;
    categoryId: string;
    ownerId: string;
    distanceMeters: number;
    location: {
        lat: number;
        lng: number;
    };
    description?: string | undefined;
    isFavorite?: boolean | undefined;
    rating?: number | undefined;
    reviewCount?: number | undefined;
    photos?: string[] | undefined;
    createdAt?: string | undefined;
}, {
    status: {
        kind: "draft";
    } | {
        kind: "published";
        publishedAt: string;
    } | {
        kind: "paused";
    } | {
        kind: "under_review";
        reportId: string;
    } | {
        reason: string;
        kind: "removed";
        removedBy: string;
    };
    price: {
        model: "fixed";
        price: {
            currency: string;
            amountMinor: number;
        };
    } | {
        model: "hourly";
        hourlyRate: {
            currency: string;
            amountMinor: number;
        };
        minimumHours: number;
    } | {
        model: "quote";
        startingFrom?: {
            currency: string;
            amountMinor: number;
        } | undefined;
    };
    id: string;
    title: string;
    categoryId: string;
    ownerId: string;
    distanceMeters: number;
    location: {
        lat: number;
        lng: number;
    };
    description?: string | undefined;
    isFavorite?: boolean | undefined;
    rating?: number | undefined;
    reviewCount?: number | undefined;
    photos?: string[] | undefined;
    createdAt?: string | undefined;
}>;
export declare const listingsSearchResponseSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        categoryId: z.ZodString;
        ownerId: z.ZodString;
        price: z.ZodUnion<[z.ZodObject<{
            model: z.ZodLiteral<"fixed">;
            price: z.ZodObject<{
                amountMinor: z.ZodNumber;
                currency: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                currency: string;
                amountMinor: number;
            }, {
                currency: string;
                amountMinor: number;
            }>;
        }, "strip", z.ZodTypeAny, {
            model: "fixed";
            price: {
                currency: string;
                amountMinor: number;
            };
        }, {
            model: "fixed";
            price: {
                currency: string;
                amountMinor: number;
            };
        }>, z.ZodObject<{
            model: z.ZodLiteral<"hourly">;
            hourlyRate: z.ZodObject<{
                amountMinor: z.ZodNumber;
                currency: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                currency: string;
                amountMinor: number;
            }, {
                currency: string;
                amountMinor: number;
            }>;
            minimumHours: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            model: "hourly";
            hourlyRate: {
                currency: string;
                amountMinor: number;
            };
            minimumHours: number;
        }, {
            model: "hourly";
            hourlyRate: {
                currency: string;
                amountMinor: number;
            };
            minimumHours: number;
        }>, z.ZodObject<{
            model: z.ZodLiteral<"quote">;
            startingFrom: z.ZodOptional<z.ZodObject<{
                amountMinor: z.ZodNumber;
                currency: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                currency: string;
                amountMinor: number;
            }, {
                currency: string;
                amountMinor: number;
            }>>;
        }, "strip", z.ZodTypeAny, {
            model: "quote";
            startingFrom?: {
                currency: string;
                amountMinor: number;
            } | undefined;
        }, {
            model: "quote";
            startingFrom?: {
                currency: string;
                amountMinor: number;
            } | undefined;
        }>]>;
        distanceMeters: z.ZodNumber;
        isFavorite: z.ZodOptional<z.ZodBoolean>;
        status: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
            kind: z.ZodLiteral<"draft">;
        }, "strip", z.ZodTypeAny, {
            kind: "draft";
        }, {
            kind: "draft";
        }>, z.ZodObject<{
            kind: z.ZodLiteral<"published">;
            publishedAt: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: "published";
            publishedAt: string;
        }, {
            kind: "published";
            publishedAt: string;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<"paused">;
        }, "strip", z.ZodTypeAny, {
            kind: "paused";
        }, {
            kind: "paused";
        }>, z.ZodObject<{
            kind: z.ZodLiteral<"under_review">;
            reportId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: "under_review";
            reportId: string;
        }, {
            kind: "under_review";
            reportId: string;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<"removed">;
            removedBy: z.ZodString;
            reason: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            reason: string;
            kind: "removed";
            removedBy: string;
        }, {
            reason: string;
            kind: "removed";
            removedBy: string;
        }>]>;
        rating: z.ZodOptional<z.ZodNumber>;
        reviewCount: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        status: {
            kind: "draft";
        } | {
            kind: "published";
            publishedAt: string;
        } | {
            kind: "paused";
        } | {
            kind: "under_review";
            reportId: string;
        } | {
            reason: string;
            kind: "removed";
            removedBy: string;
        };
        price: {
            model: "fixed";
            price: {
                currency: string;
                amountMinor: number;
            };
        } | {
            model: "hourly";
            hourlyRate: {
                currency: string;
                amountMinor: number;
            };
            minimumHours: number;
        } | {
            model: "quote";
            startingFrom?: {
                currency: string;
                amountMinor: number;
            } | undefined;
        };
        id: string;
        title: string;
        categoryId: string;
        ownerId: string;
        distanceMeters: number;
        description?: string | undefined;
        isFavorite?: boolean | undefined;
        rating?: number | undefined;
        reviewCount?: number | undefined;
    }, {
        status: {
            kind: "draft";
        } | {
            kind: "published";
            publishedAt: string;
        } | {
            kind: "paused";
        } | {
            kind: "under_review";
            reportId: string;
        } | {
            reason: string;
            kind: "removed";
            removedBy: string;
        };
        price: {
            model: "fixed";
            price: {
                currency: string;
                amountMinor: number;
            };
        } | {
            model: "hourly";
            hourlyRate: {
                currency: string;
                amountMinor: number;
            };
            minimumHours: number;
        } | {
            model: "quote";
            startingFrom?: {
                currency: string;
                amountMinor: number;
            } | undefined;
        };
        id: string;
        title: string;
        categoryId: string;
        ownerId: string;
        distanceMeters: number;
        description?: string | undefined;
        isFavorite?: boolean | undefined;
        rating?: number | undefined;
        reviewCount?: number | undefined;
    }>, "many">;
    nextCursor: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    items: {
        status: {
            kind: "draft";
        } | {
            kind: "published";
            publishedAt: string;
        } | {
            kind: "paused";
        } | {
            kind: "under_review";
            reportId: string;
        } | {
            reason: string;
            kind: "removed";
            removedBy: string;
        };
        price: {
            model: "fixed";
            price: {
                currency: string;
                amountMinor: number;
            };
        } | {
            model: "hourly";
            hourlyRate: {
                currency: string;
                amountMinor: number;
            };
            minimumHours: number;
        } | {
            model: "quote";
            startingFrom?: {
                currency: string;
                amountMinor: number;
            } | undefined;
        };
        id: string;
        title: string;
        categoryId: string;
        ownerId: string;
        distanceMeters: number;
        description?: string | undefined;
        isFavorite?: boolean | undefined;
        rating?: number | undefined;
        reviewCount?: number | undefined;
    }[];
    nextCursor: string | null;
}, {
    items: {
        status: {
            kind: "draft";
        } | {
            kind: "published";
            publishedAt: string;
        } | {
            kind: "paused";
        } | {
            kind: "under_review";
            reportId: string;
        } | {
            reason: string;
            kind: "removed";
            removedBy: string;
        };
        price: {
            model: "fixed";
            price: {
                currency: string;
                amountMinor: number;
            };
        } | {
            model: "hourly";
            hourlyRate: {
                currency: string;
                amountMinor: number;
            };
            minimumHours: number;
        } | {
            model: "quote";
            startingFrom?: {
                currency: string;
                amountMinor: number;
            } | undefined;
        };
        id: string;
        title: string;
        categoryId: string;
        ownerId: string;
        distanceMeters: number;
        description?: string | undefined;
        isFavorite?: boolean | undefined;
        rating?: number | undefined;
        reviewCount?: number | undefined;
    }[];
    nextCursor: string | null;
}>;
export declare const myListingsResponseSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    categoryId: z.ZodString;
    ownerId: z.ZodString;
    price: z.ZodUnion<[z.ZodObject<{
        model: z.ZodLiteral<"fixed">;
        price: z.ZodObject<{
            amountMinor: z.ZodNumber;
            currency: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            currency: string;
            amountMinor: number;
        }, {
            currency: string;
            amountMinor: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        model: "fixed";
        price: {
            currency: string;
            amountMinor: number;
        };
    }, {
        model: "fixed";
        price: {
            currency: string;
            amountMinor: number;
        };
    }>, z.ZodObject<{
        model: z.ZodLiteral<"hourly">;
        hourlyRate: z.ZodObject<{
            amountMinor: z.ZodNumber;
            currency: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            currency: string;
            amountMinor: number;
        }, {
            currency: string;
            amountMinor: number;
        }>;
        minimumHours: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        model: "hourly";
        hourlyRate: {
            currency: string;
            amountMinor: number;
        };
        minimumHours: number;
    }, {
        model: "hourly";
        hourlyRate: {
            currency: string;
            amountMinor: number;
        };
        minimumHours: number;
    }>, z.ZodObject<{
        model: z.ZodLiteral<"quote">;
        startingFrom: z.ZodOptional<z.ZodObject<{
            amountMinor: z.ZodNumber;
            currency: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            currency: string;
            amountMinor: number;
        }, {
            currency: string;
            amountMinor: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        model: "quote";
        startingFrom?: {
            currency: string;
            amountMinor: number;
        } | undefined;
    }, {
        model: "quote";
        startingFrom?: {
            currency: string;
            amountMinor: number;
        } | undefined;
    }>]>;
    distanceMeters: z.ZodNumber;
    isFavorite: z.ZodOptional<z.ZodBoolean>;
    status: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
        kind: z.ZodLiteral<"draft">;
    }, "strip", z.ZodTypeAny, {
        kind: "draft";
    }, {
        kind: "draft";
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"published">;
        publishedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: "published";
        publishedAt: string;
    }, {
        kind: "published";
        publishedAt: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"paused">;
    }, "strip", z.ZodTypeAny, {
        kind: "paused";
    }, {
        kind: "paused";
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"under_review">;
        reportId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: "under_review";
        reportId: string;
    }, {
        kind: "under_review";
        reportId: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"removed">;
        removedBy: z.ZodString;
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        reason: string;
        kind: "removed";
        removedBy: string;
    }, {
        reason: string;
        kind: "removed";
        removedBy: string;
    }>]>;
    rating: z.ZodOptional<z.ZodNumber>;
    reviewCount: z.ZodOptional<z.ZodNumber>;
} & {
    photos: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    location: z.ZodObject<{
        lat: z.ZodNumber;
        lng: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        lat: number;
        lng: number;
    }, {
        lat: number;
        lng: number;
    }>;
    createdAt: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: {
        kind: "draft";
    } | {
        kind: "published";
        publishedAt: string;
    } | {
        kind: "paused";
    } | {
        kind: "under_review";
        reportId: string;
    } | {
        reason: string;
        kind: "removed";
        removedBy: string;
    };
    price: {
        model: "fixed";
        price: {
            currency: string;
            amountMinor: number;
        };
    } | {
        model: "hourly";
        hourlyRate: {
            currency: string;
            amountMinor: number;
        };
        minimumHours: number;
    } | {
        model: "quote";
        startingFrom?: {
            currency: string;
            amountMinor: number;
        } | undefined;
    };
    id: string;
    title: string;
    categoryId: string;
    ownerId: string;
    distanceMeters: number;
    location: {
        lat: number;
        lng: number;
    };
    description?: string | undefined;
    isFavorite?: boolean | undefined;
    rating?: number | undefined;
    reviewCount?: number | undefined;
    photos?: string[] | undefined;
    createdAt?: string | undefined;
}, {
    status: {
        kind: "draft";
    } | {
        kind: "published";
        publishedAt: string;
    } | {
        kind: "paused";
    } | {
        kind: "under_review";
        reportId: string;
    } | {
        reason: string;
        kind: "removed";
        removedBy: string;
    };
    price: {
        model: "fixed";
        price: {
            currency: string;
            amountMinor: number;
        };
    } | {
        model: "hourly";
        hourlyRate: {
            currency: string;
            amountMinor: number;
        };
        minimumHours: number;
    } | {
        model: "quote";
        startingFrom?: {
            currency: string;
            amountMinor: number;
        } | undefined;
    };
    id: string;
    title: string;
    categoryId: string;
    ownerId: string;
    distanceMeters: number;
    location: {
        lat: number;
        lng: number;
    };
    description?: string | undefined;
    isFavorite?: boolean | undefined;
    rating?: number | undefined;
    reviewCount?: number | undefined;
    photos?: string[] | undefined;
    createdAt?: string | undefined;
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
        reason: string;
        kind: "declined";
    }, {
        reason: string;
        kind: "declined";
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
        reason: string;
        kind: "declined";
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
        reason: string;
        kind: "declined";
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
            reason: string;
            kind: "declined";
        }, {
            reason: string;
            kind: "declined";
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
            reason: string;
            kind: "declined";
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
            reason: string;
            kind: "declined";
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
            reason: string;
            kind: "declined";
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
            reason: string;
            kind: "declined";
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
    rating: number;
    createdAt: string;
    listingId: string;
    bookingId: string;
    authorId: string;
    comment?: string | undefined;
}, {
    id: string;
    rating: number;
    createdAt: string;
    listingId: string;
    bookingId: string;
    authorId: string;
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
        rating: number;
        createdAt: string;
        listingId: string;
        bookingId: string;
        authorId: string;
        comment?: string | undefined;
    }, {
        id: string;
        rating: number;
        createdAt: string;
        listingId: string;
        bookingId: string;
        authorId: string;
        comment?: string | undefined;
    }>, "many">;
    nextCursor: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    items: {
        id: string;
        rating: number;
        createdAt: string;
        listingId: string;
        bookingId: string;
        authorId: string;
        comment?: string | undefined;
    }[];
    nextCursor: string | null;
}, {
    items: {
        id: string;
        rating: number;
        createdAt: string;
        listingId: string;
        bookingId: string;
        authorId: string;
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
    reason: string;
    status: "open" | "resolved";
    id: string;
    createdAt: string;
    listingId: string;
    reporterId: string;
}, {
    reason: string;
    status: "open" | "resolved";
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
        reason: string;
        status: "open" | "resolved";
        id: string;
        createdAt: string;
        listingId: string;
        reporterId: string;
    }, {
        reason: string;
        status: "open" | "resolved";
        id: string;
        createdAt: string;
        listingId: string;
        reporterId: string;
    }>, "many">;
    nextCursor: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    items: {
        reason: string;
        status: "open" | "resolved";
        id: string;
        createdAt: string;
        listingId: string;
        reporterId: string;
    }[];
    nextCursor: string | null;
}, {
    items: {
        reason: string;
        status: "open" | "resolved";
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
    reason?: string | undefined;
    type?: string | undefined;
    detail?: string | undefined;
    instance?: string | undefined;
}, {
    status: number;
    title: string;
    reason?: string | undefined;
    type?: string | undefined;
    detail?: string | undefined;
    instance?: string | undefined;
}>;
export type PricingSchemaType = z.infer<typeof pricingSchema>;
export type ListingSummary = z.infer<typeof listingSummarySchema>;
export type ListingDetail = z.infer<typeof listingDetailSchema>;
export type BookingResponse = z.infer<typeof bookingSchema>;
export type ReviewResponse = z.infer<typeof reviewSchema>;
export type ReportResponse = z.infer<typeof reportSchema>;
export type ActorResponse = z.infer<typeof actorSchema>;
export type AuthSignInResponse = z.infer<typeof authSignInSchema>;
