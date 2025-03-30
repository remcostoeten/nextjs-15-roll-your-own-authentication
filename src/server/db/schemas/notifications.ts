import { pgTable, text, timestamp, serial, integer, boolean } from "drizzle-orm/pg-core";
import { usersSchema } from "./users";

export const notificationsSchema = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersSchema.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  isSaved: boolean("is_saved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}); 