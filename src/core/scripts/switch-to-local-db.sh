#!/bin/bash

# Get the project root directory (3 levels up from the script location)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../" && pwd)"
CONFIG_FILE="$PROJECT_ROOT/drizzle.config.ts"
BACKUP_FILE="$PROJECT_ROOT/drizzle.config.turso.backup"
LOCAL_DB_PATH="$PROJECT_ROOT/local.db"

echo "Project root: $PROJECT_ROOT"
echo "Config file: $CONFIG_FILE"

# Function to backup current Turso config
backup_turso_config() {
  cp "$CONFIG_FILE" "$BACKUP_FILE"
}

# Function to create local SQLite config
create_local_config() {
  cat >"$CONFIG_FILE" <<EOL
import type { Config } from 'drizzle-kit'
export default {
    out: './src/db/migrations',
    schema: './src/db/schema.ts',
    dialect: 'sqlite',
    dbCredentials: {
        url: 'file:./local.db'
    },
    verbose: true
} satisfies Config
EOL
}

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
  echo "Error: drizzle.config.ts not found in project root!"
  exit 1
fi

# Check if we're currently using Turso or local
if grep -q "dialect: 'turso'" "$CONFIG_FILE"; then
  # Currently using Turso, check if local DB exists
  if [ ! -f "$LOCAL_DB_PATH" ]; then
    touch "$LOCAL_DB_PATH"
    echo "Created local SQLite database at $LOCAL_DB_PATH"
  fi

  # Backup current Turso config and switch to local
  backup_turso_config
  create_local_config
  echo "Switched to local SQLite configuration"

else
  # Currently using local, check if backup exists
  if [ -f "$BACKUP_FILE" ]; then
    cp "$BACKUP_FILE" "$CONFIG_FILE"
    echo "Restored Turso configuration"
  else
    echo "Error: Turso configuration backup not found!"
    exit 1
  fi
fi
