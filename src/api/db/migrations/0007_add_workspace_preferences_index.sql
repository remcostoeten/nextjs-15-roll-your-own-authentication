-- Add unique index on workspace preferences
CREATE UNIQUE INDEX IF NOT EXISTS workspace_preferences_user_workspace_idx 
ON workspace_preferences (user_id, workspace_id); 