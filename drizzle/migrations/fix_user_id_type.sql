-- First, create a temporary column
ALTER TABLE users ADD COLUMN user_id_new INTEGER;

-- Copy data with explicit casting
UPDATE users SET user_id_new = user_id::INTEGER;

-- Drop the old column
ALTER TABLE users DROP COLUMN user_id;

-- Rename the new column to user_id
ALTER TABLE users RENAME COLUMN user_id_new TO user_id;

-- Add any necessary constraints
ALTER TABLE users ALTER COLUMN user_id SET NOT NULL;
