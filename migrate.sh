#!/bin/bash

# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

# Run the migrations
npx tsx src/server/db/migrate.ts 