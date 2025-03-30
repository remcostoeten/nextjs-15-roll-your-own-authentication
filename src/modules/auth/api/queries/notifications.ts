"use server";

import { db } from "db";
import { notificationsSchema } from "@/server/db/schemas/notifications";
    import { eq } from "drizzle-orm";
    import { getUser } from "@/modules/auth/api/queries";
import { desc } from "drizzle-orm";

export async function getNotifications() {
  const user = await getUser(1);
  
  if (!user) {
    return [];
  }

  const notifications = await db.query.notificationsSchema.findMany({
    where: eq(notificationsSchema.userId, user.id),
    orderBy: [desc(notificationsSchema.createdAt)],
  });

  return notifications;
} 