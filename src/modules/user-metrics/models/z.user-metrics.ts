import { z } from 'zod';

export const zUserMetrics = z.object({
    id: z.string(),
    userId: z.string(),
    loginStreak: z.number().int().default(0),
    lastLogin: z.date().nullable(),
    loginCount: z.number().int().default(0),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const zUserMetricsResponse = z.object({
    id: z.string(),
    userId: z.string(),
    loginStreak: z.number().int(),
    lastLogin: z.date().nullable(),
    loginCount: z.number().int(),
    accountAge: z.string(), // Formatted account age (e.g., "14 days")
    lastLoginFormatted: z.string(), // Formatted last login (e.g., "Today", "Yesterday")
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type UserMetrics = z.infer<typeof zUserMetrics>;
export type UserMetricsResponse = z.infer<typeof zUserMetricsResponse>; 