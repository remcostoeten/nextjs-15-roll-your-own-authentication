#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Print styled messages
info() {
  echo -e "${BLUE}INFO:${NC} $1"
}

success() {
  echo -e "${GREEN}SUCCESS:${NC} $1"
}

warning() {
  echo -e "${YELLOW}WARNING:${NC} $1"
}

error() {
  echo -e "${RED}ERROR:${NC} $1"
}

# Check if .env file exists
if [ ! -f ".env" ]; then
  error ".env file not found. Creating a new one..."
  touch .env
fi

# Check current DATABASE_URL
current_url=$(grep DATABASE_URL .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")
if [ -z "$current_url" ]; then
  warning "No DATABASE_URL found in .env file"
else
  info "Current DATABASE_URL: $current_url"
fi

# Create a proper PostgreSQL connection string
echo ""
info "Let's create a proper PostgreSQL connection string"
echo ""

read -p "Enter database host [localhost]: " db_host
db_host=${db_host:-localhost}

read -p "Enter database port [5432]: " db_port
db_port=${db_port:-5432}

read -p "Enter database name [auth_db]: " db_name
db_name=${db_name:-auth_db}

read -p "Enter database user [postgres]: " db_user
db_user=${db_user:-postgres}

read -p "Enter database password [postgres]: " db_password
db_password=${db_password:-postgres}

# Create the connection string
new_url="postgres://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}"
info "New connection string: $new_url"

# Update .env file
if grep -q "DATABASE_URL" .env; then
  # Replace existing DATABASE_URL
  sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=\"${new_url}\"|" .env
  rm -f .env.bak
else
  # Add DATABASE_URL to the end
  echo "DATABASE_URL=\"${new_url}\"" >> .env
fi

success "Updated .env with new DATABASE_URL"

# Check if database exists
info "Checking if database exists..."
if command -v docker &> /dev/null; then
  # Try to use Docker to check/create database
  if docker ps | grep -q postgres; then
    info "Found running PostgreSQL container"
    
    # Get container ID
    container_id=$(docker ps | grep postgres | awk '{print $1}')
    
    # Check if database exists
    if docker exec $container_id psql -U $db_user -lqt | cut -d \| -f 1 | grep -qw $db_name; then
      success "Database '$db_name' already exists"
    else
      warning "Database '$db_name' does not exist. Creating it..."
      docker exec $container_id psql -U $db_user -c "CREATE DATABASE $db_name;"
      if [ $? -eq 0 ]; then
        success "Database '$db_name' created successfully"
      else
        error "Failed to create database. You may need to create it manually."
      fi
    fi
  else
    warning "No running PostgreSQL container found"
    info "You may need to start your database container or create the database manually"
  fi
else
  warning "Docker not found. Cannot automatically check/create database"
  info "Please ensure the database '$db_name' exists before running Drizzle commands"
fi

# Check drizzle.config.ts
info "Checking drizzle.config.ts..."
if [ -f "drizzle.config.ts" ]; then
  # Make a backup
  cp drizzle.config.ts drizzle.config.ts.bak
  
  # Update the configuration with the newer format
  cat > drizzle.config.ts << EOF
import type { Config } from "drizzle-kit"
import * as dotenv from "dotenv"

dotenv.config()

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export default {
  schema: "./server/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  url: process.env.DATABASE_URL,
} satisfies Config
EOF

  success "Updated drizzle.config.ts with the newer format"
  info "Original file backed up as drizzle.config.ts.bak"
else
  error "drizzle.config.ts not found"
fi

echo ""
info "Fix complete! Try running your Drizzle commands again:"
echo "npx drizzle-kit generate"
echo "npx drizzle-kit push"
echo ""

