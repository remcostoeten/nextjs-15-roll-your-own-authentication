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

# Main script
echo "========================================="
echo "  Use Existing PostgreSQL Database"
echo "========================================="
echo ""

# Get database connection details
read -p "Enter database host [localhost]: " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Enter database port [5432]: " DB_PORT
DB_PORT=${DB_PORT:-5432}

read -p "Enter database name [auth_db]: " DB_NAME
DB_NAME=${DB_NAME:-auth_db}

read -p "Enter database user [postgres]: " DB_USER
DB_USER=${DB_USER:-postgres}

read -p "Enter database password [postgres]: " DB_PASS
DB_PASS=${DB_PASS:-postgres}

# Confirm reset
warning "This script will RESET the database '$DB_NAME'!"
warning "This action CANNOT be undone and will result in PERMANENT DATA LOSS!"
echo ""
read -p "Are you sure you want to continue? (y/N): " confirm
if [[ $confirm != [yY] && $confirm != [yY][eE][sS] ]]; then
  info "Operation cancelled"
  exit 0
fi

# Try to connect to PostgreSQL
info "Trying to connect to PostgreSQL..."
if command -v psql > /dev/null; then
  # Try to connect with the provided credentials
  if PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "SELECT 1" > /dev/null 2>&1; then
    success "Connected to PostgreSQL server"
    
    # Drop and recreate the database
    info "Dropping and recreating database: $DB_NAME"
    PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME WITH (FORCE);"
    PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;"
    
    if [ $? -ne 0 ]; then
      error "Failed to recreate database"
      exit 1
    fi
    
    success "Database recreated successfully"
  else
    error "Could not connect to PostgreSQL server with provided credentials"
    exit 1
  fi
else
  error "psql command not found, cannot connect to PostgreSQL"
  exit 1
fi

# Update .env file with the correct DATABASE_URL
info "Updating .env file..."
DB_URL="postgres://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME"

if [ -f .env ]; then
  # Check if DATABASE_URL exists in .env
  if grep -q "DATABASE_URL" .env; then
    # Replace existing DATABASE_URL
    sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=\"$DB_URL\"|" .env
    rm -f .env.bak
  else
    # Add DATABASE_URL to .env
    echo "DATABASE_URL=\"$DB_URL\"" >> .env
  fi
else
  # Create new .env file
  echo "DATABASE_URL=\"$DB_URL\"" > .env
fi

success "Updated .env file with DATABASE_URL=\"$DB_URL\""

# Push schema to database
info "Pushing schema to database..."
npx drizzle-kit push

if [ $? -ne 0 ]; then
  error "Failed to push schema"
  exit 1
fi

success "Schema pushed successfully"

# Run setup script to create initial data
info "Running setup script to create initial data..."
npx tsx scripts/setup-db.ts

if [ $? -ne 0 ]; then
  warning "Setup script failed, but database schema was pushed successfully"
else
  success "Setup script completed successfully"
fi

echo ""
success "Database reset and setup complete!"
info "Your database has been reset with the new schema and initial data"
echo ""

