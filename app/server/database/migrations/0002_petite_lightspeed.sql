ALTER TABLE "users" ADD COLUMN "security_score" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "login_streak" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "total_logins" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "failed_login_attempts" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_location" json;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_device" json;