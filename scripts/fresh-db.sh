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

# Check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Main script
echo "========================================="
echo "  Fresh PostgreSQL Setup"
echo "========================================="
echo ""

# Check if Docker is installed
if ! command_exists docker; then
  error "Docker is not installed. Please install Docker first."
  exit 1
fi

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
  error "Docker is not running. Please start Docker and try again."
  exit 1
fi

# Confirm reset
warning "This script will REMOVE ALL PostgreSQL containers and volumes!"
warning "This action CANNOT be undone and will result in PERMANENT DATA LOSS!"
echo ""
read -p "Are you sure you want to continue? (y/N): " confirm
if [[ $confirm != [yY] && $confirm != [yY][eE][sS] ]]; then
  info "Operation cancelled"
  exit 0
fi

# Step 1: Stop and remove all PostgreSQL containers
info "Stopping and removing all PostgreSQL containers..."
POSTGRES_CONTAINERS=$(docker ps -a --filter "ancestor=postgres" --format "{{.Names}}")
if [ -n "$POSTGRES_CONTAINERS" ]; then
  echo "$POSTGRES_CONTAINERS" | xargs docker stop
  echo "$POSTGRES_CONTAINERS" | xargs docker rm
  success "Removed all PostgreSQL containers"
else
  info "No PostgreSQL containers found"
fi

# Step 2: Remove all PostgreSQL volumes
info "Removing all PostgreSQL volumes..."
POSTGRES_VOLUMES=$(docker volume ls --filter "name=postgres" --format "{{.Name}}")
if [ -n "$POSTGRES_VOLUMES" ]; then
  echo "$POSTGRES_VOLUMES" | xargs docker volume rm
  success "Removed all PostgreSQL volumes"
else
  info "No PostgreSQL volumes found"
fi

# Step 3: Get database configuration
info "Setting up new database configuration..."
DB_NAME="auth_db"
DB_USER="postgres"
DB_PASS="postgres"
DB_PORT="5432"

# Check if port is already in use
if command_exists lsof; then
  if lsof -i:"$DB_PORT" >/dev/null 2>&1; then
    warning "Port $DB_PORT is already in use"
    read -p "Enter a different port (default: 5433): " NEW_PORT
    DB_PORT=${NEW_PORT:-5433}
  fi
elif command_exists netstat; then
  if netstat -tuln | grep ":$DB_PORT " >/dev/null 2>&1; then
    warning "Port $DB_PORT is already in use"
    read -p "Enter a different port (default: 5433): " NEW_PORT
    DB_PORT=${NEW_PORT:-5433}
  fi
fi

# Step 4: Create a new PostgreSQL container
info "Creating new PostgreSQL container..."
CONTAINER_NAME="${DB_NAME}-postgres"
VOLUME_NAME="${DB_NAME}-postgres-data"

docker volume create $VOLUME_NAME
docker run --name $CONTAINER_NAME \
  -e POSTGRES_PASSWORD=$DB_PASS \
  -e POSTGRES_USER=$DB_USER \
  -e POSTGRES_DB=$DB_NAME \
  -p $DB_PORT:5432 \
  -v $VOLUME_NAME:/var/lib/postgresql/data \
  -d postgres:14

if [ $? -ne 0 ]; then
  error "Failed to create PostgreSQL container"
  exit 1
fi

success "Created PostgreSQL container: $CONTAINER_NAME"
info "Waiting for PostgreSQL to start..."
sleep 5

# Step 5: Update .env file
info "Updating .env file..."
DB_URL="postgres://$DB_USER:$DB_PASS@localhost:$DB_PORT/$DB_NAME"

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

# Step 6: Push schema to database
info "Pushing schema to database..."
npx drizzle-kit push

if [ $? -ne 0 ]; then
  error "Failed to push schema"
  exit 1
fi

success "Schema pushed successfully"

# Step 7: Run setup script to create initial data
info "Running setup script to create initial data..."
npx tsx scripts/setup-db.ts

if [ $? -ne 0 ]; then
  warning "Setup script failed, but database schema was pushed successfully"
else
  success "Setup script completed successfully"
fi

echo ""
success "Fresh database setup complete!"
info "Your database has been set up with the new schema and initial data"
echo ""
info "Container: $CONTAINER_NAME"
info "Database: $DB_NAME"
info "User: $DB_USER"
info "Password: $DB_PASS"
info "Port: $DB_PORT"
info "Connection URL: $DB_URL"
echo ""
info "To connect to the database:"
echo "  docker exec -it $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME"
echo ""

