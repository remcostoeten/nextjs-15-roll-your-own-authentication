ALTER TABLE "users_table" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "name" text;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "last_login_at" timestamp;