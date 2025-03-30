import {
  pgTable,
  text,
  timestamp,
  serial,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["user", "admin"]);

export const usersSchema = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    password: text("password"),
    role: userRole("role").default("user").notNull(),
    avatarUrl: text("avatar_url"),
    bio: text("bio"),
    location: text("location"),
    website: text("website"),
    twitter: text("twitter"),
    github: text("github"),
    githubId: text("github_id").unique(),
    authProvider: text("auth_provider").default("local").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (users) => ({
    emailIdx: uniqueIndex("email_idx").on(users.email),
    githubIdIdx: uniqueIndex("github_id_idx").on(users.githubId),
  })
); 