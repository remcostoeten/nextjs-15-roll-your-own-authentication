"use server";

import { db } from "db";
import { notificationsSchema } from "@/server/db/schemas/notifications";
import { eq, and, desc } from "drizzle-orm";
import type { NotificationFilter } from "../models/types";

export async function getNotifications(userId: number, filter?: NotificationFilter) {
  try {
    const conditions = [eq(notificationsSchema.userId, userId)];

    if (filter?.isRead !== undefined) {
      conditions.push(eq(notificationsSchema.isRead, filter.isRead));
    }

    if (filter?.isSaved !== undefined) {
      conditions.push(eq(notificationsSchema.isSaved, filter.isSaved));
    }

    const notifications = await db
      .select()
      .from(notificationsSchema)
      .where(and(...conditions))
      .orderBy(desc(notificationsSchema.createdAt));

    return { success: true, notifications };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return {
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Failed to fetch notifications",
      },
    };
  }
} 