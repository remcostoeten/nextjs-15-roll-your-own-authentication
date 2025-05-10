ALTER TABLE "posts" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "posts" CASCADE;--> statement-breakpoint
ALTER TABLE "workspace_preferences" ADD COLUMN "workspace_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "workspace_preferences" ADD CONSTRAINT "workspace_preferences_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;