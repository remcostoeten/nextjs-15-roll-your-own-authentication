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

# Check if a port is in use
is_port_in_use() {
  if command -v lsof > /dev/null; then
    lsof -i:"$1" > /dev/null
    return $?
  elif command -v netstat > /dev/null; then
    netstat -tuln | grep ":$1 " > /dev/null
    return $?
  else
    # If we can't check, assume it's not in use
    return 1
  fi
}

# Get database connection details from .env file
get_db_details() {
  if [ -f .env ]; then
    DB_URL=$(grep DATABASE_URL .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")
    if [ -n "$DB_URL" ]; then
      # Extract components from the URL
      DB_USER=$(echo $DB_URL | sed -n 's/.*:\/\/$$[^:]*$$:.*/\1/p')
      DB_PASS=$(echo $DB_URL | sed -n 's/.*:\/\/[^:]*:$$[^@]*$$@.*/\1/p')
      DB_HOST=$(echo $DB_URL | sed -n 's/.*@$$[^:]*$$:.*/\1/p')
      DB_PORT=$(echo $DB_URL | sed -n 's/.*@[^:]*:$$[^/]*$$\/.*/\1/p')
      DB_NAME=$(echo $DB_URL | sed -n 's/.*\/$$[^?]*$$.*/\1/p')
      
      # If any component is empty, use defaults
      [ -z "$DB_USER" ] && DB_USER="postgres"
      [ -z "$DB_PASS" ] && DB_PASS="postgres"
      [ -z "$DB_HOST" ] && DB_HOST="localhost"
      [ -z "$DB_PORT" ] && DB_PORT="5432"
      [ -z "$DB_NAME" ] && DB_NAME="postgres"
      
      return 0
    fi
  fi
  
  # Use defaults if .env doesn't exist or doesn't contain DATABASE_URL
  DB_USER="postgres"
  DB_PASS="postgres"
  DB_HOST="localhost"
  DB_PORT="5432"
  DB_NAME="postgres"
  return 1
}

# Connect to existing PostgreSQL
connect_to_existing_postgres() {
  info "Trying to connect to existing PostgreSQL on port $DB_PORT..."
  
  # Try to connect to PostgreSQL
  if command -v psql > /dev/null; then
    # Try to connect with the provided credentials
    if PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "SELECT 1" > /dev/null 2>&1; then
      success "Connected to existing PostgreSQL server"
      
      # Drop and recreate the database
      info "Dropping and recreating database: $DB_NAME"
      PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME WITH (FORCE);"
      PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;"
      
      if [ $? -ne 0 ]; then
        error "Failed to recreate database"
        return 1
      fi
      
      success "Database recreated successfully"
      return 0
    else
      warning "Could not connect to existing PostgreSQL server with provided credentials"
      return 1
    fi
  else
    warning "psql command not found, cannot connect to existing PostgreSQL"
    return 1
  fi
}

# Main script
echo "========================================="
echo "  Complete Database Reset Tool"
echo "========================================="
echo ""

# Get database details
get_db_details
if [ $? -eq 0 ]; then
  info "Found database connection details in .env file"
else
  warning "Using default database connection details"
fi

info "Database details:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Name: $DB_NAME"
echo "  User: $DB_USER"
echo ""

# Confirm reset
warning "This script will COMPLETELY RESET your database!"
warning "This action CANNOT be undone and will result in PERMANENT DATA LOSS!"
echo ""
read -p "Are you sure you want to continue? (y/N): " confirm
if [[ $confirm != [yY] && $confirm != [yY][eE][sS] ]]; then
  info "Operation cancelled"
  exit 0
fi

# Check if port is in use
if is_port_in_use $DB_PORT; then
  warning "Port $DB_PORT is already in use"
  
  # Try to connect to existing PostgreSQL
  if connect_to_existing_postgres; then
    USE_DOCKER=false
  else
    # Ask for a different port
    read -p "Enter a different port for Docker PostgreSQL (e.g., 5433): " NEW_PORT
    if [ -z "$NEW_PORT" ]; then
      NEW_PORT=5433
    fi
    
    # Check if the new port is also in use
    if is_port_in_use $NEW_PORT; then
      error "Port $NEW_PORT is also in use. Please choose a different port or stop the service using these ports."
      exit 1
    fi
    
    # Update the port
    DB_PORT=$NEW_PORT
    USE_DOCKER=true
  fi
else
  USE_DOCKER=true
fi

if [ "$USE_DOCKER" = true ]; then
  # Check if Docker is running
  info "Checking if Docker is running..."
  if ! docker info > /dev/null 2>&1; then
    error "Docker is not running. Please start Docker and try again."
    exit 1
  fi

  # Check if PostgreSQL container exists
  info "Checking if PostgreSQL container exists..."
  CONTAINER_NAME="${DB_NAME}-postgres"
  if ! docker ps -a | grep -q $CONTAINER_NAME; then
    warning "PostgreSQL container not found. Creating a new one..."
    docker run --name $CONTAINER_NAME -e POSTGRES_PASSWORD=$DB_PASS -e POSTGRES_USER=$DB_USER -e POSTGRES_DB=$DB_NAME -p $DB_PORT:5432 -d postgres:14
    
    if [ $? -ne 0 ]; then
      error "Failed to create PostgreSQL container"
      exit 1
    fi
    
    success "Created PostgreSQL container: $CONTAINER_NAME"
    info "Waiting for PostgreSQL to start..."
    sleep 5
  else
    info "PostgreSQL container found: $CONTAINER_NAME"
    
    # Check if container is running
    if ! docker ps | grep -q $CONTAINER_NAME; then
      info "Starting PostgreSQL container..."
      docker start $CONTAINER_NAME
      
      if [ $? -ne 0 ]; then
        error "Failed to start PostgreSQL container"
        exit 1
      fi
      
      info "Waiting for PostgreSQL to start..."
      sleep 5
    fi
    
    # Update container port mapping if needed
    CURRENT_PORT=$(docker port $CONTAINER_NAME | grep 5432/tcp | cut -d ':' -f 2)
    if [ "$CURRENT_PORT" != "$DB_PORT" ]; then
      warning "Container is using port $CURRENT_PORT instead of $DB_PORT"
      warning "Stopping and removing container to recreate with correct port"
      
      docker stop $CONTAINER_NAME
      docker rm $CONTAINER_NAME
      
      docker run --name $CONTAINER_NAME -e POSTGRES_PASSWORD=$DB_PASS -e POSTGRES_USER=$DB_USER -e POSTGRES_DB=$DB_NAME -p $DB_PORT:5432 -d postgres:14
      
      if [ $? -ne 0 ]; then
        error "Failed to create PostgreSQL container with new port"
        exit 1
      fi
      
      success "Created PostgreSQL container with port $DB_PORT"
      info "Waiting for PostgreSQL to start..."
      sleep 5
    fi
  fi

  # Drop and recreate the database
  info "Dropping and recreating database: $DB_NAME"
  docker exec -i $CONTAINER_NAME psql -U $DB_USER -c "DROP DATABASE IF EXISTS $DB_NAME WITH (FORCE);"
  docker exec -i $CONTAINER_NAME psql -U $DB_USER -c "CREATE DATABASE $DB_NAME;"

  if [ $? -ne 0 ]; then
    error "Failed to recreate database"
    exit 1
  fi

  success "Database recreated successfully"
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

