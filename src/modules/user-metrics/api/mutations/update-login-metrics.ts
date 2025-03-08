'use server';

import { db } from '@/server/db';
import { userMetrics } from '@/server/db/schemas';
import { eq } from 'drizzle-orm';
import { differenceInDays } from 'date-fns';

export const updateLoginMetrics = async (userId: string) => {
    // Find existing metrics
    const existingMetrics = await db.query.userMetrics.findFirst({
        where: eq(userMetrics.userId, userId),
    });

    const now = new Date();

    if (!existingMetrics) {
        // Create new metrics for first-time login
        const newMetrics = await db
            .insert(userMetrics)
            .values({
                userId,
                loginStreak: 1,
                lastLogin: now,
                loginCount: 1,
            })
            .returning();

        return newMetrics[0];
    }

    // Calculate login streak based on last login
    let loginStreak = existingMetrics.loginStreak || 0;

    if (existingMetrics.lastLogin) {
        const daysSinceLastLogin = differenceInDays(now, existingMetrics.lastLogin);

        if (daysSinceLastLogin === 0) {
            // Already logged in today, don't increment streak
        } else if (daysSinceLastLogin === 1) {
            // Consecutive day login, increment streak
            loginStreak += 1;
        } else {
            // Break in streak, reset to 1
            loginStreak = 1;
        }
    } else {
        // First login
        loginStreak = 1;
    }

    // Update metrics
    const updatedMetrics = await db
        .update(userMetrics)
        .set({
            lastLogin: now,
            loginStreak,
            loginCount: (existingMetrics.loginCount || 0) + 1,
            updatedAt: now,
        })
        .where(eq(userMetrics.userId, userId))
        .returning();

    return updatedMetrics[0];
}; 