#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Module/Feature Creator ===${NC}"
echo "This script will help you set up a new module/feature with the proper structure."
echo ""

# Function to convert string to kebab case
to_kebab_case() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g'
}

# Function to convert string to PascalCase
to_pascal_case() {
  echo "$1" | awk 'BEGIN{FS=OFS=" "} {for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)} 1' | sed 's/ //g'
}

# Function to create directory if it doesn't exist
create_dir() {
  if [ ! -d "$1" ]; then
    mkdir -p "$1"
    echo -e "${GREEN}Created directory:${NC} $1"
  fi
}

# Ask for the feature name
read -p "What is the feature called? " feature_name
if [ -z "$feature_name" ]; then
  echo "Feature name cannot be empty. Exiting."
  exit 1
fi

# Convert feature name to different formats
feature_kebab=$(to_kebab_case "$feature_name")
feature_pascal=$(to_pascal_case "$feature_name")

echo -e "${YELLOW}Feature name:${NC} $feature_name"
echo -e "${YELLOW}Directory name:${NC} $feature_kebab"
echo -e "${YELLOW}Component name:${NC} $feature_pascal"
echo ""

# Create the module directory structure
echo -e "${BLUE}Creating module directory structure...${NC}"
module_dir="modules/$feature_kebab"
create_dir "$module_dir"
create_dir "$module_dir/components"
create_dir "$module_dir/api/queries"
create_dir "$module_dir/api/mutations"
create_dir "$module_dir/hooks"

# Create .gitkeep files to ensure directories are tracked in git
touch "$module_dir/components/.gitkeep"
touch "$module_dir/api/queries/.gitkeep"
touch "$module_dir/api/mutations/.gitkeep"
touch "$module_dir/hooks/.gitkeep"

# Create types.ts file
cat > "$module_dir/types.ts" << EOF
export interface ${feature_pascal}Props {
  // Define your props here
}

export interface ${feature_pascal}Data {
  // Define your data structure here
}
EOF
echo -e "${GREEN}Created file:${NC} $module_dir/types.ts"

# Ask if the module needs its own page
read -p "Does your module/feature need its own page? (y/n) " needs_page
if [[ $needs_page =~ ^[Yy]$ ]]; then
  # Ask if the page should be in the dashboard
  read -p "Should the page be in the dashboard? (y/n) " in_dashboard
  
  if [[ $in_dashboard =~ ^[Yy]$ ]]; then
    page_path="app/dashboard/$feature_kebab"
  else
    read -p "Enter the path for the page (without app/ prefix): " custom_path
    page_path="app/${custom_path}/$feature_kebab"
  fi
  
  # Create the page directory
  create_dir "$page_path"
  
  # Create the page.tsx file
  cat > "$page_path/page.tsx" << EOF
import { ${feature_pascal}View } from "@/views/${feature_kebab}/${feature_kebab}-view"

export const metadata = {
  title: "${feature_name}",
  description: "${feature_name} management and overview",
}

export default function ${feature_pascal}Page() {
  return <${feature_pascal}View />
}
EOF
  echo -e "${GREEN}Created file:${NC} $page_path/page.tsx"
  
  # Create the view directory and file
  view_dir="views/$feature_kebab"
  create_dir "$view_dir"
  
  cat > "$view_dir/${feature_kebab}-view.tsx" << EOF
'use client'

import { ${feature_pascal}Props } from "@/modules/${feature_kebab}/types"

export function ${feature_pascal}View({}: ${feature_pascal}Props) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">${feature_name}</h1>
      <p>Your ${feature_name} content goes here</p>
    </div>
  )
}
EOF
  echo -e "${GREEN}Created file:${NC} $view_dir/${feature_kebab}-view.tsx"
fi

# Create an index.ts file to export types and main components
cat > "$module_dir/index.ts" << EOF
export * from './types'
// Export your main components, hooks, and API functions here
EOF
echo -e "${GREEN}Created file:${NC} $module_dir/index.ts"

echo ""
echo -e "${BLUE}=== Module Creation Complete ===${NC}"
echo -e "Your new module '${YELLOW}${feature_name}${NC}' has been set up with the following structure:"
echo ""
echo "modules/$feature_kebab/"
echo "├── components/"
echo "├── api/"
echo "│   ├── queries/"
echo "│   └── mutations/"
echo "├── hooks/"
echo "├── types.ts"
echo "└── index.ts"

if [[ $needs_page =~ ^[Yy]$ ]]; then
  echo ""
  echo "$page_path/"
  echo "└── page.tsx"
  echo ""
  echo "views/$feature_kebab/"
  echo "└── ${feature_kebab}-view.tsx"
fi

echo ""
echo -e "${GREEN}You can now start building your ${feature_name} feature!${NC}"