import { db } from '@/api/db';
import { userProfiles } from '@/api/schema';
import { eq, sql } from 'drizzle-orm';
import { UpdateProfileInput } from '@/modules/auth/api/models/profile.z';

export async function updateUserProfile(userId: number, data: UpdateProfileInput) {
    try {
        const updateData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== undefined)
        );

        if (Object.keys(updateData).length === 0) {
            console.log("No profile data provided for update.");
            return
        }

        await db.update(userProfiles)
            .set({
                ...updateData,
                updatedAt: new Date(),
            })
            .where(eq(userProfiles.userId, userId));

    } catch (error) {
        console.error(`Error updating profile for user ${userId}:`, error);
        throw new Error("Failed to update profile.");
    }
}

