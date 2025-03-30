"use server";

import { db } from "db";
  import { notificationsSchema } from "@/server/db/schemas/notifications";
import type { TNotification } from "@/server/db/schemas/types";

export async function createNotification({
  userId,
  title,  
  message,
}: {
  userId: number;
  title: string;
  message: string;
}) {
  try {
    const [notification] = await db
      .insert(notificationsSchema)
      .values({
        userId,
        title,
        message,
      })
      .returning();

    return { success: true, notification };
  } catch (error) {
    console.error("Error creating notification:", error);
    return {
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Failed to create notification",
      },
    };
  }
} 