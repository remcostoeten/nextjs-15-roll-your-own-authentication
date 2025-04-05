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

# Check if Docker is installed
check_docker() {
  if ! command -v docker &> /dev/null; then
    error "Docker is not installed. Please install Docker first."
    exit 1
  fi
  info "Docker is installed ✓"
}

# Check if Drizzle is installed
check_drizzle() {
  if ! grep -q "drizzle-orm" package.json; then
    warning "Drizzle ORM not found in package.json"
    read -p "Do you want to install drizzle-orm and drizzle-kit? (y/n): " install_drizzle
    if [[ $install_drizzle == "y" ]]; then
      npm install drizzle-orm
      npm install -D drizzle-kit
      success "Drizzle packages installed"
    else
      error "Drizzle is required for this script to work"
      exit 1
    fi
  else
    info "Drizzle is installed ✓"
  fi
}

# Get database configuration from drizzle.config.ts or .env
get_db_config() {
  info "Checking for database configuration..."
  
  # Default values
  DB_NAME="auth_db"
  DB_USER="postgres"
  DB_PASSWORD="postgres"
  DB_PORT="5432"
  
  # Check drizzle.config.ts first
  if [ -f "drizzle.config.ts" ]; then
    info "Found drizzle.config.ts"
    
    # Try to extract database URL from drizzle config
    if grep -q "connectionString" drizzle.config.ts; then
      DB_URL=$(grep -o "connectionString:.*" drizzle.config.ts | sed 's/connectionString: //' | sed 's/[",]//g' | sed 's/^ *//')
      
      # If it's an env variable reference
      if [[ $DB_URL == *"process.env"* ]]; then
        ENV_VAR=$(echo $DB_URL | sed 's/process.env.//' | sed 's/[)]//g')
        info "Database URL references environment variable: $ENV_VAR"
        
        # Check .env file for the variable
        if [ -f ".env" ] && grep -q "$ENV_VAR" .env; then
          DB_URL=$(grep "$ENV_VAR" .env | sed "s/$ENV_VAR=//" | sed 's/"//g')
          info "Found database URL in .env: $DB_URL"
        else
          warning "Environment variable $ENV_VAR not found in .env"
        fi
      else
        info "Found database URL in drizzle config: $DB_URL"
      fi
      
      # Parse the URL if we found one
      if [[ $DB_URL == postgres* ]]; then
        # Extract components from URL
        DB_USER=$(echo $DB_URL | sed -E 's/postgres:\/\/([^:]+):.*/\1/')
        DB_PASSWORD=$(echo $DB_URL | sed -E 's/postgres:\/\/[^:]+:([^@]+).*/\1/')
        DB_HOST=$(echo $DB_URL | sed -E 's/postgres:\/\/[^@]+@([^:]+).*/\1/')
        DB_PORT=$(echo $DB_URL | sed -E 's/postgres:\/\/[^:]+:[^@]+@[^:]+:([0-9]+).*/\1/')
        DB_NAME=$(echo $DB_URL | sed -E 's/postgres:\/\/[^:]+:[^@]+@[^:]+:[0-9]+\/([^?]+).*/\1/')
        
        info "Parsed database configuration:"
        info "  User: $DB_USER"
        info "  Host: $DB_HOST"
        info "  Port: $DB_PORT"
        info "  Database: $DB_NAME"
      fi
    fi
  elif [ -f ".env" ]; then
    # Check .env file for DATABASE_URL
    info "Checking .env file for DATABASE_URL"
    if grep -q "DATABASE_URL" .env; then
      DB_URL=$(grep "DATABASE_URL" .env | sed 's/DATABASE_URL=//' | sed 's/"//g')
      info "Found database URL in .env: $DB_URL"
      
      # Parse the URL
      if [[ $DB_URL == postgres* ]]; then
        # Extract components from URL
        DB_USER=$(echo $DB_URL | sed -E 's/postgres:\/\/([^:]+):.*/\1/')
        DB_PASSWORD=$(echo $DB_URL | sed -E 's/postgres:\/\/[^:]+:([^@]+).*/\1/')
        DB_HOST=$(echo $DB_URL | sed -E 's/postgres:\/\/[^@]+@([^:]+).*/\1/')
        DB_PORT=$(echo $DB_URL | sed -E 's/postgres:\/\/[^:]+:[^@]+@[^:]+:([0-9]+).*/\1/')
        DB_NAME=$(echo $DB_URL | sed -E 's/postgres:\/\/[^:]+:[^@]+@[^:]+:[0-9]+\/([^?]+).*/\1/')
        
        info "Parsed database configuration:"
        info "  User: $DB_USER"
        info "  Host: $DB_HOST"
        info "  Port: $DB_PORT"
        info "  Database: $DB_NAME"
      fi
    else
      warning "DATABASE_URL not found in .env"
    fi
  else
    warning "No configuration files found. Using default values."
  fi
}

# Start PostgreSQL container
start_postgres() {
  info "Starting PostgreSQL container..."
  
  # Check if container already exists
  if docker ps -a | grep -q "${DB_NAME}-postgres"; then
    info "Container ${DB_NAME}-postgres already exists"
    
    # Check if it's running
    if docker ps | grep -q "${DB_NAME}-postgres"; then
      info "Container is already running"
    else
      info "Starting existing container..."
      docker start "${DB_NAME}-postgres"
      success "Container started"
    fi
  else
    info "Creating new PostgreSQL container..."
    docker run --name "${DB_NAME}-postgres" \
      -e POSTGRES_PASSWORD="${DB_PASSWORD}" \
      -e POSTGRES_USER="${DB_USER}" \
      -e POSTGRES_DB="${DB_NAME}" \
      -p "${DB_PORT}:5432" \
      -d postgres:14
    
    if [ $? -eq 0 ]; then
      success "PostgreSQL container created and started"
      
      # Wait for PostgreSQL to start
      info "Waiting for PostgreSQL to start..."
      sleep 3
    else
      error "Failed to create PostgreSQL container"
      exit 1
    fi
  fi
  
  # Update .env file with connection string
  update_env_file
}

# Stop PostgreSQL container
stop_postgres() {
  info "Stopping PostgreSQL container..."
  
  if docker ps | grep -q "${DB_NAME}-postgres"; then
    docker stop "${DB_NAME}-postgres"
    success "Container stopped"
  else
    warning "Container ${DB_NAME}-postgres is not running"
  fi
}

# Remove PostgreSQL container
remove_postgres() {
  info "Removing PostgreSQL container..."
  
  if docker ps -a | grep -q "${DB_NAME}-postgres"; then
    read -p "Are you sure you want to remove the ${DB_NAME}-postgres container? This will delete all data. (y/n): " confirm
    if [[ $confirm == "y" ]]; then
      docker rm -f "${DB_NAME}-postgres"
      success "Container removed"
    else
      info "Operation cancelled"
    fi
  else
    warning "Container ${DB_NAME}-postgres does not exist"
  fi
}

# List all databases in the PostgreSQL container
list_databases() {
  info "Listing databases..."
  
  if docker ps | grep -q "${DB_NAME}-postgres"; then
    docker exec -it "${DB_NAME}-postgres" psql -U "${DB_USER}" -c "\l"
  else
    error "Container ${DB_NAME}-postgres is not running"
  fi
}

# Create a new database
create_database() {
  read -p "Enter new database name: " new_db_name
  
  if [ -z "$new_db_name" ]; then
    error "Database name cannot be empty"
    return
  fi
  
  info "Creating database ${new_db_name}..."
  
  if docker ps | grep -q "${DB_NAME}-postgres"; then
    docker exec -it "${DB_NAME}-postgres" psql -U "${DB_USER}" -c "CREATE DATABASE ${new_db_name};"
    
    if [ $? -eq 0 ]; then
      success "Database ${new_db_name} created"
      
      # Ask if user wants to update .env
      read -p "Do you want to update .env to use this new database? (y/n): " update_env
      if [[ $update_env == "y" ]]; then
        DB_NAME="${new_db_name}"
        update_env_file
      fi
    else
      error "Failed to create database"
    fi
  else
    error "Container ${DB_NAME}-postgres is not running"
  fi
}

# Drop a database
drop_database() {
  read -p "Enter database name to drop: " drop_db_name
  
  if [ -z "$drop_db_name" ]; then
    error "Database name cannot be empty"
    return
  fi
  
  read -p "Are you sure you want to drop database ${drop_db_name}? This cannot be undone. (y/n): " confirm
  if [[ $confirm == "y" ]]; then
    info "Dropping database ${drop_db_name}..."
    
    if docker ps | grep -q "${DB_NAME}-postgres"; then
      docker exec -it "${DB_NAME}-postgres" psql -U "${DB_USER}" -c "DROP DATABASE ${drop_db_name};"
      
      if [ $? -eq 0 ]; then
        success "Database ${drop_db_name} dropped"
        
        # If we dropped the current database, ask to create a new one
        if [[ $drop_db_name == $DB_NAME ]]; then
          warning "You dropped the current database referenced in .env"
          read -p "Do you want to create a new database? (y/n): " create_new
          if [[ $create_new == "y" ]]; then
            create_database
          fi
        fi
      else
        error "Failed to drop database"
      fi
    else
      error "Container ${DB_NAME}-postgres is not running"
    fi
  else
    info "Operation cancelled"
  fi
}

# Update .env file with database connection string
update_env_file() {
  info "Updating .env file..."
  
  # Create connection string
  DB_URL="postgres://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}"
  
  if [ -f ".env" ]; then
    # Check if DATABASE_URL already exists
    if grep -q "DATABASE_URL" .env; then
      # Replace existing DATABASE_URL
      sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=\"${DB_URL}\"|" .env
      rm .env.bak
    else
      # Add DATABASE_URL to the end
      echo "DATABASE_URL=\"${DB_URL}\"" >> .env
    fi
  else
    # Create new .env file
    echo "DATABASE_URL=\"${DB_URL}\"" > .env
  fi
  
  success "Updated .env with DATABASE_URL=\"${DB_URL}\""
}

# Run Drizzle generate
run_drizzle_generate() {
  info "Running Drizzle generate..."
  
  if [ -f "node_modules/.bin/drizzle-kit" ]; then
    npx drizzle-kit generate:pg
    
    if [ $? -eq 0 ]; then
      success "Drizzle schema generated successfully"
    else
      error "Failed to generate Drizzle schema"
    fi
  else
    error "drizzle-kit not found. Please install it with: npm install -D drizzle-kit"
  fi
}

# Run Drizzle push
run_drizzle_push() {
  info "Running Drizzle push..."
  
  if [ -f "node_modules/.bin/drizzle-kit" ]; then
    npx drizzle-kit push:pg
    
    if [ $? -eq 0 ]; then
      success "Drizzle schema pushed to database successfully"
    else
      error "Failed to push Drizzle schema to database"
    fi
  else
    error "drizzle-kit not found. Please install it with: npm install -D drizzle-kit"
  fi
}

# Show main menu
show_menu() {
  echo ""
  echo -e "${BLUE}=== Drizzle Database Manager ===${NC}"
  echo "Current database: ${DB_NAME}"
  echo "Connection: postgres://${DB_USER}:****@localhost:${DB_PORT}/${DB_NAME}"
  echo ""
  echo "1) Start PostgreSQL container"
  echo "2) Stop PostgreSQL container"
  echo "3) Remove PostgreSQL container"
  echo "4) List databases"
  echo "5) Create new database"
  echo "6) Drop database"
  echo "7) Run Drizzle generate"
  echo "8) Run Drizzle push"
  echo "9) Update .env file"
  echo "0) Exit"
  echo ""
  read -p "Select an option: " option
  
  case $option in
    1) start_postgres ;;
    2) stop_postgres ;;
    3) remove_postgres ;;
    4) list_databases ;;
    5) create_database ;;
    6) drop_database ;;
    7) run_drizzle_generate ;;
    8) run_drizzle_push ;;
    9) update_env_file ;;
    0) exit 0 ;;
    *) error "Invalid option" ;;
  esac
}

# Main function
main() {
  check_docker
  check_drizzle
  get_db_config
  
  while true; do
    show_menu
  done
}

# Run the main function
main

