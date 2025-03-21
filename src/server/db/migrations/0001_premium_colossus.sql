CREATE TABLE `changelog_items` (
	`id` text PRIMARY KEY NOT NULL,
	`version` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`date` text NOT NULL,
	`features` text,
	`improvements` text,
	`bugfixes` text,
	`votes` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `roadmap_items` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`status` text DEFAULT 'planned' NOT NULL,
	`priority` integer DEFAULT 0,
	`quarter` text NOT NULL,
	`votes` integer DEFAULT 0,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
