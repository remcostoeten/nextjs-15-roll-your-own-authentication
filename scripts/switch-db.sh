#!/bin/bash

# Get the database name from command line argument
DB_NAME=$1

if [ -z "$DB_NAME" ]; then
  echo "Please provide a database name"
  echo "Usage: pnpm db:switch <database-name>"
  exit 1
fi

# Run the TypeScript script
tsx scripts/db-manager.ts "$DB_NAME" 
