"use server";

import { db } from "db";
import { notificationsSchema, usersSchema } from "@/server/db/schemas";
import { eq } from "drizzle-orm";
import { getSession } from "../../session/get";

export async function sendAdminNotisfication({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "You must be logged in",
        },
      };
    }

    // Check if user is admin
    const admin = await db.query.usersSchema.findFirst({
      where: eq(usersSchema.id, session.userId),
    });

    if (!admin || admin.role !== "admin") {
      return {
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Only admins can send notifications to all users",
        },
      };
    }

    // Get all users
    const users = await db.select().from(usersSchema);

    // Create notifications for all users
    const notifications = await Promise.all(
      users.map((user) =>
        db
          .insert(notificationsSchema)
          .values({
            userId: user.id,
            title,
            message,
          })
          .returning()
      )
    );

    return {
      success: true,
      notifications: notifications.map((n) => n[0]),
    };
  } catch (error) {
    console.error("Error sending admin notification:", error);
    return {
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Failed to send notifications",
      },
    };
  }
} 