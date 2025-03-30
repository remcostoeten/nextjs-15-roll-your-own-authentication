"use server";

import { db } from "db";
import { notificationsSchema } from "@/server/db/schemas/notifications";
import { eq, and } from "drizzle-orm";

export async function updateNotification({
  id,
  userId,
  isRead,
  isSaved,
}: {
  id: number;
  userId: number;
  isRead?: boolean;
  isSaved?: boolean;
}) {
  try {
    const updates: Partial<typeof notificationsSchema.$inferInsert> = {};
    
    if (isRead !== undefined) {
      updates.isRead = isRead;
    }
    
    if (isSaved !== undefined) {
      updates.isSaved = isSaved;
    }

    if (Object.keys(updates).length === 0) {
      return { success: false, error: { code: "NO_UPDATES", message: "No updates provided" } };
    }

    const [notification] = await db
      .update(notificationsSchema)
      .set(updates)
      .where(
        and(
          eq(notificationsSchema.id, id),
          eq(notificationsSchema.userId, userId)
        )
      )
      .returning();

    if (!notification) {
      return {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Notification not found",
        },
      };
    }

    return { success: true, notification };
  } catch (error) {
    console.error("Error updating notification:", error);
    return {
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Failed to update notification",
      },
    };
  }
} 