#!/bin/bash

# Add these lines near the top of the script, after the shebang
VERSION="1.0.0"
AUTHOR="Remco Stoeten"
GITHUB_URL="https://github.com/remcostoeten/docker-manager"

# Add a version command option
show_version() {
    echo -e "${BLUE}Docker Manager v${VERSION}${NC}"
    echo -e "${CYAN}Author: ${AUTHOR}${NC}"
    echo -e "${CYAN}GitHub: ${GITHUB_URL}${NC}"
}

# System compatibility check
check_system_compatibility() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC}           System Compatibility Check                          ${BLUE}║${NC}"
    echo -e "${BLUE}╠════════════════════════════════════════════════════════════╣${NC}"

    # Detect OS
    case "$(uname -s)" in
        Linux*)
            echo -e "${GREEN}✓ Linux detected${NC}"
            # Check if it's Ubuntu/PopOS
            if [ -f /etc/os-release ]; then
                . /etc/os-release
                case $ID in
                    ubuntu|pop)
                        echo -e "${GREEN}✓ Running on ${PRETTY_NAME}${NC}"
                        echo -e "${GREEN}✓ Full compatibility mode${NC}"
                        ;;
                    *)
                        echo -e "${YELLOW}⚠ Running on ${PRETTY_NAME}${NC}"
                        echo -e "${YELLOW}⚠ Basic compatibility mode${NC}"
                        ;;
                esac
            fi
            ;;
        Darwin*)
            echo -e "${YELLOW}⚠ macOS detected${NC}"
            echo -e "${YELLOW}⚠ Some features may be limited${NC}"
            echo -e "${YELLOW}⚠ Using Docker Desktop compatibility mode${NC}"
            # Set alternative commands for macOS
            DOCKER_SERVICE_CHECK="docker info >/dev/null 2>&1"
            ;;
        *)
            echo -e "${RED}✗ Unsupported operating system${NC}"
            echo -e "${RED}This script is optimized for Linux and macOS${NC}"
            exit 1
            ;;
    esac

    # Check for required commands
    for cmd in docker docker-compose fzf xclip; do
        if ! command -v $cmd >/dev/null 2>&1; then
            echo -e "${RED}✗ Required command not found: $cmd${NC}"
            case $cmd in
                docker)
                    echo -e "${YELLOW}Please install Docker first:${NC}"
                    echo "https://docs.docker.com/engine/install/"
                    ;;
                docker-compose)
                    echo -e "${YELLOW}Please install Docker Compose:${NC}"
                    echo "https://docs.docker.com/compose/install/"
                    ;;
                fzf)
                    echo -e "${YELLOW}Please install fzf:${NC}"
                    echo "https://github.com/junegunn/fzf#installation"
                    ;;
                xclip)
                    echo -e "${YELLOW}Please install xclip (for clipboard support):${NC}"
                    echo "sudo apt install xclip # For Ubuntu/PopOS"
                    echo "brew install xclip # For macOS"
                    ;;
            esac
            exit 1
        else
            echo -e "${GREEN}✓ Found required command: $cmd${NC}"
        fi
    done

    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo -e "\n${GREEN}System check complete. Press any key to continue...${NC}"
    read -n 1
}

# Add this new function for requirement fixes
show_requirement_fixes() {
    clear
    echo -e "${BLUE}=== System Requirements and Fixes ===${NC}"
    
    # Check each requirement and show installation instructions
    echo -e "\n${CYAN}Checking system requirements...${NC}"
    
    # Docker check
    echo -e "\n${YELLOW}Docker:${NC}"
    if command -v docker >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Installed${NC}"
    else
        echo -e "${RED}✗ Not installed${NC}"
        echo -e "Installation instructions:"
        echo -e "${CYAN}Ubuntu/PopOS:${NC}"
        echo "  sudo apt-get update"
        echo "  sudo apt-get install docker.io"
        echo -e "${CYAN}macOS:${NC}"
        echo "  brew install docker"
    fi

    # Docker Compose check
    echo -e "\n${YELLOW}Docker Compose:${NC}"
    if command -v docker-compose >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Installed${NC}"
    else
        echo -e "${RED}✗ Not installed${NC}"
        echo -e "Installation instructions:"
        echo -e "${CYAN}Ubuntu/PopOS:${NC}"
        echo "  sudo apt-get install docker-compose"
        echo -e "${CYAN}macOS:${NC}"
        echo "  brew install docker-compose"
    fi

    # fzf check
    echo -e "\n${YELLOW}fzf:${NC}"
    if command -v fzf >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Installed${NC}"
    else
        echo -e "${RED}✗ Not installed${NC}"
        echo -e "Installation instructions:"
        echo -e "${CYAN}Ubuntu/PopOS:${NC}"
        echo "  sudo apt-get install fzf"
        echo -e "${CYAN}macOS:${NC}"
        echo "  brew install fzf"
    fi

    # xclip check
    echo -e "\n${YELLOW}xclip:${NC}"
    if command -v xclip >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Installed${NC}"
    else
        echo -e "${RED}✗ Not installed${NC}"
        echo -e "Installation instructions:"
        echo -e "${CYAN}Ubuntu/PopOS:${NC}"
        echo "  sudo apt-get install xclip"
        echo -e "${CYAN}macOS:${NC}"
        echo "  brew install xclip"
    fi

    # System information
    echo -e "\n${YELLOW}System Information:${NC}"
    echo -e "OS: $(uname -s)"
    echo -e "Kernel: $(uname -r)"
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        echo -e "Distribution: $PRETTY_NAME"
    fi

    echo -e "\n${CYAN}Press any key to return to main menu...${NC}"
    read -n 1
}

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Add rainbow color definitions
C_R='\033[38;5;196m'  # Red
C_O='\033[38;5;214m'  # Orange
C_Y='\033[38;5;226m'  # Yellow
C_G='\033[38;5;46m'   # Green
C_B='\033[38;5;33m'   # Blue
C_I='\033[38;5;135m'  # Indigo
C_V='\033[38;5;171m'  # Violet

# Simplify show_intro to just display the title without animation
show_intro() {
    clear
    echo -e "${C_R}🐳 ${C_O}D${C_Y}O${C_G}C${C_B}K${C_I}E${C_V}R ${C_R}M${C_O}A${C_Y}N${C_G}A${C_B}G${C_I}E${C_V}R ${C_B}🐳${NC}"
    echo -e "${MAGENTA}by ${AUTHOR}${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Add this function to show keyboard shortcuts
show_shortcuts() {
    echo -e "${BLUE}╭─ Keyboard Shortcuts ──────────╮${NC}"
    echo -e "${BLUE}│${NC} ↑/↓ or j/k : Navigate        ${BLUE}│${NC}"
    echo -e "${BLUE}│${NC} Enter      : Select          ${BLUE}│${NC}"
    echo -e "${BLUE}│${NC} /          : Search          ${BLUE}│${NC}"
    echo -e "${BLUE}│${NC} ESC/Ctrl+C : Exit/Back       ${BLUE}│${NC}"
    echo -e "${BLUE}│${NC} ?          : Show this help  ${BLUE}│${NC}"
    echo -e "${BLUE}╰────────────────────────────────╯${NC}"
}

# Function to display the main menu with improved layout
main_menu() {
    while true; do
        clear
        # Show the intro with version
        echo -e "${C_R}🐳 ${C_O}D${C_Y}O${C_G}C${C_B}K${C_I}E${C_V}R ${C_R}M${C_O}A${C_Y}N${C_G}A${C_B}G${C_I}E${C_V}R ${C_B}🐳${NC} ${YELLOW}v${VERSION}${NC}"
        echo -e "${MAGENTA}by ${AUTHOR}${NC}"
        
        # Show shortcuts in top right
        show_shortcuts
        
        echo -e "\n${GREEN}Select an option:${NC} (Type to search or use arrow keys)"
        
        option=$(echo -e "Start Docker Compose\nStop Docker Compose\nView all Docker containers\nRemove individual Docker container\nRemove all Docker containers\nRestart Docker\nRemove Docker entirely\nRemove PostgreSQL\nReinstall Docker\nReinstall PostgreSQL\nRemove all and reinstall\nSpin up a new PostgreSQL database\nSpin up a new SQLite database\nView Database Structure\nManage Seeds ($(find ./seeds -name "*.sql" 2>/dev/null | wc -l))\nCheck System Health\nView Container Logs\nBackup/Restore Containers\nGenerate Compose Template\nMonitor Containers\nManage Images\nManage Networks\nManage Volumes\nSystem Requirements\nInfo\nExit" | fzf \
            --height=70% \
            --layout=reverse \
            --border rounded \
            --prompt="🔍 Search > " \
            --header="Docker Management Options (Press ? for help)" \
            --color="header:blue,border:blue" \
            --bind "?:preview:echo -e '${CYAN}Keyboard Shortcuts:${NC}\n\n↑/↓ or j/k : Navigate\nEnter      : Select\n/          : Search\nESC/Ctrl+C : Exit/Back\n?          : Toggle help'" \
            --preview 'case {} in
                "System Requirements") echo "🔧 Check system requirements and get installation instructions";;
                "Info") echo "ℹ️  Show detailed info and documentation";;
                "Start Docker Compose") echo "▶️  Start Docker containers defined in docker-compose.yml";;
                "Stop Docker Compose") echo "⏹️  Stop running Docker containers";;
                "View all Docker containers") echo "👀 List all Docker containers (running and stopped)";;
                "Remove individual Docker container") echo "🗑️  Remove a specific Docker container";;
                "Remove all Docker containers") echo "♻️  Remove all Docker containers";;
                "Spin up a new SQLite database") echo "🗄️  Create a new SQLite database with Docker";;
                "Manage Seeds"*) echo "🌱 Create and manage database seed files";;
                *) echo "Selected: {}";;
            esac' \
            --preview-window=right:40%:wrap \
            --marker="➜" \
            --pointer="▶" \
            --info=inline \
            --no-mouse)

        case "$option" in
            "Start Docker Compose") start_docker_compose ;;
            "Stop Docker Compose") stop_docker_compose ;;
            "View all Docker containers") view_containers ;;
            "Remove individual Docker container") remove_individual_container ;;
            "Remove all Docker containers") remove_all_containers ;;
            "Restart Docker") restart_docker ;;
            "Remove Docker entirely") remove_docker ;;
            "Remove PostgreSQL") remove_postgresql ;;
            "Reinstall Docker") reinstall_docker ;;
            "Reinstall PostgreSQL") reinstall_postgresql ;;
            "Remove all and reinstall") remove_all_and_reinstall ;;
            "Spin up a new PostgreSQL database") spin_up_postgresql ;;
            "Spin up a new SQLite database") spin_up_sqlite ;;
            "View Database Structure") view_database_structure ;;
            "Manage Seeds"*) manage_seeds ;;
            "Check System Health") check_system_health ;;
            "View Container Logs") view_container_logs ;;
            "Backup/Restore Containers") backup_restore_containers ;;
            "Generate Compose Template") generate_compose_template ;;
            "Monitor Containers") monitor_containers ;;
            "Manage Images") manage_images ;;
            "Manage Networks") manage_networks ;;
            "Manage Volumes") manage_volumes ;;
            "System Requirements") show_requirement_fixes ;;
            "Info") show_info_menu ;;
            "Exit") exit 0 ;;
        esac
    done
}

# Function to view containers with better formatting
view_containers() {
    clear
    echo -e "${BLUE}=== Docker Containers ===${NC}"
    
    # Get container list with better formatting
    containers=$(docker ps -a --format "table {{.ID}}\t{{.Image}}\t{{.Status}}\t{{.Names}}\t{{.Ports}}" | \
        sed 's/\([0-9]\{1,\}\.\)\{3\}[0-9]\{1,\}/\x1b[36m&\x1b[0m/g' | \
        sed 's/Up/\x1b[32mUp\x1b[0m/g' | \
        sed 's/Exited/\x1b[31mExited\x1b[0m/g')
    
    if [ -z "$containers" ]; then
        echo -e "${YELLOW}No containers found${NC}"
    else
        # Add header
        echo -e "${CYAN}Container List:${NC}\n"
        
        # Display containers with line numbers and formatting
        echo "$containers" | awk '
            NR==1 {
                print "\033[1;34m" $0 "\033[0m"  # Header in blue
                print "\033[90m" sprintf("%0" length($0) "d", 0) | "tr 0 ─" "\033[0m"  # Separator line
            }
            NR>1 {
                # Alternate row colors for better readability
                if (NR % 2 == 0)
                    printf "\033[38;5;240m%s\033[0m\n", $0
                else
                    print $0
            }
        '
    fi
    
    # Add interactive options
    echo -e "\n${YELLOW}Options:${NC}"
    action=$(echo -e "Inspect Container\nView Logs\nStart Container\nStop Container\nRestart Container\nRemove Container\nBack" | \
        fzf --header "Select action" \
            --preview 'case {} in
                "Inspect Container") echo "View detailed container information";;
                "View Logs") echo "Show container logs";;
                "Start Container") echo "Start a stopped container";;
                "Stop Container") echo "Stop a running container";;
                "Restart Container") echo "Restart a container";;
                "Remove Container") echo "Remove a container";;
                *) echo "Return to main menu";;
            esac')
    
    case "$action" in
        "Inspect Container")
            container_id=$(docker ps -a --format "{{.ID}}: {{.Names}}" | fzf --header "Select container to inspect" | cut -d: -f1)
            if [ -n "$container_id" ]; then
                docker inspect "$container_id" | less
            fi
            ;;
        "View Logs")
            container_id=$(docker ps -a --format "{{.ID}}: {{.Names}}" | fzf --header "Select container to view logs" | cut -d: -f1)
            if [ -n "$container_id" ]; then
                docker logs -f "$container_id" | less
            fi
            ;;
        "Start Container")
            container_id=$(docker ps -a --format "{{.ID}}: {{.Names}}" | grep "Exited" | fzf --header "Select container to start" | cut -d: -f1)
            if [ -n "$container_id" ]; then
                docker start "$container_id"
            fi
            ;;
        "Stop Container")
            container_id=$(docker ps --format "{{.ID}}: {{.Names}}" | fzf --header "Select container to stop" | cut -d: -f1)
            if [ -n "$container_id" ]; then
                docker stop "$container_id"
            fi
            ;;
        "Restart Container")
            container_id=$(docker ps -a --format "{{.ID}}: {{.Names}}" | fzf --header "Select container to restart" | cut -d: -f1)
            if [ -n "$container_id" ]; then
                docker restart "$container_id"
            fi
            ;;
        "Remove Container")
            container_id=$(docker ps -a --format "{{.ID}}: {{.Names}}" | fzf --header "Select container to remove" | cut -d: -f1)
            if [ -n "$container_id" ]; then
                echo -e "${YELLOW}Remove container with volumes? (y/n)${NC}"
                read -r remove_volumes
                if [ "$remove_volumes" = "y" ]; then
                    docker rm -v "$container_id"
                else
                    docker rm "$container_id"
                fi
            fi
            ;;
    esac
    
    read -p "Press Enter to continue..."
}

# Function to remove an individual Docker container
remove_individual_container() {
  echo -e "${BLUE}==============================${NC}"
  echo -e "${GREEN} Remove Individual Docker Container${NC}"
  echo -e "${BLUE}==============================${NC}"

  # List all containers and allow selection with fzf
  container_id=$(docker ps -a --format "{{.ID}}: {{.Names}}" | fzf --header "Select a container to remove")

  # Check if a container was selected
  if [ -n "$container_id" ]; then
    # Extract the container ID from the selection
    container_id=$(echo "$container_id" | cut -d':' -f1)
    docker rm -f "$container_id" && echo -e "${GREEN}Container $container_id removed.${NC}" || echo -e "${RED}Failed to remove container $container_id.${NC}"
  else
    echo -e "${YELLOW}No container selected.${NC}"
  fi

  echo -e "${BLUE}==============================${NC}"
  read -p "Press Enter to return to the main menu..."
}

# Function to remove all Docker containers
remove_all_containers() {
  echo -e "${BLUE}==============================${NC}"
  echo -e "${GREEN} Removing All Docker Containers${NC}"
  echo -e "${BLUE}==============================${NC}"
  docker stop $(docker ps -aq) 2>/dev/null
  docker rm $(docker ps -aq) 2>/dev/null
  echo -e "${GREEN}All Docker containers removed.${NC}"
  echo -e "${BLUE}==============================${NC}"
  read -p "Press Enter to return to the main menu..."
}

# Function to restart Docker
restart_docker() {
  echo -e "${BLUE}==============================${NC}"
  echo -e "${GREEN} Restarting Docker${NC}"
  echo -e "${BLUE}==============================${NC}"
  sudo systemctl restart docker
  echo -e "${GREEN}Docker restarted.${NC}"
  echo -e "${BLUE}==============================${NC}"
  read -p "Press Enter to return to the main menu..."
}

# Function to remove Docker entirely
remove_docker() {
  echo -e "${BLUE}==============================${NC}"
  echo -e "${GREEN} Removing Docker${NC}"
  echo -e "${BLUE}==============================${NC}"
  sudo apt-get purge -y docker-ce docker-ce-cli containerd.io
  sudo rm -rf /var/lib/docker
  echo -e "${GREEN}Docker removed.${NC}"
  echo -e "${BLUE}==============================${NC}"
  read -p "Press Enter to return to the main menu..."
}

# Function to remove PostgreSQL
remove_postgresql() {
  echo -e "${BLUE}==============================${NC}"
  echo -e "${GREEN} Removing PostgreSQL${NC}"
  echo -e "${BLUE}==============================${NC}"
  sudo apt-get purge -y postgresql postgresql-contrib
  sudo rm -rf /var/lib/postgresql
  echo -e "${GREEN}PostgreSQL removed.${NC}"
  echo -e "${BLUE}==============================${NC}"
  read -p "Press Enter to return to the main menu..."
}

# Function to reinstall Docker
reinstall_docker() {
  echo -e "${BLUE}==============================${NC}"
  echo -e "${GREEN} Reinstalling Docker${NC}"
  echo -e "${BLUE}==============================${NC}"
  sudo apt-get update
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io
  echo -e "${GREEN}Docker reinstalled.${NC}"
  echo -e "${BLUE}==============================${NC}"
  read -p "Press Enter to return to the main menu..."
}

# Function to reinstall PostgreSQL
reinstall_postgresql() {
  echo -e "${BLUE}==============================${NC}"
  echo -e "${GREEN} Reinstalling PostgreSQL${NC}"
  echo -e "${BLUE}==============================${NC}"
  sudo apt-get update
  sudo apt-get install -y postgresql postgresql-contrib
  echo -e "${GREEN}PostgreSQL reinstalled.${NC}"
  echo -e "${BLUE}==============================${NC}"
  read -p "Press Enter to return to the main menu..."
}

# Function to remove all and reinstall
remove_all_and_reinstall() {
  echo -e "${BLUE}==============================${NC}"
  echo -e "${GREEN} Removing All Docker Resources and Reinstalling${NC}"
  echo -e "${BLUE}==============================${NC}"
  remove_all_containers
  remove_docker
  remove_postgresql
  reinstall_docker
  reinstall_postgresql
  echo -e "${GREEN}All resources removed and reinstalled.${NC}"
  echo -e "${BLUE}==============================${NC}"
  read -p "Press Enter to return to the main menu..."
}

# Function to spin up a new PostgreSQL database
spin_up_postgresql() {
  echo -e "${BLUE}==============================${NC}"
  echo -e "${GREEN} Spinning Up a New PostgreSQL Database${NC}"
  echo -e "${BLUE}==============================${NC}"

  # Use fzf to fuzzy find the docker-compose.yml file
  compose_path=$(find . -name "*.yml" | fzf --header "Select your docker-compose.yml file (default: ./docker-compose.yml)")

  # If no file is selected, use the default path
  if [ -z "$compose_path" ]; then
    compose_path="./docker-compose.yml"
  fi

  # Backup the existing docker-compose.yml if it exists
  if [ -f "$compose_path" ]; then
    cp "$compose_path" "${compose_path%.yml}_backup.yml"
    echo -e "${YELLOW}Backup of existing docker-compose.yml created: ${compose_path%.yml}_backup.yml${NC}"
    echo "${compose_path%.yml}_backup.yml" >>.gitignore
  fi

  # Prompt for custom credentials
  read -p "Do you want to set custom credentials for PostgreSQL? (Y/N): " custom_creds
  custom_creds=${custom_creds^^} # Convert to uppercase

  if [[ "$custom_creds" == "Y" ]]; then
    read -p "Enter PostgreSQL username (default: POSTGRES): " pg_user
    pg_user=${pg_user:-POSTGRES} # Default to 'POSTGRES' if empty
    read -p "Enter PostgreSQL password (default: POSTGRES): " pg_password
    pg_password=${pg_password:-POSTGRES} # Default to 'POSTGRES' if empty
    read -p "Enter PostgreSQL database name (default: APP): " pg_db
    pg_db=${pg_db:-APP} # Default to 'APP' if empty
  else
    pg_user="username"
    pg_password="password"
    pg_db="database"
  fi

  # Create the Docker Compose file
  cat <<EOF >"$compose_path"
version: "3.8"
services:
  db:
    image: postgres:latest
    environment:
      POSTGRES_USER: $pg_user
      POSTGRES_PASSWORD: $pg_password
      POSTGRES_DB: $pg_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
EOF

  # Show the difference if the file was overwritten
  if [ -f "${compose_path%.yml}_backup.yml" ]; then
    echo -e "${BLUE}Differences between the old and new docker-compose.yml:${NC}"
    diff "${compose_path%.yml}_backup.yml" "$compose_path"
  fi

  # Warning about the obsolete version attribute
  echo -e "${RED}WARNING: The attribute 'version' is obsolete and will be ignored. Please remove it to avoid potential confusion.${NC}"

  # Start the PostgreSQL service
  docker-compose -f "$compose_path" up -d

  # Copy DATABASE_URL to clipboard
  DATABASE_URL="postgres://$pg_user:$pg_password@localhost:5432/$pg_db"
  echo "$DATABASE_URL" | xclip -selection clipboard

  echo -e "${GREEN}PostgreSQL database created and DATABASE_URL copied to clipboard.${NC}"
  echo -e "${YELLOW}Update your docker-compose.yml with the following DATABASE_URL:${NC}"
  echo -e "${GREEN}$DATABASE_URL${NC}"
  echo -e "${YELLOW}Make sure to change the credentials in your docker-compose.yml if script failed to automatically update it.Also don't forget the .env file.${NC}"
  echo -e "${BLUE}==============================${NC}"
  read -p "Press Enter to return to the main menu..."
}

# Add this function for SQLite setup
spin_up_sqlite() {
    clear
    echo -e "${BLUE}=== SQLite Database Setup ===${NC}"
    
    # Get database name
    echo -e "${CYAN}Enter database name (without .db extension):${NC}"
    read -r db_name
    
    # Create docker-compose file for SQLite
    cat > docker-compose.sqlite.yml << EOF
version: '3.8'
services:
  sqlite:
    image: keinos/sqlite3
    volumes:
      - ./data/${db_name}:/data
    environment:
      - SQLITE_DATABASE=${db_name}.db
    ports:
      - "9000:9000"  # Optional port for web interface if added later
    restart: unless-stopped
EOF

    # Create data directory
    mkdir -p ./data/${db_name}

    # Initialize SQLite database
    echo -e "\n${YELLOW}Initializing SQLite database...${NC}"
    docker-compose -f docker-compose.sqlite.yml up -d

    # Wait for container to be ready
    sleep 2

    # Create sample table
    echo -e "\n${CYAN}Would you like to create a sample table? (y/n)${NC}"
    read -r create_sample
    
    if [ "$create_sample" = "y" ]; then
        docker-compose -f docker-compose.sqlite.yml exec sqlite sqlite3 /data/${db_name}.db "
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            INSERT INTO users (name, email) VALUES ('Test User', 'test@example.com');
        "
        echo -e "${GREEN}✓ Sample table 'users' created${NC}"
    fi

    echo -e "\n${GREEN}SQLite database '${db_name}' has been created!${NC}"
    echo -e "\n${CYAN}Connection details:${NC}"
    echo -e "Database file: ./data/${db_name}/${db_name}.db"
    echo -e "Container name: $(docker-compose -f docker-compose.sqlite.yml ps -q sqlite)"
    
    # Add to main menu options
    echo -e "\n${YELLOW}To access the database:${NC}"
    echo "1. docker-compose -f docker-compose.sqlite.yml exec sqlite sqlite3 /data/${db_name}.db"
    echo "2. Use any SQLite client with the database file in ./data/${db_name}/${db_name}.db"

    read -p "Press Enter to continue..."
}

# New function to start Docker Compose
start_docker_compose() {
    clear
    echo -e "${BLUE}=============================${NC}" 0.01
    echo -e "${GREEN}Starting Docker Compose${NC}" 0.03
    echo -e "${BLUE}=============================${NC}" 0.01
    echo

  compose_file=$(find . -name "docker-compose.yml" | fzf --header "Select docker-compose.yml file")

  if [ -z "$compose_file" ]; then
    compose_file="./docker-compose.yml"
  fi

  if [ -f "$compose_file" ]; then
        echo -e "${YELLOW}Starting services defined in $compose_file${NC}" 0.03
    docker-compose -f "$compose_file" up -d

    if [ $? -eq 0 ]; then
            echo -e "${GREEN}Docker Compose services started successfully${NC}" 0.03
    else
            echo -e "${RED}Failed to start Docker Compose services${NC}" 0.03
    fi
  else
        echo -e "${RED}No docker-compose.yml file found${NC}" 0.03
  fi

    echo -e "${YELLOW}Press Enter to return to the main menu...${NC}" 0.03
    read
}

# New function to stop Docker Compose
stop_docker_compose() {
  echo -e "${BLUE}==============================${NC}"
  echo -e "${GREEN} Stopping Docker Compose${NC}"
  echo -e "${BLUE}==============================${NC}"

  # Find docker-compose files
  compose_file=$(find . -name "docker-compose.yml" | fzf --header "Select docker-compose.yml file")

  if [ -z "$compose_file" ]; then
    compose_file="./docker-compose.yml"
  fi

  if [ -f "$compose_file" ]; then
    echo -e "${YELLOW}Stopping services defined in $compose_file${NC}"
    docker-compose -f "$compose_file" down

    if [ $? -eq 0 ]; then
      echo -e "${GREEN}Docker Compose services stopped successfully${NC}"
    else
      echo -e "${RED}Failed to stop Docker Compose services${NC}"
    fi
  else
    echo -e "${RED}No docker-compose.yml file found${NC}"
  fi

  read -p "Press Enter to return to the main menu..."
}

# Add this function
check_system_health() {
    clear
    echo -e "${BLUE}=== Docker System Health Check ===${NC}"
    
    # Check Docker daemon status
    echo -e "\n${YELLOW}Checking Docker daemon...${NC}"
    if systemctl is-active --quiet docker; then
        echo -e "${GREEN}✓ Docker daemon is running${NC}"
    else
        echo -e "${RED}✗ Docker daemon is not running${NC}"
    fi
    
    # Check disk space
    echo -e "\n${YELLOW}Checking disk space usage...${NC}"
    docker system df
    
    # Check resource usage
    echo -e "\n${YELLOW}Checking container resource usage...${NC}"
    docker stats --no-stream
    
    # Check network status
    echo -e "\n${YELLOW}Checking Docker networks...${NC}"
    docker network ls
    
    read -p "Press Enter to return to the main menu..."
}

# Add this function
view_container_logs() {
    clear
    echo -e "${BLUE}=== Container Logs Viewer ===${NC}"
    
    # Select container
    container_id=$(docker ps -a --format "{{.ID}}: {{.Names}}" | fzf --header "Select a container to view logs")
    
    if [ -n "$container_id" ]; then
        container_id=$(echo "$container_id" | cut -d':' -f1)
        
        # Select number of lines
        lines=$(echo -e "50\n100\n200\nall" | fzf --header "Select number of lines to view")
        
        clear
        if [ "$lines" = "all" ]; then
            docker logs "$container_id" | less
        else
            docker logs --tail "$lines" "$container_id" | less
        fi
    fi
}

# Add this function
backup_restore_containers() {
    clear
    echo -e "${BLUE}=== Backup/Restore Containers ===${NC}"
    
    PS3="Select an option: "
    options=("Backup container" "Restore container" "Back to main menu")
    select opt in "${options[@]}"
    do
        case $opt in
            "Backup container")
                container_id=$(docker ps -a --format "{{.ID}}: {{.Names}}" | fzf --header "Select container to backup")
                if [ -n "$container_id" ]; then
                    container_id=$(echo "$container_id" | cut -d':' -f1)
                    backup_name="backup-$(date +%Y%m%d-%H%M%S).tar"
                    docker export "$container_id" > "$backup_name"
                    echo -e "${GREEN}Container backed up to $backup_name${NC}"
                fi
                ;;
            "Restore container")
                backup_file=$(find . -name "backup-*.tar" | fzf --header "Select backup to restore")
                if [ -n "$backup_file" ]; then
                    read -p "Enter new container name: " container_name
                    cat "$backup_file" | docker import - "$container_name"
                    echo -e "${GREEN}Backup restored to container: $container_name${NC}"
                fi
                ;;
            "Back to main menu")
                break
                ;;
            *) echo "Invalid option";;
        esac
    done
}

# Function to generate docker-compose templates
generate_compose_template() {
    clear
    echo -e "${BLUE}=== Docker Compose Template Generator ===${NC}"
    
    # Create templates directory if it doesn't exist
    mkdir -p ./templates
    
    # Get template name
    echo -e "${CYAN}Enter template name:${NC}"
    read -r template_name
    
    # Select services to include
    echo -e "\n${CYAN}Select services to include:${NC}"
    services=$(echo -e "PostgreSQL\nMySQL\nMongoDB\nRedis\nNginx\nNode.js\nPython\nPHP\nCustom" | \
        fzf --multi --header "Use TAB to select multiple services")
    
    # Create docker-compose file
    compose_file="./templates/docker-compose.${template_name}.yml"
    
    # Start writing the compose file
    cat > "$compose_file" << EOF
version: '3.8'

services:
EOF
    
    # Add selected services
    echo "$services" | while read -r service; do
        case "$service" in
            "PostgreSQL")
                cat >> "$compose_file" << EOF
  postgres:
    image: postgres:latest
    environment:
      POSTGRES_USER: \${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:-changeme}
      POSTGRES_DB: \${POSTGRES_DB:-mydatabase}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

EOF
                ;;
            "MySQL")
                cat >> "$compose_file" << EOF
  mysql:
    image: mysql:latest
    environment:
      MYSQL_ROOT_PASSWORD: \${MYSQL_ROOT_PASSWORD:-changeme}
      MYSQL_DATABASE: \${MYSQL_DATABASE:-mydatabase}
      MYSQL_USER: \${MYSQL_USER:-user}
      MYSQL_PASSWORD: \${MYSQL_PASSWORD:-changeme}
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"
    restart: unless-stopped

EOF
                ;;
            "MongoDB")
                cat >> "$compose_file" << EOF
  mongodb:
    image: mongo:latest
    environment:
      MONGO_INITDB_ROOT_USERNAME: \${MONGO_USERNAME:-root}
      MONGO_INITDB_ROOT_PASSWORD: \${MONGO_PASSWORD:-changeme}
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"
    restart: unless-stopped

EOF
                ;;
            "Redis")
                cat >> "$compose_file" << EOF
  redis:
    image: redis:alpine
    command: redis-server --requirepass \${REDIS_PASSWORD:-changeme}
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

EOF
                ;;
            "Nginx")
                cat >> "$compose_file" << EOF
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./nginx/ssl:/etc/nginx/ssl
      - ./www:/var/www/html
    restart: unless-stopped

EOF
                ;;
            "Node.js")
                cat >> "$compose_file" << EOF
  nodejs:
    image: node:latest
    working_dir: /app
    volumes:
      - ./app:/app
    ports:
      - "3000:3000"
    command: npm start
    environment:
      NODE_ENV: development
    restart: unless-stopped

EOF
                ;;
            "Python")
                cat >> "$compose_file" << EOF
  python:
    build:
      context: .
      dockerfile: Dockerfile.python
    volumes:
      - ./app:/app
    ports:
      - "5000:5000"
    environment:
      FLASK_ENV: development
    restart: unless-stopped

EOF
                ;;
            "PHP")
                cat >> "$compose_file" << EOF
  php:
    image: php:8-fpm
    volumes:
      - ./app:/var/www/html
    environment:
      PHP_INI_DIR: /usr/local/etc/php
    restart: unless-stopped

EOF
                ;;
            "Custom")
                echo -e "${CYAN}Enter custom service name:${NC}"
                read -r custom_name
                echo -e "${CYAN}Enter Docker image:${NC}"
                read -r custom_image
                
                cat >> "$compose_file" << EOF
  ${custom_name}:
    image: ${custom_image}
    # Add custom configuration here
    restart: unless-stopped

EOF
                ;;
        esac
    done
    
    # Add volumes section if needed
    if echo "$services" | grep -qE "PostgreSQL|MySQL|MongoDB|Redis"; then
        cat >> "$compose_file" << EOF

volumes:
EOF
        if echo "$services" | grep -q "PostgreSQL"; then
            echo "  postgres_data:" >> "$compose_file"
        fi
        if echo "$services" | grep -q "MySQL"; then
            echo "  mysql_data:" >> "$compose_file"
        fi
        if echo "$services" | grep -q "MongoDB"; then
            echo "  mongodb_data:" >> "$compose_file"
        fi
        if echo "$services" | grep -q "Redis"; then
            echo "  redis_data:" >> "$compose_file"
        fi
    fi
    
    # Create .env template if needed
    if echo "$services" | grep -qE "PostgreSQL|MySQL|MongoDB|Redis"; then
        env_file="./templates/.env.${template_name}"
        cat > "$env_file" << EOF
# Database Credentials
POSTGRES_USER=postgres
POSTGRES_PASSWORD=changeme
POSTGRES_DB=mydatabase

MYSQL_ROOT_PASSWORD=changeme
MYSQL_DATABASE=mydatabase
MYSQL_USER=user
MYSQL_PASSWORD=changeme

MONGO_USERNAME=root
MONGO_PASSWORD=changeme

REDIS_PASSWORD=changeme
EOF
        echo -e "${GREEN}✓ Environment template created at $env_file${NC}"
    fi
    
    echo -e "${GREEN}✓ Docker Compose template created at $compose_file${NC}"
    
    # Ask if user wants to view the generated files
    echo -e "\n${CYAN}View generated files? (y/n)${NC}"
    read -r view_files
    
    if [ "$view_files" = "y" ]; then
        echo -e "\n${YELLOW}Docker Compose template:${NC}"
        cat "$compose_file"
        if [ -f "$env_file" ]; then
            echo -e "\n${YELLOW}Environment template:${NC}"
            cat "$env_file"
        fi
    fi
    
    read -p "Press Enter to continue..."
}

# Add this function
monitor_containers() {
    clear
    echo -e "${BLUE}=== Container Resource Monitor ===${NC}"
    
    # Monitor containers in real-time
    echo -e "${YELLOW}Press Ctrl+C to stop monitoring${NC}\n"
    
    # Use watch to update stats every 2 seconds
    watch -n 2 'docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"'
}

# Add this function to view database tables and columns
view_database_structure() {
    clear
    echo -e "${BLUE}=== Database Structure Viewer ===${NC}"
    
    # Find PostgreSQL containers
    pg_containers=$(docker ps --format "{{.Names}}" | grep -i "postgres")
    
    if [ -z "$pg_containers" ]; then
        echo -e "${RED}No PostgreSQL containers found running${NC}"
        read -p "Press Enter to return to the main menu..."
        return
    fi
    
    # Select container
    container=$(echo "$pg_containers" | fzf --header "Select PostgreSQL container")
    
    if [ -n "$container" ]; then
        # Get database list
        databases=$(docker exec "$container" psql -U postgres -l -t | cut -d'|' -f1 | sed 's/ //g' | grep -v '^$')
        
        # Select database
        database=$(echo "$databases" | fzf --header "Select database")
        
        if [ -n "$database" ]; then
            while true; do
                clear
                echo -e "${BLUE}=== Database: $database ===${NC}"
                
                # Show options
                action=$(echo -e "View Tables\nView Table Structure\nView Table Data\nCustom Query\nBack" | \
                    fzf --header "Select action" \
                    --preview 'case {} in
                        "View Tables") echo "Show all tables in the database";;
                        "View Table Structure") echo "Show structure of a specific table";;
                        "View Table Data") echo "Show data in a specific table";;
                        "Custom Query") echo "Execute a custom SQL query";;
                        *) echo "Go back to main menu";;
                    esac')
                
                case "$action" in
                    "View Tables")
                        clear
                        echo -e "${CYAN}Tables in $database:${NC}\n"
                        docker exec "$container" psql -U postgres -d "$database" -c "\dt" | less
                        ;;
                    
                    "View Table Structure")
                        # Get table list
                        tables=$(docker exec "$container" psql -U postgres -d "$database" -t -c "\dt" | cut -d'|' -f2 | sed 's/ //g' | grep -v '^$')
                        
                        # Select table
                        table=$(echo "$tables" | fzf --header "Select table")
                        
                        if [ -n "$table" ]; then
                            clear
                            echo -e "${CYAN}Structure of table $table:${NC}\n"
                            docker exec "$container" psql -U postgres -d "$database" -c "\d $table" | less
                        fi
                        ;;
                    
                    "View Table Data")
                        # Get table list
                        tables=$(docker exec "$container" psql -U postgres -d "$database" -t -c "\dt" | cut -d'|' -f2 | sed 's/ //g' | grep -v '^$')
                        
                        # Select table
                        table=$(echo "$tables" | fzf --header "Select table")
                        
                        if [ -n "$table" ]; then
                            clear
                            echo -e "${CYAN}Data in table $table:${NC}\n"
                            docker exec "$container" psql -U postgres -d "$database" -c "SELECT * FROM $table LIMIT 100" | less
                        fi
                        ;;
                    
                    "Custom Query")
                        clear
                        echo -e "${CYAN}Enter your SQL query:${NC}"
                        echo -e "${YELLOW}(Press Ctrl+D when done)${NC}\n"
                        query=$(cat)
                        
                        if [ -n "$query" ]; then
                            clear
                            echo -e "${CYAN}Query results:${NC}\n"
                            docker exec "$container" psql -U postgres -d "$database" -c "$query" | less
                        fi
                        ;;
                    
                    "Back"|*)
                        break
                        ;;
                esac
                
                echo
                read -p "Press Enter to continue..."
            done
        fi
    fi
}

# Add this function
manage_images() {
    clear
    echo -e "${BLUE}=== Docker Image Manager ===${NC}"
    
    action=$(echo -e "List Images\nPull Image\nRemove Image\nPrune Unused Images\nBuild Image\nBack" | \
        fzf --header "Select action" \
        --preview 'case {} in
            "List Images") echo "Show all local Docker images";;
            "Pull Image") echo "Pull an image from Docker Hub";;
            "Remove Image") echo "Remove a local Docker image";;
            "Prune Unused Images") echo "Remove all unused images";;
            "Build Image") echo "Build image from Dockerfile";;
            *) echo "Return to main menu";;
        esac')
    
    case "$action" in
        "List Images")
            docker images | less
            ;;
        "Pull Image")
            echo -e "${CYAN}Enter image name (e.g., nginx:latest):${NC}"
            read -r image_name
            docker pull "$image_name"
            ;;
        "Remove Image")
            image=$(docker images --format "{{.Repository}}:{{.Tag}}" | fzf --header "Select image to remove")
            if [ -n "$image" ]; then
                docker rmi "$image"
            fi
            ;;
        "Prune Unused Images")
            echo -e "${YELLOW}This will remove all unused images. Continue? (y/n)${NC}"
            read -r confirm
            if [ "$confirm" = "y" ]; then
                docker image prune -a
            fi
            ;;
        "Build Image")
            dockerfile=$(find . -name "Dockerfile" | fzf --header "Select Dockerfile")
            if [ -n "$dockerfile" ]; then
                echo -e "${CYAN}Enter tag for new image:${NC}"
                read -r tag
                docker build -t "$tag" -f "$dockerfile" .
            fi
            ;;
    esac
    
    read -p "Press Enter to continue..."
}

# Add this function
manage_networks() {
    clear
    echo -e "${BLUE}=== Docker Network Manager ===${NC}"
    
    action=$(echo -e "List Networks\nCreate Network\nRemove Network\nInspect Network\nConnect Container\nDisconnect Container\nBack" | \
        fzf --header "Select action")
    
    case "$action" in
        "List Networks")
            docker network ls | less
            ;;
        "Create Network")
            echo -e "${CYAN}Enter network name:${NC}"
            read -r network_name
            echo -e "${CYAN}Select driver (bridge/overlay/host/none):${NC}"
            read -r driver
            docker network create --driver "$driver" "$network_name"
            ;;
        "Remove Network")
            network=$(docker network ls --format "{{.Name}}" | fzf --header "Select network to remove")
            if [ -n "$network" ]; then
                docker network rm "$network"
            fi
            ;;
        "Inspect Network")
            network=$(docker network ls --format "{{.Name}}" | fzf --header "Select network to inspect")
            if [ -n "$network" ]; then
                docker network inspect "$network" | less
            fi
            ;;
        "Connect Container")
            network=$(docker network ls --format "{{.Name}}" | fzf --header "Select network")
            if [ -n "$network" ]; then
                container=$(docker ps --format "{{.Names}}" | fzf --header "Select container")
                if [ -n "$container" ]; then
                    docker network connect "$network" "$container"
                fi
            fi
            ;;
        "Disconnect Container")
            network=$(docker network ls --format "{{.Name}}" | fzf --header "Select network")
            if [ -n "$network" ]; then
                container=$(docker ps --format "{{.Names}}" | fzf --header "Select container")
                if [ -n "$container" ]; then
                    docker network disconnect "$network" "$container"
                fi
            fi
            ;;
    esac
    
    read -p "Press Enter to continue..."
}

# Add this function
manage_volumes() {
    clear
    echo -e "${BLUE}=== Docker Volume Manager ===${NC}"
    
    action=$(echo -e "List Volumes\nCreate Volume\nRemove Volume\nInspect Volume\nPrune Unused Volumes\nBackup Volume\nRestore Volume\nBack" | \
        fzf --header "Select action")
    
    case "$action" in
        "List Volumes")
            docker volume ls | less
            ;;
        "Create Volume")
            echo -e "${CYAN}Enter volume name:${NC}"
            read -r volume_name
            docker volume create "$volume_name"
            ;;
        "Remove Volume")
            volume=$(docker volume ls --format "{{.Name}}" | fzf --header "Select volume to remove")
            if [ -n "$volume" ]; then
                docker volume rm "$volume"
            fi
            ;;
        "Inspect Volume")
            volume=$(docker volume ls --format "{{.Name}}" | fzf --header "Select volume to inspect")
            if [ -n "$volume" ]; then
                docker volume inspect "$volume" | less
            fi
            ;;
        "Prune Unused Volumes")
            echo -e "${YELLOW}This will remove all unused volumes. Continue? (y/n)${NC}"
            read -r confirm
            if [ "$confirm" = "y" ]; then
                docker volume prune
            fi
            ;;
        "Backup Volume")
            volume=$(docker volume ls --format "{{.Name}}" | fzf --header "Select volume to backup")
            if [ -n "$volume" ]; then
                backup_file="volume_backup_$(date +%Y%m%d_%H%M%S).tar.gz"
                docker run --rm -v "$volume":/source -v "$(pwd)":/backup alpine tar czf /backup/"$backup_file" -C /source .
                echo -e "${GREEN}Volume backed up to $backup_file${NC}"
            fi
            ;;
        "Restore Volume")
            backup_file=$(find . -name "volume_backup_*.tar.gz" | fzf --header "Select backup to restore")
            if [ -n "$backup_file" ]; then
                echo -e "${CYAN}Enter new volume name:${NC}"
                read -r volume_name
                docker volume create "$volume_name"
                docker run --rm -v "$volume_name":/target -v "$(pwd)":/backup alpine tar xzf /backup/"$(basename "$backup_file")" -C /target
                echo -e "${GREEN}Backup restored to volume: $volume_name${NC}"
            fi
            ;;
    esac
    
    read -p "Press Enter to continue..."
}

# Add this function
show_info_menu() {
    clear
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC}             ${C_R}D${C_O}o${C_Y}c${C_G}k${C_B}e${C_I}r${C_V} Manager${NC}                              ${BLUE}║${NC}"
    echo -e "${BLUE}╠════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${BLUE}║${NC} ${CYAN}Author${NC}: Remco Stoeten                                      ${BLUE}║${NC}"
    echo -e "${BLUE}║${NC} ${CYAN}GitHub${NC}: github.com/remcostoeten                           ${BLUE}║${NC}"
    echo -e "${BLUE}║${NC} ${CYAN}Version${NC}: 1.0.0                                            ${BLUE}║${NC}"
    echo -e "${BLUE}║${NC} ${CYAN}System${NC}: $(uname -s) ($(uname -r))                          ${BLUE}║${NC}"
    echo -e "${BLUE}║${NC} ${CYAN}Optimized for${NC}: Ubuntu/PopOS Linux                          ${BLUE}║${NC}"
    echo -e "${BLUE}╠════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${BLUE}║${NC} ${GREEN}Description${NC}:                                              ${BLUE}║${NC}"
    echo -e "${BLUE}║${NC} A comprehensive Docker management tool with advanced features  ${BLUE}║${NC}"
    echo -e "${BLUE}║${NC} for container, database, network, and volume management.      ${BLUE}║${NC}"
    echo -e "${BLUE}╠════════════════════════════════════════════════════════════╣${NC}"
    
    # Use fzf to show detailed feature information
    feature=$(echo -e "🐳 Core Features\n📦 Container Management\n🗄️ Database Tools\n🌐 Network Tools\n💾 Volume Management\n⚙️ System Tools\n📋 Templates\n🔧 Utilities\n❌ Exit" | \
        fzf --header "Select a category to learn more (? for help)" \
        --bind "?:preview:echo -e '${CYAN}Keyboard Shortcuts:${NC}\n\n↑/↓ or j/k : Navigate\nEnter      : Select\n/          : Search\nESC/Ctrl+C : Exit/Back\n?          : Toggle help'" \
        --preview 'case {} in
            "🐳 Core Features") echo -e "\033[36mMain features of Docker Manager:\033[0m\n• Interactive menu system\n• Color-coded interface\n• Easy navigation with fzf\n• Comprehensive Docker management";;
            "📦 Container Management") echo -e "\033[36mContainer operations:\033[0m\n• Start/stop containers\n• View and monitor containers\n• Container logs\n• Resource usage tracking";;
            "🗄️ Database Tools") echo -e "\033[36mDatabase management:\033[0m\n• PostgreSQL integration\n• Table/column viewer\n• Query executor\n• Database backups";;
            "🌐 Network Tools") echo -e "\033[36mNetwork operations:\033[0m\n• Network creation/removal\n• Container connectivity\n• Network inspection\n• Port management";;
            "💾 Volume Management") echo -e "\033[36mVolume operations:\033[0m\n• Volume creation/removal\n• Backup and restore\n• Volume inspection\n• Data persistence";;
            "⚙️ System Tools") echo -e "\033[36mSystem utilities:\033[0m\n• Health monitoring\n• Resource tracking\n• System maintenance\n• Performance optimization";;
            "📋 Templates") echo -e "\033[36mTemplate management:\033[0m\n• Pre-built compositions\n• Custom templates\n• Configuration management\n• Easy deployment";;
            "🔧 Utilities") echo -e "\033[36mAdditional tools:\033[0m\n• Backup utilities\n• Log management\n• Error handling\n• System cleanup";;
            *) echo "Select a category for more information";;
        esac' \
        --border rounded \
        --marker="➜" \
        --pointer="▶" \
        --info=inline \
        --no-mouse)

    case "$feature" in
        "🐳 Core Features")
            clear
            cat << EOF
${GREEN}=== Core Features ===${NC}

${MAGENTA}Interactive Interface${NC}
• Fuzzy finding with fzf
• Color-coded menus and output
• Easy navigation
• Context-sensitive help

${CYAN}Docker Management${NC}
• Complete container lifecycle management
• Database operations
• Network configuration
• Volume management

${YELLOW}Key Benefits${NC}
• Streamlined Docker operations
• Reduced command complexity
• Improved productivity
• Error prevention

Press any key to return...
EOF
            read -n 1
            show_info_menu
            ;;

        "📦 Container Management")
            clear
            cat << EOF
${GREEN}=== Container Management ===${NC}

${CYAN}Container Operations${NC}
• Start/stop containers
• Remove containers
• View container logs
• Monitor resources

${MAGENTA}Features${NC}
• Interactive container selection
• Batch operations
• Health monitoring
• Resource tracking

${YELLOW}Usage Tips${NC}
• Use fuzzy search to find containers
• Monitor resource usage
• Regular maintenance
• Proper shutdown procedures

Press any key to return...
EOF
            read -n 1
            show_info_menu
            ;;

        "🗄️ Database Tools")
            clear
            cat << EOF
${GREEN}=== Database Management ===${NC}

${CYAN}Database Operations${NC}
• View database structure
• Execute SQL queries
• Manage tables
• Data backup/restore

${MAGENTA}PostgreSQL Features${NC}
• Table viewer
• Column inspector
• Query executor
• Database backup

${YELLOW}Best Practices${NC}
• Regular backups
• Index optimization
• Query monitoring
• Performance tuning

Press any key to return...
EOF
            read -n 1
            show_info_menu
            ;;

        "❌ Exit")
            return
            ;;

        *)
            show_info_menu
            ;;
    esac
}

# Add this function for seed management
manage_seeds() {
    clear
    echo -e "${BLUE}=== Database Seed Manager ===${NC}"
    
    action=$(echo -e "Create New Seed\nView Seeds ($(find ./seeds -name "*.sql" 2>/dev/null | wc -l))\nRun Seed\nDry Run Seed\nBack" | \
        fzf --header "Select action" \
        --preview 'case {} in
            "Create New Seed") echo "Create a new seed file with sample data";;
            "View Seeds"*) echo "View and manage existing seed files";;
            "Run Seed") echo "Execute a seed file on the database";;
            "Dry Run Seed") echo "Preview seed execution without applying changes";;
            *) echo "Return to main menu";;
        esac')
    
    case "$action" in
        "Create New Seed")
            create_seed
            ;;
        "View Seeds"*)
            view_seeds
            ;;
        "Run Seed")
            run_seed "execute"
            ;;
        "Dry Run Seed")
            run_seed "dry-run"
            ;;
    esac
}

# Function to create a new seed
create_seed() {
    clear
    echo -e "${BLUE}=== Create New Seed ===${NC}"
    
    # Create seeds directory if it doesn't exist
    mkdir -p ./seeds
    
    # Get seed name
    echo -e "${CYAN}Enter seed name (e.g., users_table):${NC}"
    read -r seed_name
    
    # Get table name
    echo -e "${CYAN}Enter table name:${NC}"
    read -r table_name
    
    # Get number of rows
    echo -e "${CYAN}Enter number of rows to generate:${NC}"
    read -r row_count
    
    # Select seed type
    seed_type=$(echo -e "Manual Entry\nFaker Data\nMixed (Manual + Faker)" | \
        fzf --header "Select seed type")
    
    # Create seed file
    timestamp=$(date +%Y%m%d%H%M%S)
    seed_file="./seeds/${timestamp}_${seed_name}.sql"
    
    case "$seed_type" in
        "Manual Entry")
            create_manual_seed "$seed_file" "$table_name"
            ;;
        "Faker Data")
            create_faker_seed "$seed_file" "$table_name" "$row_count"
            ;;
        "Mixed (Manual + Faker)")
            create_mixed_seed "$seed_file" "$table_name" "$row_count"
            ;;
    esac
}

# Function to create manual seed
create_manual_seed() {
    local seed_file=$1
    local table_name=$2
    
    echo -e "${CYAN}Enter column names (space-separated):${NC}"
    read -r columns
    
    # Start building the SQL
    echo "-- Seed file for $table_name" > "$seed_file"
    echo "-- Created at $(date)" >> "$seed_file"
    echo "" >> "$seed_file"
    
    # Add timestamps option
    echo -e "${CYAN}Add created_at/updated_at timestamps? (y/n)${NC}"
    read -r add_timestamps
    
    if [ "$add_timestamps" = "y" ]; then
        columns="$columns created_at updated_at"
    fi
    
    # Get values for each row
    echo -e "${CYAN}Enter values for each row (press Ctrl+D when done):${NC}"
    while IFS= read -r values; do
        if [ "$add_timestamps" = "y" ]; then
            values="$values NOW() NOW()"
        fi
        echo "INSERT INTO $table_name ($columns) VALUES ($values);" >> "$seed_file"
    done
    
    echo -e "${GREEN}✓ Seed file created at $seed_file${NC}"
}

# Function to create faker seed
create_faker_seed() {
    local seed_file=$1
    local table_name=$2
    local row_count=$3
    
    # Select faker types for each column
    echo -e "${CYAN}Configure faker types for columns:${NC}"
    
    declare -A faker_types
    while true; do
        echo -e "${CYAN}Enter column name (or 'done' to finish):${NC}"
        read -r column
        
        [ "$column" = "done" ] && break
        
        faker_type=$(echo -e "name\nemail\nphone\naddress\ncompany\ntext\ndate\nnumber\nboolean" | \
            fzf --header "Select faker type for $column")
        
        faker_types["$column"]=$faker_type
    done
    
    # Generate SQL with faker data
    echo "-- Seed file for $table_name using faker data" > "$seed_file"
    echo "-- Created at $(date)" >> "$seed_file"
    echo "-- Row count: $row_count" >> "$seed_file"
    echo "" >> "$seed_file"
    
    # Add timestamps if needed
    echo -e "${CYAN}Add created_at/updated_at timestamps? (y/n)${NC}"
    read -r add_timestamps
    
    # Generate INSERT statements
    for ((i=1; i<=row_count; i++)); do
        columns=""
        values=""
        
        for column in "${!faker_types[@]}"; do
            columns="$columns$column, "
            case "${faker_types[$column]}" in
                "name") values="$values'{{name}}', ";;
                "email") values="$values'{{email}}', ";;
                "phone") values="$values'{{phone}}', ";;
                "address") values="$values'{{address}}', ";;
                "company") values="$values'{{company}}', ";;
                "text") values="$values'{{lorem}}', ";;
                "date") values="$values'{{date}}', ";;
                "number") values="$values{{number}}, ";;
                "boolean") values="$values{{boolean}}, ";;
            esac
        done
        
        if [ "$add_timestamps" = "y" ]; then
            columns="${columns}created_at, updated_at"
            values="${values}NOW(), NOW()"
        else
            columns="${columns%,*}"
            values="${values%,*}"
        fi
        
        echo "INSERT INTO $table_name ($columns) VALUES ($values);" >> "$seed_file"
    done
    
    echo -e "${GREEN}✓ Faker seed file created at $seed_file${NC}"
}

# Function to view seeds
view_seeds() {
    clear
    echo -e "${BLUE}=== View Seeds ===${NC}"
    
    seed_file=$(find ./seeds -name "*.sql" | \
        fzf --header "Select seed file to view" \
            --preview 'cat {}')
    
    if [ -n "$seed_file" ]; then
        echo -e "\n${CYAN}Seed file contents:${NC}"
        cat "$seed_file"
        
        echo -e "\n${YELLOW}Options:${NC}"
        action=$(echo -e "Run Seed\nDry Run\nEdit\nDelete\nBack" | fzf --header "Select action")
        
        case "$action" in
            "Run Seed")
                run_seed "execute" "$seed_file"
                ;;
            "Dry Run")
                run_seed "dry-run" "$seed_file"
                ;;
            "Edit")
                ${EDITOR:-vim} "$seed_file"
                ;;
            "Delete")
                rm -i "$seed_file"
                ;;
        esac
    fi
}

# Function to run seed
run_seed() {
    local mode=$1
    local specific_file=$2
    
    clear
    echo -e "${BLUE}=== Run Seed ===${NC}"
    
    # Select seed file if not specified
    if [ -z "$specific_file" ]; then
        specific_file=$(find ./seeds -name "*.sql" | \
            fzf --header "Select seed file to run")
    fi
    
    if [ -n "$specific_file" ]; then
        # Select database
        echo -e "${CYAN}Select database to run seed on:${NC}"
        container_id=$(docker ps --format "{{.ID}}: {{.Names}}" | grep -i "postgres" | \
            fzf --header "Select PostgreSQL container")
        
        if [ -n "$container_id" ]; then
            container_id=$(echo "$container_id" | cut -d':' -f1)
            
            if [ "$mode" = "dry-run" ]; then
                echo -e "\n${YELLOW}Dry run - no changes will be made:${NC}"
                echo -e "${CYAN}SQL to be executed:${NC}"
                cat "$specific_file"
            else
                echo -e "\n${YELLOW}Executing seed...${NC}"
                docker cp "$specific_file" "$container_id:/tmp/seed.sql"
                docker exec "$container_id" psql -U postgres -f /tmp/seed.sql
                
                if [ $? -eq 0 ]; then
                    echo -e "${GREEN}✓ Seed executed successfully${NC}"
                else
                    echo -e "${RED}✗ Error executing seed${NC}"
                fi
            fi
        fi
    fi
    
    read -p "Press Enter to continue..."
}

# Remove the initial system check call and just start with the intro
show_intro
main_menu
