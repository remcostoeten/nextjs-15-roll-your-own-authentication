#!/bin/bash

# ANSI color codes for pretty output
export RED='\033[0;31m'
export GREEN='\033[0;32m'
export YELLOW='\033[0;33m'
export BLUE='\033[0;34m'
export MAGENTA='\033[0;35m'
export CYAN='\033[0;36m'
export BOLD='\033[1m'
export NC='\033[0m' # No Color

# Enhanced color options
export BRIGHT_RED='\033[1;91m'
export BRIGHT_GREEN='\033[1;92m'
export BRIGHT_YELLOW='\033[1;93m'
export BRIGHT_BLUE='\033[1;94m'
export BRIGHT_MAGENTA='\033[1;95m'
export BRIGHT_CYAN='\033[1;96m'
export ORANGE='\033[0;33m'
export PURPLE='\033[0;35m'
export BG_BLUE='\033[44m'
export BG_GREEN='\033[42m'
export BG_RED='\033[41m'
export BG_YELLOW='\033[43m'
export BG_MAGENTA='\033[45m'
export BG_CYAN='\033[46m'
export UNDERLINE='\033[4m'
export BLINK='\033[5m'

# Emojis
export ROCKET="🚀"
export DATABASE="🗄️"
export WARNING="⚠️"
export CHECK="✅"
export CROSS="❌"
export INFO="ℹ️"
export FIRE="🔥"
export GITHUB="📂"
export VERCEL="▲"
export BRANCH="🌿"
export DEPLOY="🚢"
export COMMIT="📝"
export MERGE="🔀"
export CONFIG="⚙️"

# Function to print colored and emoji-decorated messages
print_message() {
  local color=$1
  local emoji=$2
  local message=$3
  echo -e "${color}${BOLD}${emoji} ${message}${NC}"
}

# Enhanced UI Functions
# ====================

# Print a fancy header with customizable text and background color
print_header() {
  local text="$1"
  local bg_color="${2:-$BG_BLUE}"
  local width=60
  local padding=$(( (width - ${#text}) / 2 ))
  
  echo -e "\n${bg_color}${BOLD}$(printf '%*s' $width '')${NC}"
  echo -e "${bg_color}${BOLD}$(printf '%*s' $padding '')${text}$(printf '%*s' $padding '')${NC}"
  echo -e "${bg_color}${BOLD}$(printf '%*s' $width '')${NC}\n"
}

# Print a colorful status box
print_status_box() {
  local status="$1"
  local message="$2"
  local bg_color="${3:-$BG_BLUE}"
  
  echo -e "${bg_color}${BOLD} ${status} ${NC} ${message}"
}

# Print a divider line
print_divider() {
  local color="${1:-$BLUE}"
  local char="${2:-─}"
  local width="${3:-60}"
  
  echo -e "${color}$(printf '%*s' $width | tr ' ' "$char")${NC}"
}

# Show a spinner while a process is running
show_spinner() {
  local pid=$1
  local delay=0.1
  local spinstr='|/-\'
  
  while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
    local temp=${spinstr#?}
    printf "${BRIGHT_CYAN} [%c]  ${NC}" "$spinstr"
    local spinstr=$temp${spinstr%"$temp"}
    sleep $delay
    printf "\b\b\b\b\b\b"
  done
  printf "    \b\b\b\b"
}

# Print a menu item
print_menu_item() {
  local number="$1"
  local text="$2"
  local color="${3:-$CYAN}"
  local is_current="${4:-false}"
  
  if [ "$is_current" = true ]; then
    echo -e "  ${BRIGHT_GREEN}${BOLD}[$number] $text ${NC}"
  else
    echo -e "  ${color}${BOLD}[$number]${NC} $text"
  fi
}

# Check if Docker is installed
check_docker() {
  if ! command -v docker &> /dev/null; then
    print_message "$RED" "$CROSS" "Docker is not installed. Please install Docker first."
    return 1
  fi
  
  if ! command -v docker-compose &> /dev/null; then
    print_message "$RED" "$CROSS" "Docker Compose is not installed. Please install Docker Compose first."
    return 1
  fi

  # Check if Docker daemon is running
  if ! docker info &> /dev/null; then
    print_message "$YELLOW" "$WARNING" "Docker daemon is not running. Starting it now..."
    
    # Try to start Docker based on system
    if [ -f /etc/debian_version ]; then
      sudo systemctl start docker
    elif [ -f /etc/redhat-release ]; then
      sudo systemctl start docker
    elif [[ "$OSTYPE" == "darwin"* ]]; then
      open --background -a Docker
      print_message "$YELLOW" "$INFO" "Waiting for Docker to start..."
      sleep 10
    else
      print_message "$RED" "$CROSS" "Could not start Docker daemon. Please start it manually."
      return 1
    fi
    
    # Check again if Docker is running
    if ! docker info &> /dev/null; then
      print_message "$RED" "$CROSS" "Failed to start Docker daemon."
      return 1
    fi
  fi
  
  print_message "$GREEN" "$CHECK" "Docker is ready."
  return 0
}

# Function to check if .env file exists, if not create it from example
ensure_env_file() {
  ENV_FILES=(
    ".env"
    ".env.example"
    ".env.local"
    ".env.development"
    ".env.production"
  )
  for env_file in "${ENV_FILES[@]}"; do
    if [ ! -f "$env_file" ]; then
      print_message "$YELLOW" "$INFO" "Creating $env_file file from .env.example..."
      cp .env.example "$env_file"
      print_message "$GREEN" "$CHECK" "$env_file file created successfully."
    fi
  done
  if [ ! -f .env ]; then
    if [ -f .env.example ]; then
      print_message "$YELLOW" "$INFO" "Creating .env file from .env.example..."
      cp .env.example .env
      print_message "$GREEN" "$CHECK" ".env file created successfully."
    else
      print_message "$RED" "$CROSS" "No .env.example file found. Cannot create .env file."
      return 1
    fi
  }
  return 0
}

# Function to update environment variables in the .env file
update_env_var() {
  local key=$1
  local value=$2
  
  if [ -f .env ]; then
    if grep -q "^${key}=" .env; then
      # Update existing variable
      sed -i "s|^${key}=.*|${key}=${value}|" .env
    else
      # Add new variable
      echo "${key}=${value}" >> .env
    fi
  else
    print_message "$RED" "$CROSS" "No .env file found. Cannot update variables."
    return 1
  fi
  return 0
}

# Clean up Docker resources
cleanup_docker() {
  local purge_volumes=$1
  
  print_message "$YELLOW" "$INFO" "Stopping containers..."
  docker-compose down
  
  if [ "$purge_volumes" = true ]; then
    print_message "$YELLOW" "$WARNING" "Removing volumes..."
    docker-compose down -v
  fi
  
  print_message "$GREEN" "$CHECK" "Cleanup completed."
}

# Open the app in browser
open_in_browser() {
  local url=$1
  local port=${2:-3000}
  
  print_message "$BLUE" "$INFO" "Opening application in browser: $url:$port"
  
  # Try to open browser based on OS
  if command -v xdg-open &> /dev/null; then
    xdg-open "$url:$port"
  elif command -v open &> /dev/null; then
    open "$url:$port"
  elif command -v start &> /dev/null; then
    start "$url:$port"
  else
    print_message "$YELLOW" "$WARNING" "Could not open browser automatically. Please open $url:$port manually."
  fi
}

# Update the help text to include the new developer tool commands
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

${BRIGHT_MAGENTA}${BOLD}Developer Tools:${NC}
  ${BRIGHT_GREEN}typecheck${NC}         Run TypeScript type checking

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