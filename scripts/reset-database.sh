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

# Check if PostgreSQL is running in Docker
check_postgres() {
  if command -v docker &> /dev/null; then
    if docker ps | grep -q postgres; then
      return 0
    fi
  fi
  return 1
}

# Get database connection details from .env file
get_db_details() {
  if [ -f .env ]; then
    DB_URL=$(grep DATABASE_URL .env | cut -d '=' -f2-)
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

# Main script
echo "========================================="
echo "  Database Reset Tool"
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
warning "This script will DROP ALL TABLES in the database '$DB_NAME'!"
warning "This action CANNOT be undone and will result in PERMANENT DATA LOSS!"
echo ""
read -p "Are you sure you want to continue? (y/N): " confirm
if [[ $confirm != [yY] && $confirm != [yY][eE][sS] ]]; then
  info "Operation cancelled"
  exit 0
fi

# Create SQL to drop all tables
info "Creating SQL to drop all tables..."
DROP_SQL="SELECT 'DROP TABLE IF EXISTS ' || tablename || ' CASCADE;' FROM pg_tables WHERE schemaname = 'public';"

# Execute SQL to get drop statements
if check_postgres; then
  # Using Docker
  container_id=$(docker ps | grep postgres | awk '{print $1}')
  drop_commands=$(docker exec -i $container_id psql -U $DB_USER -d $DB_NAME -t -c "$DROP_SQL")
  
  # Execute drop commands
  info "Dropping all tables..."
  echo "$drop_commands" | docker exec -i $container_id psql -U $DB_USER -d $DB_NAME > /dev/null 2>&1
  
  if [ $? -eq 0 ]; then
    success "All tables dropped successfully"
  else
    error "Failed to drop tables"
    exit 1
  fi
else
  # Using local psql
  if command -v psql &> /dev/null; then
    export PGPASSWORD=$DB_PASS
    drop_commands=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "$DROP_SQL")
    
    # Execute drop commands
    info "Dropping all tables..."
    echo "$drop_commands" | psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
      success "All tables dropped successfully"
    else
      error "Failed to drop tables"
      exit 1
    fi
  else
    error "PostgreSQL client (psql) not found"
    error "Please install PostgreSQL client or use Docker"
    exit 1
  fi
fi

# Push schema to database
info "Pushing schema to database..."
npx drizzle-kit push

if [ $? -eq 0 ]; then
  success "Schema pushed successfully"
else
  error "Failed to push schema"
  exit 1
fi

echo ""
success "Database reset complete!"
info "Your database has been reset with the new schema"
echo ""

