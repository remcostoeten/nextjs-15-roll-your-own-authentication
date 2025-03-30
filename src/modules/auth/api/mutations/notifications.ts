"use server";

import { db } from "db";
import { notificationsSchema, usersSchema } from "@/server/db/schemas";
import { eq, and } from "drizzle-orm";
import { getUserById } from "@/modules/auth/api/queries/users";
import { verifySession } from "@/modules/auth/session";

export async function toggleNotificationRead(id: number) {
  const session = await verifySession();  
  if (!session) {
    throw new Error("Unauthorized");
  }

  const user = await getUserById(session.userId);
  if (!user) {
    throw new Error("User not found");
  }

  const [notification] = await db
    .select()
    .from(notificationsSchema)
    .where(
      and(
        eq(notificationsSchema.id, id),
        eq(notificationsSchema.userId, user.id)
      )
    );

  if (!notification) {
    throw new Error("Notification not found");
  }

  await db
    .update(notificationsSchema)
    .set({ isRead: !notification.isRead })
    .where(eq(notificationsSchema.id, id));

  return { success: true };
}

export async function toggleNotificationSaved(id: number) {
  const session = await verifySession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const user = await getUserById(session.userId);
  if (!user) {
    throw new Error("User not found");
  }

  const [notification] = await db
    .select()
    .from(notificationsSchema)
    .where(
      and(
        eq(notificationsSchema.id, id),
        eq(notificationsSchema.userId, user.id)
      )
    );

  if (!notification) {
    throw new Error("Notification not found");
  }

  await db
    .update(notificationsSchema)
    .set({ isSaved: !notification.isSaved })
    .where(eq(notificationsSchema.id, id));

  return { success: true };
}

export async function deleteNotification(id: number) {
  const session = await verifySession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const user = await getUserById(session.userId);
  if (!user) {
    throw new Error("User not found");
  }

  await db
    .delete(notificationsSchema)
    .where(
      and(
        eq(notificationsSchema.id, id),
        eq(notificationsSchema.userId, user.id)
      )
    );

  return { success: true };
}

export async function markAllNotificationsAsRead() {
  const session = await verifySession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const user = await getUserById(session.userId);
  if (!user) {
    throw new Error("User not found");
  }

  await db
    .update(notificationsSchema)
    .set({ isRead: true })
    .where(eq(notificationsSchema.userId, user.id));

  return { success: true };
}

export async function sendAdminNotification({
  userId,
  title,
  message,
}: {
  userId: number;
  title: string;
  message: string;
}) {
  const session = await verifySession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const admin = await getUserById(session.userId);
  if (!admin || admin.role !== "admin") {
    throw new Error("Unauthorized: Only admins can send notifications");
  }

  const [notification] = await db
    .insert(notificationsSchema)
    .values({
      userId,
      title,
      message,
      isRead: false,
      isSaved: false,
    })
    .returning();

  return { success: true, notification };
}

export async function sendBroadcastNotification({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  const session = await verifySession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const admin = await getUserById(session.userId);
  if (!admin || admin.role !== "admin") {
    throw new Error("Unauthorized: Only admins can send notifications");
  }

  // Get all users except admin
  const users = await db.query.usersSchema.findMany({
    where: eq(usersSchema.role, "user"),
  });

  // Send notification to all users
  await db.insert(notificationsSchema).values(
    users.map(user => ({
      userId: user.id,
      title,
      message,
      isRead: false,
      isSaved: false,
    }))
  );

  return { success: true };
} 