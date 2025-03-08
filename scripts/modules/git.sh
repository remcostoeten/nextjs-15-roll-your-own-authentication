#!/bin/bash

# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"

# Source common functions
source "$PARENT_DIR/common.sh"

# Configuration
DEFAULT_TARGET_BRANCH="master"
CONFIG_FILE="$PARENT_DIR/.git-config"

# Load configuration
if [ -f "$CONFIG_FILE" ]; then
  source "$CONFIG_FILE"
else
  # Create default configuration
  echo "TARGET_BRANCH=\"$DEFAULT_TARGET_BRANCH\"" > "$CONFIG_FILE"
  TARGET_BRANCH="$DEFAULT_TARGET_BRANCH"
fi

#################################################
# Helper Functions
#################################################

# Print git menu header
print_git_header() {
  echo -e "\n${BG_BLUE}${BOLD}$(printf '%*s' 60 '')${NC}"
  echo -e "${BG_BLUE}${BOLD}$(printf '%*s' 25 '')Git Operations$(printf '%*s' 24 '')${NC}"
  echo -e "${BG_BLUE}${BOLD}$(printf '%*s' 60 '')${NC}\n"
}

# Print a divider
print_divider() {
  echo -e "${BLUE}$(printf '%.0s─' {1..60})${NC}"
}

# Confirm action
confirm_action() {
  local message="$1"
  read -p "$(echo -e ${YELLOW}${BOLD}"$message (y/N): "${NC})" confirm
  [[ "$confirm" =~ ^[Yy]$ ]]
}

# Select a branch from a list
select_branch() {
  local branches=()
  local i=1
  local current_branch=$(git branch --show-current)
  
  print_message "$BLUE" "$INFO" "Available branches:"
  
  # List all branches
  while read -r branch; do
    # Remove leading spaces and asterisks
    branch=$(echo "$branch" | sed 's/^[ *]*//')
    
    if [ "$branch" = "$current_branch" ]; then
      echo -e "  ${BRIGHT_GREEN}${BOLD}[$i] $branch (current)${NC}"
    else
      echo -e "  ${CYAN}[$i] $branch${NC}"
    fi
    
    branches+=("$branch")
    i=$((i+1))
  done < <(git branch)
  
  # Add option to return
  echo -e "  ${YELLOW}[0] Return to previous menu${NC}"
  
  local selection
  read -p "$(echo -e ${BLUE}${BOLD}"Select a branch (0-$((i-1))): "${NC})" selection
  
  if [[ "$selection" =~ ^[0-9]+$ ]] && [ "$selection" -ge 0 ] && [ "$selection" -lt "$i" ]; then
    if [ "$selection" -eq 0 ]; then
      return 1
    else
      echo "${branches[$((selection-1))]}"
      return 0
    fi
  else
    print_message "$RED" "$CROSS" "Invalid selection"
    return 1
  fi
}

# Get the number of stashes
get_stash_count() {
  git stash list | wc -l | tr -d ' '
}

#################################################
# Main Git Operations
#################################################

# List all branches with details
git_list_branches() {
  print_git_header
  print_message "$BLUE" "$INFO" "Fetching latest branches..."
  git fetch --all --quiet
  
  local current_branch=$(git branch --show-current)
  local target_branch="$TARGET_BRANCH"
  
  print_message "$GREEN" "$CHECK" "Current branch: $current_branch"
  print_message "$MAGENTA" "$INFO" "Target branch: $target_branch"
  print_divider
  
  echo -e "${BOLD}Local branches:${NC}"
  
  # Show local branches with last commit info
  git for-each-ref --sort=committerdate refs/heads/ --format='%(HEAD) %(color:yellow)%(refname:short)%(color:reset) - %(color:red)%(objectname:short)%(color:reset) - %(contents:subject) - %(authorname) (%(color:green)%(committerdate:relative)%(color:reset))'
  
  print_divider
  echo -e "${BOLD}Remote branches:${NC}"
  
  # Show remote branches
  git for-each-ref --sort=committerdate refs/remotes/ --format='%(color:yellow)%(refname:short)%(color:reset) - %(color:red)%(objectname:short)%(color:reset) - %(contents:subject) - %(authorname) (%(color:green)%(committerdate:relative)%(color:reset))' | grep -v HEAD
}

# Interactive branch checkout
git_checkout_branch() {
  print_git_header
  
  # Show current branch
  local current_branch=$(git branch --show-current)
  print_message "$GREEN" "$CHECK" "Current branch: $current_branch"
  print_divider
  
  local branch=$(select_branch)
  if [ $? -eq 0 ]; then
    print_message "$BLUE" "$INFO" "Checking out branch: $branch"
    
    # Check for uncommitted changes
    if [[ -n $(git status -s) ]]; then
      print_message "$YELLOW" "$WARNING" "You have uncommitted changes"
      
      PS3="$(echo -e ${YELLOW}${BOLD}"What would you like to do? "${NC})"
      options=("Stash changes and checkout" "Force checkout (discard changes)" "Cancel")
      select opt in "${options[@]}"; do
        case $opt in
          "Stash changes and checkout")
            git_stash_changes
            git checkout "$branch"
            break
            ;;
          "Force checkout (discard changes)")
            if confirm_action "Are you sure you want to discard all changes?"; then
              git checkout -f "$branch"
            else
              print_message "$YELLOW" "$INFO" "Checkout cancelled"
            fi
            break
            ;;
          "Cancel")
            print_message "$YELLOW" "$INFO" "Checkout cancelled"
            break
            ;;
          *)
            print_message "$RED" "$CROSS" "Invalid option"
            ;;
        esac
      done
    else
      # No uncommitted changes, checkout directly
      git checkout "$branch"
      
      if [ $? -eq 0 ]; then
        print_message "$GREEN" "$CHECK" "Successfully checked out $branch"
      else
        print_message "$RED" "$CROSS" "Failed to checkout $branch"
      fi
    fi
  fi
}

# Create a new feature branch
git_create_feature() {
  print_git_header
  
  # Get branch name
  local name=""
  if [ -n "$1" ]; then
    name="$1"
  else
    read -p "$(echo -e ${CYAN}${BOLD}"Enter feature name (without 'feature/'): "${NC})" name
  fi
  
  if [ -z "$name" ]; then
    print_message "$RED" "$CROSS" "Feature name cannot be empty"
    return 1
  fi
  
  # Remove any spaces and convert to kebab-case
  name=$(echo "$name" | tr ' ' '-' | tr '[:upper:]' '[:lower:]')
  
  # Check if branch already exists
  if git show-ref --verify --quiet "refs/heads/feature/$name"; then
    print_message "$RED" "$CROSS" "Branch feature/$name already exists"
    
    if confirm_action "Do you want to checkout the existing branch instead?"; then
      git checkout "feature/$name"
      return $?
    else
      return 1
    fi
  fi
  
  # Ensure we're on target branch first
  print_message "$BLUE" "$INFO" "Checking out $TARGET_BRANCH branch first..."
  git checkout "$TARGET_BRANCH"
  
  # Pull latest changes
  print_message "$BLUE" "$INFO" "Pulling latest changes from $TARGET_BRANCH..."
  git pull origin "$TARGET_BRANCH"
  
  # Create and checkout feature branch
  print_message "$BLUE" "$INFO" "Creating and switching to branch feature/$name..."
  git checkout -b "feature/$name"
  
  if [ $? -eq 0 ]; then
    print_message "$GREEN" "$CHECK" "Created and switched to branch feature/$name"
  else
    print_message "$RED" "$CROSS" "Failed to create branch feature/$name"
    return 1
  fi
}

# Stash changes
git_stash_changes() {
  print_git_header
  
  # Check if there are any changes to stash
  if [[ -z $(git status -s) ]]; then
    print_message "$YELLOW" "$WARNING" "No changes to stash"
    return 1
  fi
  
  # Ask for stash message
  read -p "$(echo -e ${CYAN}${BOLD}"Enter stash message (optional): "${NC})" message
  
  if [ -n "$message" ]; then
    git stash push -m "$message"
  else
    git stash push
  fi
  
  if [ $? -eq 0 ]; then
    print_message "$GREEN" "$CHECK" "Changes stashed successfully"
  else
    print_message "$RED" "$CROSS" "Failed to stash changes"
    return 1
  fi
  
  # Show stash list
  local stash_count=$(get_stash_count)
  print_message "$BLUE" "$INFO" "You now have $stash_count stashed changes"
  git stash list | awk '{print "  " $0}'
}

# Apply stashed changes
git_apply_stash() {
  print_git_header
  
  # Check if there are any stashes
  local stash_count=$(get_stash_count)
  if [ "$stash_count" -eq 0 ]; then
    print_message "$YELLOW" "$WARNING" "No stashed changes found"
    return 1
  fi
  
  print_message "$BLUE" "$INFO" "Stashed changes:"
  
  # List all stashes with index
  local i=0
  while read -r stash; do
    echo -e "  ${CYAN}[$i]${NC} $stash"
    i=$((i+1))
  done < <(git stash list)
  
  # Add option to return
  echo -e "  ${YELLOW}[a]${NC} Apply most recent stash"
  echo -e "  ${YELLOW}[p]${NC} Pop most recent stash (apply and drop)"
  echo -e "  ${YELLOW}[c]${NC} Cancel"
  
  read -p "$(echo -e ${BLUE}${BOLD}"Select an option: "${NC})" selection
  
  case "$selection" in
    [0-9]*)
      if [ "$selection" -lt "$stash_count" ]; then
        print_message "$BLUE" "$INFO" "Applying stash@{$selection}..."
        git stash apply "stash@{$selection}"
        
        if [ $? -eq 0 ]; then
          print_message "$GREEN" "$CHECK" "Stash applied successfully"
          
          if confirm_action "Do you want to drop this stash now?"; then
            git stash drop "stash@{$selection}"
            print_message "$GREEN" "$CHECK" "Stash dropped"
          fi
        else
          print_message "$RED" "$CROSS" "Failed to apply stash"
          return 1
        fi
      else
        print_message "$RED" "$CROSS" "Invalid stash index"
        return 1
      fi
      ;;
    "a")
      print_message "$BLUE" "$INFO" "Applying most recent stash..."
      git stash apply
      if [ $? -eq 0 ]; then
        print_message "$GREEN" "$CHECK" "Stash applied successfully"
      else
        print_message "$RED" "$CROSS" "Failed to apply stash"
        return 1
      fi
      ;;
    "p")
      print_message "$BLUE" "$INFO" "Popping most recent stash..."
      git stash pop
      if [ $? -eq 0 ]; then
        print_message "$GREEN" "$CHECK" "Stash popped successfully"
      else
        print_message "$RED" "$CROSS" "Failed to pop stash"
        return 1
      fi
      ;;
    "c"|*)
      print_message "$YELLOW" "$INFO" "Operation cancelled"
      return 1
      ;;
  esac
}

# Commitizen-style commit
git_commit() {
  print_git_header
  
  # Check if there are any changes to commit
  if [[ -z $(git status -s) ]]; then
    print_message "$YELLOW" "$WARNING" "No changes to commit"
    return 1
  fi
  
  # Show status
  git status -s
  print_divider
  
  # Ask if user wants to stage all changes
  local stage_all
  read -p "$(echo -e ${CYAN}${BOLD}"Stage all changes? (Y/n): "${NC})" stage_all
  
  if [[ "$stage_all" != "n" && "$stage_all" != "N" ]]; then
    git add .
    print_message "$GREEN" "$CHECK" "All changes staged"
  else
    print_message "$BLUE" "$INFO" "Please stage your changes manually using 'git add' commands"
    return 1
  fi
  
  # Commitizen-style commit
  print_message "$BLUE" "$INFO" "Commitizen-style commit"
  
  # Type selection
  echo -e "${BOLD}Select commit type:${NC}"
  options=("feat: A new feature" "fix: A bug fix" "docs: Documentation changes" "style: Code style changes" "refactor: Code refactoring" "perf: Performance improvements" "test: Adding or updating tests" "build: Build system changes" "ci: CI configuration changes" "chore: Other changes" "Cancel")
  
  PS3="$(echo -e ${CYAN}${BOLD}"Type: "${NC})"
  select opt in "${options[@]}"; do
    if [[ "$opt" == "Cancel" ]]; then
      print_message "$YELLOW" "$INFO" "Commit cancelled"
      return 1
    elif [[ -n "$opt" ]]; then
      type=$(echo "$opt" | cut -d: -f1)
      break
    else
      print_message "$RED" "$CROSS" "Invalid option"
    fi
  done
  
  # Scope (optional)
  read -p "$(echo -e ${CYAN}${BOLD}"Scope (optional): "${NC})" scope
  
  # Subject (required)
  while true; do
    read -p "$(echo -e ${CYAN}${BOLD}"Subject (required): "${NC})" subject
    if [[ -n "$subject" ]]; then
      break
    else
      print_message "$RED" "$CROSS" "Subject cannot be empty"
    fi
  done
  
  # Body (optional)
  read -p "$(echo -e ${CYAN}${BOLD}"Body (optional, press Enter to skip): "${NC})" body
  
  # Breaking changes (optional)
  read -p "$(echo -e ${CYAN}${BOLD}"Breaking changes (optional, press Enter to skip): "${NC})" breaking
  
  # Build commit message
  local commit_msg=""
  if [[ -n "$scope" ]]; then
    commit_msg="$type($scope): $subject"
  else
    commit_msg="$type: $subject"
  fi
  
  if [[ -n "$body" ]]; then
    commit_msg="$commit_msg\n\n$body"
  fi
  
  if [[ -n "$breaking" ]]; then
    commit_msg="$commit_msg\n\nBREAKING CHANGE: $breaking"
  fi
  
  # Show the final commit message
  print_divider
  echo -e "${BOLD}Commit message:${NC}"
  echo -e "$commit_msg"
  print_divider
  
  if confirm_action "Do you want to commit with this message?"; then
    # Use echo -e to preserve newlines and pipe to git commit
    echo -e "$commit_msg" | git commit -F -
    
    if [ $? -eq 0 ]; then
      print_message "$GREEN" "$CHECK" "Changes committed successfully"
    else
      print_message "$RED" "$CROSS" "Failed to commit changes"
      return 1
    fi
  else
    print_message "$YELLOW" "$INFO" "Commit cancelled"
    return 1
  fi
}

# Git log with version information
git_log_versions() {
  print_git_header
  
  # Get the number of commits to show
  local num_commits=10
  if [ -n "$1" ]; then
    num_commits="$1"
  else
    read -p "$(echo -e ${CYAN}${BOLD}"Number of commits to show (default: 10): "${NC})" input_num
    if [[ -n "$input_num" && "$input_num" =~ ^[0-9]+$ ]]; then
      num_commits="$input_num"
    fi
  fi
  
  print_message "$BLUE" "$INFO" "Showing last $num_commits commits with version information"
  print_divider
  
  # Get tags for each commit
  git log -n "$num_commits" --format=format:'%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) %C(dim white)- %an%C(reset)%C(bold yellow)%d%C(reset)' --abbrev-commit
  
  # Offer to show full commit details
  print_divider
  read -p "$(echo -e ${CYAN}${BOLD}"Enter commit hash to see details (or press Enter to skip): "${NC})" commit_hash
  
  if [[ -n "$commit_hash" ]]; then
    git show "$commit_hash"
  fi
}

# Rename branch
git_rename_branch() {
  print_git_header
  
  local current_branch=$(git branch --show-current)
  print_message "$GREEN" "$CHECK" "Current branch: $current_branch"
  
  # Select branch to rename
  echo -e "${BOLD}Select branch to rename:${NC}"
  echo -e "  ${CYAN}[1]${NC} Current branch ($current_branch)"
  echo -e "  ${CYAN}[2]${NC} Another branch"
  echo -e "  ${YELLOW}[c]${NC} Cancel"
  
  read -p "$(echo -e ${BLUE}${BOLD}"Select an option: "${NC})" selection
  
  local branch_to_rename=""
  case "$selection" in
    "1")
      branch_to_rename="$current_branch"
      ;;
    "2")
      branch_to_rename=$(select_branch)
      if [ $? -ne 0 ]; then
        return 1
      fi
      ;;
    "c"|*)
      print_message "$YELLOW" "$INFO" "Operation cancelled"
      return 1
      ;;
  esac
  
  # Get new branch name
  read -p "$(echo -e ${CYAN}${BOLD}"Enter new name for branch '$branch_to_rename': "${NC})" new_name
  
  if [ -z "$new_name" ]; then
    print_message "$RED" "$CROSS" "New branch name cannot be empty"
    return 1
  fi
  
  # Check if new branch name already exists
  if git show-ref --verify --quiet "refs/heads/$new_name"; then
    print_message "$RED" "$CROSS" "Branch $new_name already exists"
    return 1
  fi
  
  # Rename branch
  if [ "$branch_to_rename" = "$current_branch" ]; then
    # Renaming current branch
    git branch -m "$new_name"
  else
    # Renaming another branch
    git branch -m "$branch_to_rename" "$new_name"
  fi
  
  if [ $? -eq 0 ]; then
    print_message "$GREEN" "$CHECK" "Branch renamed from '$branch_to_rename' to '$new_name'"
    
    # Ask if user wants to update remote
    if git show-ref --verify --quiet "refs/remotes/origin/$branch_to_rename"; then
      if confirm_action "Do you want to update the remote branch as well?"; then
        # Delete old branch from remote and push new one
        if [ "$branch_to_rename" = "$current_branch" ]; then
          # If we renamed the current branch, push the new name and delete the old one
          git push origin -u "$new_name"
          git push origin --delete "$branch_to_rename"
        else
          # Otherwise, we need to set upstream for the new branch name
          git push origin -u "$new_name"
          git push origin --delete "$branch_to_rename"
        fi
        
        if [ $? -eq 0 ]; then
          print_message "$GREEN" "$CHECK" "Remote branch updated successfully"
        else
          print_message "$RED" "$CROSS" "Failed to update remote branch"
          print_message "$YELLOW" "$WARNING" "You may need to run manually:"
          echo "  git push origin -u $new_name"
          echo "  git push origin --delete $branch_to_rename"
        fi
      fi
    fi
  else
    print_message "$RED" "$CROSS" "Failed to rename branch"
    return 1
  fi
}

# Delete branch locally
git_delete_branch_local() {
  print_git_header
  
  local current_branch=$(git branch --show-current)
  print_message "$GREEN" "$CHECK" "Current branch: $current_branch"
  
  # Select branch to delete
  local branch=$(select_branch)
  if [ $? -ne 0 ]; then
    return 1
  fi
  
  # Check if trying to delete current branch
  if [ "$branch" = "$current_branch" ]; then
    print_message "$RED" "$CROSS" "Cannot delete the current branch"
    print_message "$YELLOW" "$INFO" "Switch to another branch first"
    return 1
  fi
  
  # Check if branch has unmerged changes
  if ! git branch --merged | grep -q "$branch"; then
    print_message "$YELLOW" "$WARNING" "Branch '$branch' has unmerged changes"
    
    if ! confirm_action "Force delete branch '$branch'?"; then
      print_message "$YELLOW" "$INFO" "Operation cancelled"
      return 1
    fi
    
    # Force delete
    git branch -D "$branch"
  else
    # Normal delete
    git branch -d "$branch"
  fi
  
  if [ $? -eq 0 ]; then
    print_message "$GREEN" "$CHECK" "Branch '$branch' deleted locally"
  else
    print_message "$RED" "$CROSS" "Failed to delete branch '$branch'"
    return 1
  fi
}

# Delete branch locally and remotely
git_delete_branch_both() {
  print_git_header
  
  local current_branch=$(git branch --show-current)
  print_message "$GREEN" "$CHECK" "Current branch: $current_branch"
  
  # Select branch to delete
  local branch=$(select_branch)
  if [ $? -ne 0 ]; then
    return 1
  fi
  
  # Check if trying to delete current branch
  if [ "$branch" = "$current_branch" ]; then
    print_message "$RED" "$CROSS" "Cannot delete the current branch"
    print_message "$YELLOW" "$INFO" "Switch to another branch first"
    return 1
  fi
  
  # Warning and confirmation
  print_message "$YELLOW" "$WARNING" "This will delete branch '$branch' both locally and remotely"
  if ! confirm_action "Are you sure?"; then
    print_message "$YELLOW" "$INFO" "Operation cancelled"
    return 1
  fi
  
  # Delete locally
  if ! git branch --merged | grep -q "$branch"; then
    print_message "$YELLOW" "$WARNING" "Branch '$branch' has unmerged changes"
    
    if ! confirm_action "Force delete branch '$branch'?"; then
      print_message "$YELLOW" "$INFO" "Operation cancelled"
      return 1
    fi
    
    # Force delete
    git branch -D "$branch"
  else
    # Normal delete
    git branch -d "$branch"
  fi
  
  if [ $? -ne 0 ]; then
    print_message "$RED" "$CROSS" "Failed to delete branch '$branch' locally"
    return 1
  fi
  
  print_message "$GREEN" "$CHECK" "Branch '$branch' deleted locally"
  
  # Check if branch exists on remote
  if git ls-remote --heads origin "$branch" | grep -q "$branch"; then
    # Delete remote branch
    git push origin --delete "$branch"
    
    if [ $? -eq 0 ]; then
      print_message "$GREEN" "$CHECK" "Branch '$branch' deleted from remote"
    else
      print_message "$RED" "$CROSS" "Failed to delete branch '$branch' from remote"
      return 1
    fi
  else
    print_message "$YELLOW" "$INFO" "Branch '$branch' does not exist on remote"
  fi
}

# Change target branch
git_set_target_branch() {
  print_git_header
  
  print_message "$BLUE" "$INFO" "Current target branch: $TARGET_BRANCH"
  
  # Select new target branch
  local branch=$(select_branch)
  if [ $? -ne 0 ]; then
    return 1
  fi
  
  # Update configuration
  TARGET_BRANCH="$branch"
  echo "TARGET_BRANCH=\"$TARGET_BRANCH\"" > "$CONFIG_FILE"
  
  print_message "$GREEN" "$CHECK" "Target branch updated to: $TARGET_BRANCH"
}

# Retrigger Vercel deployment for the target branch
git_retrigger_vercel_deployment() {
  print_git_header
  
  # Check if Vercel CLI is installed
  if ! command -v vercel &> /dev/null; then
    print_message "$RED" "$CROSS" "Vercel CLI is not installed"
    print_message "$BLUE" "$INFO" "Install it with: npm i -g vercel"
    return 1
  fi
  
  # Options for retrigger
  echo -e "${BOLD}Select branch to redeploy:${NC}"
  echo -e "  ${CYAN}[1]${NC} Target branch ($TARGET_BRANCH)"
  echo -e "  ${CYAN}[2]${NC} Current branch ($(git branch --show-current))"
  echo -e "  ${CYAN}[3]${NC} Another branch"
  echo -e "  ${YELLOW}[c]${NC} Cancel"
  
  read -p "$(echo -e ${BLUE}${BOLD}"Select an option: "${NC})" selection
  
  local branch_to_deploy=""
  case "$selection" in
    "1")
      branch_to_deploy="$TARGET_BRANCH"
      ;;
    "2")
      branch_to_deploy=$(git branch --show-current)
      ;;
    "3")
      branch_to_deploy=$(select_branch)
      if [ $? -ne 0 ]; then
        return 1
      fi
      ;;
    "c"|*)
      print_message "$YELLOW" "$INFO" "Operation cancelled"
      return 1
      ;;
  esac
  
  print_message "$BLUE" "$INFO" "Retriggering Vercel deployment for branch: $branch_to_deploy"
  
  # Methods for retriggering
  echo -e "${BOLD}Select method:${NC}"
  echo -e "  ${CYAN}[1]${NC} Create empty commit"
  echo -e "  ${CYAN}[2]${NC} Use Vercel CLI"
  echo -e "  ${YELLOW}[c]${NC} Cancel"
  
  read -p "$(echo -e ${BLUE}${BOLD}"Select method: "${NC})" method
  
  case "$method" in
    "1")
      # Save current branch
      local current_branch=$(git branch --show-current)
      
      # Check if we need to switch branches
      if [ "$current_branch" != "$branch_to_deploy" ]; then
        git checkout "$branch_to_deploy"
        if [ $? -ne 0 ]; then
          print_message "$RED" "$CROSS" "Failed to checkout branch $branch_to_deploy"
          return 1
        fi
      fi
      
      # Create empty commit
      git commit --allow-empty -m "Trigger Vercel deployment"
      if [ $? -ne 0 ]; then
        print_message "$RED" "$CROSS" "Failed to create empty commit"
        # Restore original branch if needed
        if [ "$current_branch" != "$branch_to_deploy" ]; then
          git checkout "$current_branch"
        fi
        return 1
      fi
      
      # Push to remote
      git push origin "$branch_to_deploy"
      if [ $? -ne 0 ]; then
        print_message "$RED" "$CROSS" "Failed to push to remote"
        # Restore original branch if needed
        if [ "$current_branch" != "$branch_to_deploy" ]; then
          git checkout "$current_branch"
        fi
        return 1
      fi
      
      print_message "$GREEN" "$CHECK" "Empty commit pushed to $branch_to_deploy, Vercel deployment triggered"
      
      # Restore original branch if needed
      if [ "$current_branch" != "$branch_to_deploy" ]; then
        git checkout "$current_branch"
      fi
      ;;
    "2")
      # Use Vercel CLI
      print_message "$BLUE" "$INFO" "Using Vercel CLI to trigger deployment..."
      vercel deploy --prod
      
      if [ $? -eq 0 ]; then
        print_message "$GREEN" "$CHECK" "Vercel deployment triggered"
      else
        print_message "$RED" "$CROSS" "Failed to trigger Vercel deployment"
        return 1
      fi
      ;;
    "c"|*)
      print_message "$YELLOW" "$INFO" "Operation cancelled"
      return 1
      ;;
  esac
}

# Main git menu
git_menu() {
  print_git_header
  
  # Get current branch and state
  local current_branch=$(git branch --show-current)
  local has_changes=$(git status -s)
  local stash_count=$(get_stash_count)
  
  # Display status
  print_message "$GREEN" "$CHECK" "Current branch: $current_branch"
  print_message "$MAGENTA" "$INFO" "Target branch: $TARGET_BRANCH"
  
  if [ -n "$has_changes" ]; then
    print_message "$YELLOW" "$WARNING" "You have uncommitted changes"
  else
    print_message "$GREEN" "$CHECK" "Working tree clean"
  fi
  
  if [ "$stash_count" -gt 0 ]; then
    print_message "$BLUE" "$INFO" "Stashed changes: $stash_count"
  fi
  
  print_divider
  
  # Menu options
  echo -e "${BOLD}Branch Operations:${NC}"
  echo -e "  ${CYAN}[1]${NC} List branches"
  echo -e "  ${CYAN}[2]${NC} Checkout branch"
  echo -e "  ${CYAN}[3]${NC} Create feature branch"
  echo -e "  ${CYAN}[4]${NC} Rename branch"
  echo -e "  ${CYAN}[5]${NC} Delete branch locally"
  echo -e "  ${CYAN}[6]${NC} Delete branch locally and on remote"
  echo -e "  ${CYAN}[7]${NC} Set target branch (currently: $TARGET_BRANCH)"
  
  echo -e "\n${BOLD}Changes:${NC}"
  echo -e "  ${CYAN}[8]${NC} Stash changes"
  echo -e "  ${CYAN}[9]${NC} Apply stashed changes"
  echo -e "  ${CYAN}[10]${NC} Commit (Commitizen style)"
  
  echo -e "\n${BOLD}Information:${NC}"
  echo -e "  ${CYAN}[11]${NC} View commit history with versions"
  
  echo -e "\n${BOLD}Deployment:${NC}"
  echo -e "  ${CYAN}[12]${NC} Retrigger Vercel deployment"
  
  echo -e "\n${YELLOW}[0]${NC} Return to main menu"
  
  # Get user input
  read -p "$(echo -e ${BLUE}${BOLD}"Select an option: "${NC})" option
  
  case "$option" in
    1) git_list_branches ;;
    2) git_checkout_branch ;;
    3) git_create_feature ;;
    4) git_rename_branch ;;
    5) git_delete_branch_local ;;
    6) git_delete_branch_both ;;
    7) git_set_target_branch ;;
    8) git_stash_changes ;;
    9) git_apply_stash ;;
    10) git_commit ;;
    11) git_log_versions ;;
    12) git_retrigger_vercel_deployment ;;
    0) return 0 ;;
    *) 
      print_message "$RED" "$CROSS" "Invalid option"
      return 1
      ;;
  esac
  
  # Return to the menu after operation completes
  read -p "$(echo -e ${CYAN}${BOLD}"Press Enter to continue..."${NC})"
  git_menu
} 