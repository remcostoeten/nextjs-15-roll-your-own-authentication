ALTER TABLE `analytics_page_views` ADD `domain` text NOT NULL;--> statement-breakpoint
ALTER TABLE `analytics_page_views` ADD `browser` text;--> statement-breakpoint
ALTER TABLE `analytics_page_views` ADD `browser_version` text;--> statement-breakpoint
ALTER TABLE `analytics_page_views` ADD `os` text;--> statement-breakpoint
ALTER TABLE `analytics_page_views` ADD `device` text;--> statement-breakpoint
ALTER TABLE `analytics_page_views` ADD `screen_size` text;--> statement-breakpoint
ALTER TABLE `analytics_page_views` ADD `viewport_size` text;--> statement-breakpoint
ALTER TABLE `analytics_page_views` ADD `country` text;--> statement-breakpoint
ALTER TABLE `analytics_page_views` ADD `city` text;--> statement-breakpoint
ALTER TABLE `analytics_page_views` ADD `region` text;--> statement-breakpoint
ALTER TABLE `analytics_page_views` ADD `timezone` text;--> statement-breakpoint
ALTER TABLE `analytics_page_views` ADD `load_time` integer;--> statement-breakpoint
ALTER TABLE `analytics_page_views` ADD `connection_type` text;--> statement-breakpoint
ALTER TABLE `analytics_page_views` ADD `time_on_page` integer;--> statement-breakpoint
ALTER TABLE `analytics_page_views` ADD `scroll_depth` integer;--> statement-breakpoint
ALTER TABLE `analytics_page_views` ADD `utm_source` text;--> statement-breakpoint
ALTER TABLE `analytics_page_views` ADD `utm_medium` text;--> statement-breakpoint
ALTER TABLE `analytics_page_views` ADD `utm_campaign` text;--> statement-breakpoint
ALTER TABLE `analytics_page_views` ADD `language` text;--> statement-breakpoint
ALTER TABLE `analytics_page_views` ADD `is_bot` integer;--> statement-breakpoint
ALTER TABLE `analytics_page_views` ADD `exit_page` text;--> statement-breakpoint
ALTER TABLE `analytics_page_views` ADD `entry_page` text;