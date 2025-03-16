PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_activity_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`action` text NOT NULL,
	`details` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_activity_logs`("id", "user_id", "action", "details", "created_at") SELECT "id", "user_id", "action", "details", "created_at" FROM `activity_logs`;--> statement-breakpoint
DROP TABLE `activity_logs`;--> statement-breakpoint
ALTER TABLE `__new_activity_logs` RENAME TO `activity_logs`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`refresh_token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`user_agent` text,
	`ip_address` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_sessions`("id", "user_id", "refresh_token", "expires_at", "created_at", "user_agent", "ip_address") SELECT "id", "user_id", "refresh_token", "expires_at", "created_at", "user_agent", "ip_address" FROM `sessions`;--> statement-breakpoint
DROP TABLE `sessions`;--> statement-breakpoint
ALTER TABLE `__new_sessions` RENAME TO `sessions`;--> statement-breakpoint
CREATE TABLE `__new_user_metrics` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`login_count` integer DEFAULT 0,
	`last_active` integer,
	`total_sessions` integer DEFAULT 0,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_user_metrics`("id", "user_id", "login_count", "last_active", "total_sessions", "created_at", "updated_at") SELECT "id", "user_id", "login_count", "last_active", "total_sessions", "created_at", "updated_at" FROM `user_metrics`;--> statement-breakpoint
DROP TABLE `user_metrics`;--> statement-breakpoint
ALTER TABLE `__new_user_metrics` RENAME TO `user_metrics`;--> statement-breakpoint
CREATE TABLE `__new_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`sensitive` integer DEFAULT false NOT NULL,
	`author_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_posts`("id", "title", "content", "published", "sensitive", "author_id", "created_at", "updated_at") SELECT "id", "title", "content", "published", "sensitive", "author_id", "created_at", "updated_at" FROM `posts`;--> statement-breakpoint
DROP TABLE `posts`;--> statement-breakpoint
ALTER TABLE `__new_posts` RENAME TO `posts`;