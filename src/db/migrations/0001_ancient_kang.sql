CREATE TABLE `analytics_events` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`session_id` text,
	`event_name` text NOT NULL,
	`event_data` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `password_reset_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`last_used` text NOT NULL,
	`user_agent` text,
	`ip_address` text,
	`expires_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `verification_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_analytics_page_views` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`session_id` text,
	`pathname` text NOT NULL,
	`domain` text NOT NULL,
	`referrer` text,
	`user_agent` text,
	`duration` integer,
	`created_at` text NOT NULL,
	`browser` text,
	`browser_version` text,
	`os` text,
	`device` text,
	`screen_size` text,
	`viewport_size` text,
	`country` text,
	`city` text,
	`region` text,
	`timezone` text,
	`load_time` integer,
	`connection_type` text,
	`time_on_page` integer,
	`scroll_depth` integer,
	`utm_source` text,
	`utm_medium` text,
	`utm_campaign` text,
	`language` text,
	`is_bot` integer,
	`exit_page` text,
	`entry_page` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_analytics_page_views`("id", "user_id", "session_id", "pathname", "domain", "referrer", "user_agent", "duration", "created_at", "browser", "browser_version", "os", "device", "screen_size", "viewport_size", "country", "city", "region", "timezone", "load_time", "connection_type", "time_on_page", "scroll_depth", "utm_source", "utm_medium", "utm_campaign", "language", "is_bot", "exit_page", "entry_page") SELECT "id", "user_id", "session_id", "pathname", "domain", "referrer", "user_agent", "duration", "created_at", "browser", "browser_version", "os", "device", "screen_size", "viewport_size", "country", "city", "region", "timezone", "load_time", "connection_type", "time_on_page", "scroll_depth", "utm_source", "utm_medium", "utm_campaign", "language", "is_bot", "exit_page", "entry_page" FROM `analytics_page_views`;--> statement-breakpoint
DROP TABLE `analytics_page_views`;--> statement-breakpoint
ALTER TABLE `__new_analytics_page_views` RENAME TO `analytics_page_views`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_analytics_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`first_seen` text NOT NULL,
	`last_seen` text NOT NULL,
	`platform` text,
	`device` text,
	`browser` text,
	`country` text,
	`city` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_analytics_sessions`("id", "user_id", "first_seen", "last_seen", "platform", "device", "browser", "country", "city") SELECT "id", "user_id", "first_seen", "last_seen", "platform", "device", "browser", "country", "city" FROM `analytics_sessions`;--> statement-breakpoint
DROP TABLE `analytics_sessions`;--> statement-breakpoint
ALTER TABLE `__new_analytics_sessions` RENAME TO `analytics_sessions`;