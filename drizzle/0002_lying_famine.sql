ALTER TABLE "sessions" ADD COLUMN "expires_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "user_agent" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "ip_address" text;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "last_login_at" timestamp;