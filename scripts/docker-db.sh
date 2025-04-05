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

# Main script
echo "========================================="
echo "  Docker PostgreSQL Setup"
echo "========================================="
echo ""

# Get database connection details
read -p "Enter database name [auth_db]: " DB_NAME
DB_NAME=${DB_NAME:-auth_db}

read -p "Enter database user [postgres]: " DB_USER
DB_USER=${DB_USER:-postgres}

read -p "Enter database password [postgres]: " DB_PASS
DB_PASS=${DB_PASS:-postgres}

read -p "Enter database port [5432]: " DB_PORT
DB_PORT=${DB_PORT:-5432}

# Check if port is in use
if is_port_in_use $DB_PORT; then
  warning "Port $DB_PORT is already in use"
  read -p "Enter a different port (e.g., 5433): " NEW_PORT
  
  if [ -z "$NEW_PORT" ]; then
    NEW_PORT=5433
  fi
  
  # Check if the new port is also in use
  if is_port_in_use $NEW_PORT; then
    error "Port $NEW_PORT is also in use. Please choose a different port or stop the service using these ports."
    exit 1
  fi
  
  DB_PORT=$NEW_PORT
fi

# Check if Docker is running
info "Checking if Docker is running..."
if ! docker info > /dev/null 2>&1; then
  error "Docker is not running. Please start Docker and try again."
  exit 1
fi

# Check if PostgreSQL container exists
info "Checking if PostgreSQL container exists..."
CONTAINER_NAME="${DB_NAME}-postgres"
if docker ps -a | grep -q $CONTAINER_NAME; then
  info "PostgreSQL container found: $CONTAINER_NAME"
  
  # Ask if user wants to remove and recreate
  read -p "Do you want to remove and recreate the container? (y/N): " RECREATE
  if [[ $RECREATE == [yY] || $RECREATE == [yY][eE][sS] ]]; then
    info "Removing container..."
    docker rm -f $CONTAINER_NAME
  else
    # Check if container is running
    if ! docker ps | grep -q $CONTAINER_NAME; then
      info "Starting PostgreSQL container..."
      docker start $CONTAINER_NAME
      
      if [ $? -ne 0 ]; then
        error "Failed to start PostgreSQL container"
        exit 1
      fi
    fi
    
    # Get the current port
    CURRENT_PORT=$(docker port $CONTAINER_NAME | grep 5432/tcp | cut -d ':' -f 2)
    if [ -n "$CURRENT_PORT" ] && [ "$CURRENT_PORT" != "$DB_PORT" ]; then
      warning "Container is using port $CURRENT_PORT instead of $DB_PORT"
      DB_PORT=$CURRENT_PORT
    fi
    
    info "Using existing container with port $DB_PORT"
    
    # Update .env file with the correct DATABASE_URL
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
    success "Database setup complete!"
    exit 0
  fi
fi

# Create Docker container
info "Creating Docker container..."
docker run --name $CONTAINER_NAME -e POSTGRES_PASSWORD=$DB_PASS -e POSTGRES_USER=$DB_USER -e POSTGRES_DB=$DB_NAME -p $DB_PORT:5432 -d postgres:14

if [ $? -ne 0 ]; then
  error "Failed to create PostgreSQL container"
  exit 1
fi

success "Created PostgreSQL container: $CONTAINER_NAME"
info "Waiting for PostgreSQL to start..."
sleep 5

# Update .env file with the correct DATABASE_URL
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
success "Database setup complete!"
info "Your database has been set up with the new schema and initial data"
echo ""

