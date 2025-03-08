#!/bin/bash

# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Source common functions
source "$SCRIPT_DIR/common.sh"

# Source the git module
source "$SCRIPT_DIR/modules/git.sh"

# Define help function
show_help() {
  print_header "Development Tool" "$BG_MAGENTA"
  
  cat << EOF
${BRIGHT_CYAN}Usage:${NC} devtool [command] [options]

${BRIGHT_MAGENTA}${BOLD}Main Commands:${NC}
  ${BRIGHT_GREEN}menu${NC}              Interactive menu system
  ${BRIGHT_GREEN}start${NC}             Start the application (without Docker)
  ${BRIGHT_GREEN}dev${NC}               Start development environment with add-ons
  ${BRIGHT_GREEN}git${NC}               Git operations menu

${BRIGHT_MAGENTA}${BOLD}Docker Commands:${NC}
  ${BRIGHT_GREEN}docker:start${NC}      Start the application with Docker
  ${BRIGHT_GREEN}docker:down${NC}       Stop Docker containers
  ${BRIGHT_GREEN}docker:clean${NC}      Clean up Docker resources

${BRIGHT_MAGENTA}${BOLD}Environment Commands:${NC}
  ${BRIGHT_GREEN}env:show${NC}          Show current environment variables
  ${BRIGHT_GREEN}env:set${NC} KEY=VALUE Set environment variable

${BRIGHT_MAGENTA}${BOLD}Common Options:${NC}
  --postgres        Use PostgreSQL database
  --sqlite          Use SQLite database
  --detached, -d    Run in detached mode (for Docker commands)
  --build, -b       Rebuild containers (for Docker commands)
  --dev             Use development mode (for Docker commands)
  --open            Open in browser after starting
  --help, -h        Show this help message

${BRIGHT_YELLOW}${BOLD}Examples:${NC}
  ${BRIGHT_GREEN}devtool menu${NC}                    # Open interactive menu
  ${BRIGHT_GREEN}devtool start${NC}                   # Start NextJS locally
  ${BRIGHT_GREEN}devtool dev --postgres${NC}          # Start dev with PostgreSQL
  ${BRIGHT_GREEN}devtool docker:start --postgres -d${NC} # Start Docker with PostgreSQL detached
  ${BRIGHT_GREEN}devtool git${NC}                     # Open Git operations menu
EOF
}

# Function to start application without Docker
start_app() {
  print_message "$GREEN" "$ROCKET" "Starting Next.js application..."
  cd "$ROOT_DIR" || exit 1
  
  # Install dependencies if needed
  if [ ! -d "node_modules" ]; then
    print_message "$YELLOW" "$INFO" "Installing dependencies..."
    pnpm install
  fi
  
  # Start Next.js
  print_message "$CYAN" "$FIRE" "Starting Next.js in development mode..."
  if [ "$1" = "--open" ]; then
    open_in_browser "http://localhost" &
    pnpm dev
  else
    pnpm dev
  fi
}

# Function to start development environment with optional add-ons
start_dev_environment() {
  cd "$ROOT_DIR" || exit 1
  
  # Process options
  local use_postgres=false
  local use_sqlite=false
  local down=false
  local open_browser=false
  
  while [[ "$#" -gt 0 ]]; do
    case $1 in
      --postgres) use_postgres=true; shift ;;
      --sqlite) use_sqlite=true; shift ;;
      --down) down=true; shift ;;
      --open) open_browser=true; shift ;;
      *) print_message "$RED" "$CROSS" "Unknown option: $1"; return 1 ;;
    esac
  done
  
  # Create/update .env file
  ensure_env_file
  
  # Stop containers if --down option is provided
  if [ "$down" = true ]; then
    print_message "$YELLOW" "$INFO" "Stopping all containers..."
    docker-compose down
    print_message "$GREEN" "$CHECK" "All containers stopped."
    return 0
  fi
  
  # Configure database type
  if [ "$use_postgres" = true ]; then
    update_env_var "DATABASE_TYPE" "postgres"
    update_env_var "DATABASE_URL" "postgresql://raioa:raioa_password@localhost:5432/raioa_db"
  elif [ "$use_sqlite" = true ]; then
    update_env_var "DATABASE_TYPE" "sqlite"
    update_env_var "DATABASE_URL" "file:./data/raioa.db"
  else
    update_env_var "DATABASE_TYPE" "none"
    update_env_var "DATABASE_URL" ""
  fi
  
  # Set profiles for docker-compose
  local profiles=""
  if [ "$use_postgres" = true ]; then
    profiles="$profiles postgres"
  fi
  if [ "$use_sqlite" = true ]; then
    profiles="$profiles sqlite"
  fi
  
  # Start services
  print_message "$GREEN" "$ROCKET" "Starting development environment..."
  
  if [ -n "$profiles" ]; then
    print_message "$BLUE" "$INFO" "Starting with profiles: $profiles"
    docker-compose --profile "$profiles" up -d
  else
    print_message "$BLUE" "$INFO" "Starting Next.js only (no database)"
    pnpm dev
  fi
  
  # Open in browser if requested
  if [ "$open_browser" = true ]; then
    sleep 3
    open_in_browser "http://localhost"
  fi
  
  print_message "$GREEN" "$CHECK" "Development environment started successfully!"
}

# Function to start application with Docker
start_with_docker() {
  cd "$ROOT_DIR" || exit 1
  
  # Process options
  local use_postgres=false
  local use_sqlite=false
  local detached=false
  local rebuild=false
  local dev_mode=false
  local open_browser=false
  
  while [[ "$#" -gt 0 ]]; do
    case $1 in
      --postgres) use_postgres=true; shift ;;
      --sqlite) use_sqlite=true; shift ;;
      --detached|-d) detached=true; shift ;;
      --build|-b) rebuild=true; shift ;;
      --dev) dev_mode=true; shift ;;
      --open) open_browser=true; shift ;;
      *) print_message "$RED" "$CROSS" "Unknown option: $1"; return 1 ;;
    esac
  done
  
  # Check Docker installation
  check_docker || return 1
  
  # Create/update .env file
  ensure_env_file
  
  # Configure database type
  if [ "$use_postgres" = true ]; then
    update_env_var "DATABASE_TYPE" "postgres"
    update_env_var "DATABASE_URL" "postgresql://raioa:raioa_password@postgres:5432/raioa_db"
  elif [ "$use_sqlite" = true ]; then
    update_env_var "DATABASE_TYPE" "sqlite"
    update_env_var "DATABASE_URL" "file:/data/raioa.db"
  else
    update_env_var "DATABASE_TYPE" "none"
    update_env_var "DATABASE_URL" ""
  fi
  
  # Set development mode
  if [ "$dev_mode" = true ]; then
    update_env_var "NODE_ENV" "development"
  else
    update_env_var "NODE_ENV" "production"
  fi
  
  # Set profiles for docker-compose
  local profiles=""
  if [ "$use_postgres" = true ]; then
    profiles="$profiles postgres"
  fi
  if [ "$use_sqlite" = true ]; then
    profiles="$profiles sqlite"
  fi
  
  # Prepare Docker command
  local docker_cmd="docker-compose"
  
  if [ -n "$profiles" ]; then
    docker_cmd="$docker_cmd --profile $profiles"
  fi
  
  if [ "$rebuild" = true ]; then
    docker_cmd="$docker_cmd build"
    print_message "$YELLOW" "$INFO" "Rebuilding containers..."
    eval "$docker_cmd"
  fi
  
  # Start containers
  if [ "$detached" = true ]; then
    docker_cmd="$docker_cmd up -d"
    print_message "$GREEN" "$ROCKET" "Starting containers in detached mode..."
  else
    docker_cmd="$docker_cmd up"
    print_message "$GREEN" "$ROCKET" "Starting containers..."
  fi
  
  # Open in browser if requested
  if [ "$open_browser" = true ] && [ "$detached" = true ]; then
    (sleep 10 && open_in_browser "http://localhost") &
  fi
  
  # Execute Docker command
  eval "$docker_cmd"
}

# Function to stop Docker containers
stop_docker() {
  cd "$ROOT_DIR" || exit 1
  
  print_message "$YELLOW" "$INFO" "Stopping Docker containers..."
  docker-compose down
  print_message "$GREEN" "$CHECK" "Docker containers stopped."
}

# Function to clean up Docker resources
clean_docker() {
  cd "$ROOT_DIR" || exit 1
  
  local purge_volumes=false
  if [ "$1" = "--volumes" ] || [ "$1" = "-v" ]; then
    purge_volumes=true
  fi
  
  cleanup_docker "$purge_volumes"
}

# Function to show environment variables
show_env() {
  cd "$ROOT_DIR" || exit 1
  
  if [ -f .env ]; then
    print_message "$BLUE" "$INFO" "Current environment variables:"
    cat .env
  else
    print_message "$RED" "$CROSS" "No .env file found."
  fi
}

# Function to set environment variable
set_env() {
  cd "$ROOT_DIR" || exit 1
  
  local kv=$1
  if [[ "$kv" != *"="* ]]; then
    print_message "$RED" "$CROSS" "Invalid format. Use KEY=VALUE format."
    return 1
  fi
  
  local key="${kv%%=*}"
  local value="${kv#*=}"
  
  update_env_var "$key" "$value"
  print_message "$GREEN" "$CHECK" "Set $key = $value"
}

# Function to run TypeScript type checking
run_type_check() {
  cd "$ROOT_DIR" || exit 1
  
  print_message "$BLUE" "$INFO" "Running TypeScript type check..."
  
  # Check for tsconfig.json
  if [ ! -f "tsconfig.json" ]; then
    print_message "$RED" "$CROSS" "No tsconfig.json found. Cannot run type check."
    return 1
  fi
  
  # Run TypeScript compiler in noEmit mode for type checking
  pnpm tsc --noEmit
  
  if [ $? -eq 0 ]; then
    print_message "$GREEN" "$CHECK" "Type check passed! No type errors found."
  else
    print_message "$RED" "$CROSS" "Type check failed. See errors above."
  fi
}

# Interactive main menu
interactive_menu() {
  clear
  print_header "Development Tool" "$BG_MAGENTA"
  
  # Show system info
  echo -e "${BRIGHT_BLUE}${BOLD}Current directory:${NC} $(pwd)"
  echo -e "${BRIGHT_BLUE}${BOLD}Node version:${NC} $(node -v 2>/dev/null || echo 'Not installed')"
  echo -e "${BRIGHT_BLUE}${BOLD}Git branch:${NC} $(git branch --show-current 2>/dev/null || echo 'Not a git repository')"
  
  # Show help message for key navigation
  print_divider "$MAGENTA" "─" 60
  echo -e "${YELLOW}${BOLD}⌨️  Navigate: [number] + Enter  |  🔍 Search: type first letters  |  📋 Help: ?${NC}"
  print_divider "$MAGENTA" "─" 60
  
  # Menu categories
  echo -e "\n${BRIGHT_MAGENTA}${BOLD}Development:${NC}"
  print_menu_item "1" "Start Next.js (local)"
  print_menu_item "2" "Start with PostgreSQL"
  print_menu_item "3" "Start with SQLite"
  
  echo -e "\n${BRIGHT_MAGENTA}${BOLD}Docker:${NC}"
  print_menu_item "4" "Start with Docker"
  print_menu_item "5" "Docker with PostgreSQL"
  print_menu_item "6" "Stop Docker containers"
  print_menu_item "7" "Clean Docker resources"
  
  echo -e "\n${BRIGHT_MAGENTA}${BOLD}Git & Deployment:${NC}"
  print_menu_item "8" "Git operations"
  
  echo -e "\n${BRIGHT_MAGENTA}${BOLD}Developer Tools:${NC}"
  print_menu_item "9" "Type check"
  
  echo -e "\n${BRIGHT_MAGENTA}${BOLD}Utils:${NC}"
  print_menu_item "10" "Environment variables"
  
  echo -e "\n${BRIGHT_RED}${BOLD}System:${NC}"
  print_menu_item "0" "Exit" "$BRIGHT_RED"
  
  # Get user selection
  read -p "$(echo -e ${BRIGHT_CYAN}${BOLD}"Select an option: "${NC})" selection
  
  case "$selection" in
    1) start_app ;;
    2) start_dev_environment --postgres ;;
    3) start_dev_environment --sqlite ;;
    4) start_with_docker ;;
    5) start_with_docker --postgres ;;
    6) stop_docker ;;
    7) clean_docker ;;
    8) git_menu ;;
    9) run_type_check ;;
    10) show_env_menu ;;
    0) 
      clear
      print_message "$GREEN" "$CHECK" "Exiting Development Tool. Have a great day!"
      exit 0
      ;;
    *)
      # Check for search input
      if [[ -n "$selection" ]]; then
        case "$selection" in
          s|st|sta|star|start) start_app ;;
          p|po|pos|post|postg*) start_dev_environment --postgres ;;
          sq|sql|sqli|sqlit*) start_dev_environment --sqlite ;;
          d|do|doc|dock|docke*) start_with_docker ;;
          g|gi|git) git_menu ;;
          t|ty|typ|type*) run_type_check ;;
          e|en|env) show_env_menu ;;
          \?|h|he|hel|help) show_help ;;
          q|qu|qui|quit|e|ex|exi|exit) exit 0 ;;
          *)
            print_message "$RED" "$CROSS" "Invalid option: $selection"
            sleep 1
            ;;
        esac
      fi
      
      # Return to menu
      interactive_menu
      ;;
  esac
  
  # Return to menu after command execution
  read -p "$(echo -e ${CYAN}${BOLD}"Press Enter to return to the menu..."${NC})"
  interactive_menu
}

# Environment variables menu
show_env_menu() {
  clear
  print_header "Environment Variables" "$BG_CYAN"
  
  # Display current environment variables
  if [ -f "$ROOT_DIR/.env" ]; then
    echo -e "${BRIGHT_CYAN}${BOLD}Current environment variables:${NC}\n"
    grep -v "^#" "$ROOT_DIR/.env" | grep -v "^$" | while read -r line; do
      local key=$(echo "$line" | cut -d= -f1)
      local value=$(echo "$line" | cut -d= -f2-)
      echo -e "${BRIGHT_GREEN}${key}${NC}=${YELLOW}${value}${NC}"
    done
  else
    print_message "$YELLOW" "$WARNING" "No .env file found"
  fi
  
  print_divider "$CYAN" "─" 60
  
  echo -e "\n${BRIGHT_CYAN}${BOLD}Options:${NC}"
  print_menu_item "1" "Set environment variable"
  print_menu_item "2" "Edit .env file"
  print_menu_item "3" "Create .env from template"
  print_menu_item "0" "Back to main menu" "$YELLOW"
  
  read -p "$(echo -e ${BRIGHT_CYAN}${BOLD}"Select an option: "${NC})" env_option
  
  case "$env_option" in
    1)
      read -p "$(echo -e ${CYAN}${BOLD}"Enter KEY=VALUE: "${NC})" kv
      set_env "$kv"
      ;;
    2)
      # Use system editor or fallback to vi
      ${EDITOR:-vi} "$ROOT_DIR/.env"
      ;;
    3)
      if [ -f "$ROOT_DIR/.env.example" ]; then
        if [ -f "$ROOT_DIR/.env" ]; then
          if confirm_action "Overwrite existing .env file?"; then
            cp "$ROOT_DIR/.env.example" "$ROOT_DIR/.env"
            print_message "$GREEN" "$CHECK" ".env file created from template"
          fi
        else
          cp "$ROOT_DIR/.env.example" "$ROOT_DIR/.env"
          print_message "$GREEN" "$CHECK" ".env file created from template"
        fi
      else
        print_message "$RED" "$CROSS" "No .env.example file found"
      fi
      ;;
    0|"")
      return
      ;;
    *)
      print_message "$RED" "$CROSS" "Invalid option"
      sleep 1
      show_env_menu
      ;;
  esac
  
  # Return to environment menu
  show_env_menu
}

# Main command processor
main() {
  # If no arguments, show the interactive menu
  if [ $# -eq 0 ]; then
    interactive_menu
    return 0
  fi
  
  local command=$1
  shift
  
  case $command in
    menu)
      interactive_menu
      ;;
    start)
      start_app "$@"
      ;;
    dev)
      start_dev_environment "$@"
      ;;
    docker:start)
      start_with_docker "$@"
      ;;
    docker:down)
      stop_docker
      ;;
    docker:clean)
      clean_docker "$@"
      ;;
    env:show)
      show_env
      ;;
    env:set)
      set_env "$@"
      ;;
    git)
      git_menu
      ;;
    typecheck|tsc)
      run_type_check
      ;;
    --help|-h)
      show_help
      ;;
    *)
      print_message "$RED" "$CROSS" "Unknown command: $command"
      show_help
      return 1
      ;;
  esac
}

# Execute main function with all arguments
main "$@" 