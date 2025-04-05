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

# Check if Docker Compose is installed
check_docker_compose() {
  if ! command -v docker-compose &> /dev/null && ! command -v docker compose &> /dev/null; then
    error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
  fi
  info "Docker Compose is installed ✓"
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

# Update docker-compose.yml with custom settings
update_compose_file() {
  info "Updating docker-compose.yml with custom settings..."
  
  read -p "Enter database name [auth_db]: " db_name
  db_name=${db_name:-auth_db}
  
  read -p "Enter database user [postgres]: " db_user
  db_user=${db_user:-postgres}
  
  read -p "Enter database password [postgres]: " db_password
  db_password=${db_password:-postgres}
  
  read -p "Enter database port [5432]: " db_port
  db_port=${db_port:-5432}
  
  # Update docker-compose.yml
  sed -i.bak "s/POSTGRES_DB: auth_db/POSTGRES_DB: ${db_name}/" docker-compose.yml
  sed -i.bak "s/POSTGRES_USER: postgres/POSTGRES_USER: ${db_user}/" docker-compose.yml
  sed -i.bak "s/POSTGRES_PASSWORD: postgres/POSTGRES_PASSWORD: ${db_password}/" docker-compose.yml
  sed -i.bak "s/\"5432:5432\"/\"${db_port}:5432\"/" docker-compose.yml
  sed -i.bak "s/container_name: auth_db-postgres/container_name: ${db_name}-postgres/" docker-compose.yml
  sed -i.bak "s/name: auth_db-postgres-data/name: ${db_name}-postgres-data/" docker-compose.yml
  sed -i.bak "s/container_name: auth_db-pgadmin/container_name: ${db_name}-pgadmin/" docker-compose.yml
  
  # Clean up backup file
  rm docker-compose.yml.bak
  
  success "docker-compose.yml updated with custom settings"
  
  # Update .env file
  update_env_file "${db_name}" "${db_user}" "${db_password}" "${db_port}"
}

# Update .env file with database connection string
update_env_file() {
  local db_name=$1
  local db_user=$2
  local db_password=$3
  local db_port=$4
  
  info "Updating .env file..."
  
  # Create connection string
  DB_URL="postgres://${db_user}:${db_password}@localhost:${db_port}/${db_name}"
  
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

# Start Docker Compose
start_compose() {
  info "Starting Docker Compose..."
  
  if command -v docker compose &> /dev/null; then
    docker compose up -d
  else
    docker-compose up -d
  fi
  
  if [ $? -eq 0 ]; then
    success "Docker Compose started successfully"
  else
    error "Failed to start Docker Compose"
  fi
}

# Stop Docker Compose
stop_compose() {
  info "Stopping Docker Compose..."
  
  if command -v docker compose &> /dev/null; then
    docker compose down
  else
    docker-compose down
  fi
  
  if [ $? -eq 0 ]; then
    success "Docker Compose stopped successfully"
  else
    error "Failed to stop Docker Compose"
  fi
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
  echo -e "${BLUE}=== Drizzle Database Manager (Docker Compose) ===${NC}"
  echo ""
  echo "1) Update docker-compose.yml with custom settings"
  echo "2) Start Docker Compose"
  echo "3) Stop Docker Compose"
  echo "4) Run Drizzle generate"
  echo "5) Run Drizzle push"
  echo "6) Update .env file"
  echo "0) Exit"
  echo ""
  read -p "Select an option: " option
  
  case $option in
    1) update_compose_file ;;
    2) start_compose ;;
    3) stop_compose ;;
    4) run_drizzle_generate ;;
    5) run_drizzle_push ;;
    6) update_env_file "auth_db" "postgres" "postgres" "5432" ;;
    0) exit 0 ;;
    *) error "Invalid option" ;;
  esac
}

# Main function
main() {
  check_docker_compose
  check_drizzle
  
  # Check if docker-compose.yml exists
  if [ ! -f "docker-compose.yml" ]; then
    error "docker-compose.yml not found. Please create it first."
    exit 1
  fi
  
  while true; do
    show_menu
  done
}

# Run the main function
main

