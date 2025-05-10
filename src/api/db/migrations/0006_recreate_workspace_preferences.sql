-- Drop existing table
DROP TABLE IF EXISTS "workspace_preferences";

-- Recreate table with proper constraints
CREATE TABLE "workspace_preferences" (
    "user_id" integer NOT NULL REFERENCES "users"("id"),
    "workspace_id" integer NOT NULL REFERENCES "workspaces"("id"),
    "preferences" jsonb NOT NULL,
    "updated_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "workspace_preferences_pkey" PRIMARY KEY ("user_id", "workspace_id"),
    CONSTRAINT "workspace_preferences_unique" UNIQUE ("user_id", "workspace_id")
); 