'use server';

import { db } from '@/server/db';
import { activityLogs } from '@/server/db/schemas';
import { z } from 'zod';

const logActivitySchema = z.object({
    userId: z.string(),
    action: z.string(),
    details: z.string().optional(),
});

export const logActivity = async (data: z.infer<typeof logActivitySchema>) => {
    try {
        const { userId, action, details } = logActivitySchema.parse(data);

        const result = await db
            .insert(activityLogs)
            .values({
                userId,
                action,
                details,
            })
            .returning();

        return result[0];
    } catch (error) {
        console.error('Failed to log activity:', error);
        throw error;
    }
}; 