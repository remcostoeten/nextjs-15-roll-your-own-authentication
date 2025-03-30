import { pgTable, serial, integer, timestamp, index } from "drizzle-orm/pg-core";
import { usersSchema } from "./users";

export const sessionsSchema = pgTable(
  "sessions",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => usersSchema.id)
      .notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (sessions) => ({
    userIdIdx: index("user_id_idx").on(sessions.userId),
    expiresAtIdx: index("expires_at_idx").on(sessions.expiresAt),
  })
); 