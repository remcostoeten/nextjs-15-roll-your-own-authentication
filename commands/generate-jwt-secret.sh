#!/bin/bash

# Title: JWT Secret Generator and .env Updater
# Description: Generates a secure 32-byte secret, checks for JWT_SECRET in .env/.env.local,
#              prompts for overwrite, updates the file, and provides feedback.
# Compatibility: Linux (requires openssl, awk, grep, sed, tput, and optionally xclip/wl-copy)
#                macOS (requires openssl, awk, grep, sed, tput, and pbcopy)

# --- Configuration ---
ENV_VAR_NAME="JWT_SECRET"
ENV_FILE_PRIMARY=".env.local" # Check this file first
ENV_FILE_SECONDARY=".env"     # Fallback to this file

# --- Colors (using tput for wider compatibility) ---
COL_RESET=$(tput sgr0)
COL_GREEN=$(tput setaf 2)
COL_YELLOW=$(tput setaf 3)
COL_RED=$(tput setaf 1)
COL_BLUE=$(tput setaf 4)
TXT_BOLD=$(tput bold)

# --- Helper Functions ---

# Prints a message with a specific color
# Usage: print_msg COLOR "Message"
print_msg() {
    local color="$1"
    local message="$2"
    echo -e "${color}${message}${COL_RESET}"
}

# Detects the appropriate command to copy text to the clipboard
detect_copy_command() {
    if command -v pbcopy &> /dev/null; then
        echo "pbcopy" # macOS
    elif command -v wl-copy &> /dev/null; then
        echo "wl-copy" # Wayland Linux
    elif command -v xclip &> /dev/null; then
        echo "xclip -selection clipboard" # X11 Linux
    else
        echo "" # No known command found
    fi
}

# Copies text to the clipboard using the detected command
# Usage: copy_to_clipboard "text"
copy_to_clipboard() {
    local text_to_copy="$1"
    local copy_cmd="$COPY_COMMAND"

    if [ -n "$copy_cmd" ]; then
        echo -n "$text_to_copy" | $copy_cmd
        print_msg "$COL_GREEN" "📋 Secret copied to clipboard."
    else
        print_msg "$COL_YELLOW" "⚠️ Could not detect a clipboard command (pbcopy, wl-copy, xclip). Please copy the secret manually."
    fi
}

# --- Main Script Logic ---

print_msg "$COL_BLUE" "${TXT_BOLD}🔑 JWT Secret Generation Tool${COL_RESET}"

# 1. Determine target .env file
ENV_FILE=""
if [ -f "$ENV_FILE_PRIMARY" ]; then
    ENV_FILE="$ENV_FILE_PRIMARY"
    print_msg "$COL_GREEN" "ℹ️ Using environment file: $ENV_FILE_PRIMARY"
elif [ -f "$ENV_FILE_SECONDARY" ]; then
    ENV_FILE="$ENV_FILE_SECONDARY"
    print_msg "$COL_GREEN" "ℹ️ Using environment file: $ENV_FILE_SECONDARY"
else
    ENV_FILE="$ENV_FILE_SECONDARY" # Default to .env if none exist
    print_msg "$COL_YELLOW" "⚠️ No '$ENV_FILE_PRIMARY' or '$ENV_FILE_SECONDARY' found. Will create '$ENV_FILE'."
    touch "$ENV_FILE" # Create the file if it doesn't exist
fi

# 2. Detect clipboard command
COPY_COMMAND=$(detect_copy_command)

# 3. Check for existing secret
EXISTING_SECRET_LINE=$(grep "^${ENV_VAR_NAME}=" "$ENV_FILE")
SECRET_EXISTS=false
if [ -n "$EXISTING_SECRET_LINE" ]; then
    SECRET_EXISTS=true
fi

# 4. Generate a new secret (do this regardless, so we can print it if user says 'n')
print_msg "$COL_BLUE" "⏳ Generating new secure secret..."
NEW_SECRET=$(openssl rand -base64 32)
if [ $? -ne 0 ] || [ -z "$NEW_SECRET" ]; then
    print_msg "$COL_RED" "❌ Error generating secret using OpenSSL. Please ensure OpenSSL is installed and working."
    exit 1
fi
# Basic check if secret generation looks okay (base64 32 bytes is 44 chars)
if [ ${#NEW_SECRET} -lt 40 ]; then
     print_msg "$COL_RED" "❌ Generated secret seems too short. OpenSSL might have failed silently."
     exit 1
fi


# 5. Handle existing secret prompt
OVERWRITE=true # Default to overwrite if secret doesn't exist
if [ "$SECRET_EXISTS" = true ]; then
    print_msg "$COL_YELLOW" "⚠️ Found existing ${ENV_VAR_NAME} in '$ENV_FILE'."
    # Show existing line (optional, commented out for brevity)
    # print_msg "$COL_YELLOW" "   Current value: $EXISTING_SECRET_LINE"
    read -p "${COL_YELLOW}${TXT_BOLD}❓ Do you want to overwrite it with the new secret? (y/N): ${COL_RESET}" confirm
    # Convert to lowercase
    confirm_lower=$(echo "$confirm" | tr '[:upper:]' '[:lower:]')

    if [[ "$confirm_lower" != "y" && "$confirm_lower" != "yes" ]]; then
        OVERWRITE=false
    fi
fi

# 6. Perform action based on user choice
if [ "$OVERWRITE" = true ]; then
    # Update or append the secret in the .env file using awk for robustness
    print_msg "$COL_BLUE" "✍️ Updating '$ENV_FILE'..."
    awk -v var_name="$ENV_VAR_NAME" -v new_value="$NEW_SECRET" '
    BEGIN { found=0 }
    $0 ~ "^" var_name "=" {
        print var_name "=" new_value;
        found=1;
        next
    }
    { print }
    END {
        if (!found) {
            print var_name "=" new_value;
        }
    }
    ' "$ENV_FILE" > "${ENV_FILE}.tmp" && mv "${ENV_FILE}.tmp" "$ENV_FILE"

    if [ $? -eq 0 ]; then
        print_msg "$COL_GREEN" "✅ Successfully updated ${ENV_VAR_NAME} in '$ENV_FILE'."
    else
        print_msg "$COL_RED" "❌ Error updating '$ENV_FILE'. Check permissions or file system issues."
        # Clean up temp file if move failed
        [ -f "${ENV_FILE}.tmp" ] && rm "${ENV_FILE}.tmp"
        exit 1
    fi
else
    # User chose not to overwrite
    print_msg "$COL_YELLOW" "\n🙅 No changes made to '$ENV_FILE'."
    print_msg "$COL_BLUE" "✨ Here is the ${TXT_BOLD}newly generated${COL_RESET}${COL_BLUE} secret (not saved):"
    echo "${TXT_BOLD}${NEW_SECRET}${COL_RESET}" # Print the new secret without color codes for easy copying
    copy_to_clipboard "$NEW_SECRET"
    exit 0
fi

exit 0
