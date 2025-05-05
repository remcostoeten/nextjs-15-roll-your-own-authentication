import { pgTable, serial, varchar, timestamp, text, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './user-schema';

export const userProfiles = pgTable('user_profiles', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).unique(),
    biography: text('biography'),
    occupation: varchar('occupation', { length: 255 }),
    githubLink: varchar('github_link', { length: 255 }),
    twitterLink: varchar('twitter_link', { length: 255 }),
    websiteLink: varchar('website_link', { length: 255 }),
    loginCount: integer('login_count').default(0),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
    user: one(users, {
        fields: [userProfiles.userId],
        references: [users.id],
    }),
}));
