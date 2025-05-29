CREATE TYPE "public"."notification_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('workspace_invite', 'member_joined', 'member_left', 'project_created', 'project_updated', 'task_assigned', 'task_completed', 'mention', 'comment', 'file_shared', 'system');--> statement-breakpoint
CREATE TABLE "notification_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"task_updates" boolean DEFAULT true NOT NULL,
	"project_updates" boolean DEFAULT true NOT NULL,
	"team_messages" boolean DEFAULT true NOT NULL,
	"security_alerts" boolean DEFAULT true NOT NULL,
	"workspace_invites" boolean DEFAULT true NOT NULL,
	"mentions" boolean DEFAULT true NOT NULL,
	"comments" boolean DEFAULT true NOT NULL,
	"file_shares" boolean DEFAULT true NOT NULL,
	"system_notifications" boolean DEFAULT true NOT NULL,
	"email_notifications" boolean DEFAULT false NOT NULL,
	"push_notifications" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "notification_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "notification_type" NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"archived" boolean DEFAULT false NOT NULL,
	"priority" "notification_priority" DEFAULT 'medium' NOT NULL,
	"action_url" text,
	"action_label" text,
	"metadata" jsonb,
	"actor_id" uuid,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;