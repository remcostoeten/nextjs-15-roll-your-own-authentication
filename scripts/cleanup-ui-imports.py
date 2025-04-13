#!/usr/bin/env python3

import os
import re
import argparse
import subprocess
import tempfile
import sys
from typing import List, Set, Dict, Tuple, Optional

# ANSI color codes for better UI
CYAN = '\033[96m'
GREEN = '\033[92m'
YELLOW = '\033[93m'
RED = '\033[91m'
BOLD = '\033[1m'
RESET = '\033[0m'

def find_project_root() -> str:
    """Find the project root by looking for package.json or tsconfig.json."""
    current_dir = os.getcwd()
    while True:
        if os.path.exists(os.path.join(current_dir, 'package.json')) or \
           os.path.exists(os.path.join(current_dir, 'tsconfig.json')):
            return current_dir
        parent = os.path.dirname(current_dir)
        if parent == current_dir:
            # Reached the root directory without finding project markers
            return os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
        current_dir = parent

def find_tsx_files(directories: List[str], exclude_dirs: List[str]) -> List[str]:
    """Find all .tsx files in the specified directories."""
    tsx_files = []
    for directory in directories:
        if not os.path.exists(directory):
            print(f"{YELLOW}Warning: Directory {directory} does not exist. Skipping.{RESET}")
            continue
            
        for root, dirs, files in os.walk(directory):
            # Exclude directories in-place
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for file in files:
                if file.endswith('.tsx'):
                    tsx_files.append(os.path.join(root, file))
    return tsx_files

def extract_ui_imports(file_path: str) -> Tuple[List[str], str, Dict[str, List[str]]]:
    """Extract UI component imports from a file and return components, content, and import sources."""
    with open(file_path, 'r') as file:
        content = file.read()

    # Regular expression to match UI component imports
    ui_import_pattern = r'import\s+{([^}]+)}\s+from\s+[\'"](@/components/ui/[^\'"]+)[\'"];?'

    # Find all UI component imports
    ui_imports = re.findall(ui_import_pattern, content, re.DOTALL)

    if not ui_imports:
        return [], content, {}  # No UI imports to process

    # Collect all imported UI components and their sources
    all_components = []
    import_sources = {}  # Maps import source to list of components

    for components_str, source in ui_imports:
        components = re.split(r',\s*', components_str)
        clean_components = [comp.strip() for comp in components if comp.strip() and not comp.strip().startswith(',')]
        
        all_components.extend(clean_components)
        
        # Group components by their import source
        if source not in import_sources:
            import_sources[source] = []
        import_sources[source].extend(clean_components)

    return all_components, content, import_sources

def process_file(file_path: str, selected_components: Optional[List[str]] = None) -> bool:
    """Process a file to clean up UI imports. If selected_components is provided, only those will be processed."""
    all_components, content, import_sources = extract_ui_imports(file_path)
    
    if not all_components:
        return False  # No UI imports to process
    
    # If selected_components is provided, filter the components
    if selected_components:
        # Only keep components that are in the selected list
        filtered_components = [comp for comp in all_components if comp in selected_components]
        
        if not filtered_components:
            return False  # None of the selected components are in this file
            
        all_components = filtered_components
    
    # Create new import statement
    new_import = f"import {{\n  {', '.join(sorted(set(all_components)))}\n}} from '@/components/ui/';"

    # Regular expression to match UI component imports
    ui_import_pattern = r'import\s+{([^}]+)}\s+from\s+[\'"]@/components/ui/[^\'"]+[\'"];?'

    # Replace all UI imports with the new import statement
    content = re.sub(ui_import_pattern, '', content, flags=re.DOTALL)
    
    # Find the position to insert the new import
    insert_position = content.find('import')
    if insert_position == -1:
        insert_position = 0
    
    # Insert the new import statement
    content = content[:insert_position] + new_import + '\n' + content[insert_position:]

    # Remove any extra newlines
    content = re.sub(r'\n{3,}', '\n\n', content)

    # Write updated content back to file
    with open(file_path, 'w') as file:
        file.write(content)
    
    return True

def process_directory(directory: str, exclude_dirs: List[str], selected_components: Optional[List[str]] = None) -> int:
    """Process all .tsx files in a directory. Returns the number of files processed."""
    processed_count = 0
    for root, dirs, files in os.walk(directory):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for file in files:
            if file.endswith('.tsx'):
                file_path = os.path.join(root, file)
                if process_file(file_path, selected_components):
                    processed_count += 1
                    print(f"{GREEN}Processed: {file_path}{RESET}")
    return processed_count

def select_components_with_fzf(components: List[str]) -> List[str]:
    """Use fzf to select components interactively."""
    if not components:
        return []
        
    # Check if fzf is installed
    try:
        subprocess.run(['fzf', '--version'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
    except (subprocess.SubprocessError, FileNotFoundError):
        print(f"{YELLOW}fzf not found. Using fallback selection method.{RESET}")
        return select_components_interactively(components)
    
    # Create a temporary file with the components
    with tempfile.NamedTemporaryFile(mode='w+', delete=False) as temp:
        for component in sorted(set(components)):
            temp.write(f"{component}\n")
        temp_filename = temp.name
    
    try:
        # Run fzf to select components
        result = subprocess.run(
            ['fzf', '--multi', '--height=50%', '--border', '--prompt=Select components (TAB/SHIFT+TAB to mark): '],
            input=open(temp_filename, 'r').read(),
            stdout=subprocess.PIPE,
            text=True
        )
        
        if result.returncode == 0:
            selected = result.stdout.strip().split('\n')
            return [s for s in selected if s]  # Filter out empty strings
        return []
    except subprocess.SubprocessError:
        print(f"{RED}Error running fzf. Using fallback selection method.{RESET}")
        return select_components_interactively(components)
    finally:
        # Clean up the temporary file
        os.unlink(temp_filename)

def select_components_interactively(components: List[str]) -> List[str]:
    """Fallback method to select components interactively using simple console input."""
    unique_components = sorted(set(components))
    selected = []
    
    print(f"\n{CYAN}Available components:{RESET}")
    for i, component in enumerate(unique_components):
        print(f"{i+1}. {component}")
    
    print(f"\n{YELLOW}Enter component numbers separated by spaces (e.g., '1 3 5'){RESET}")
    print(f"{YELLOW}Or enter 'all' to select all components{RESET}")
    print(f"{YELLOW}Or enter 'q' to quit{RESET}")
    
    while True:
        choice = input(f"\n{BOLD}Select components: {RESET}").strip()
        
        if choice.lower() == 'q':
            return []
        
        if choice.lower() == 'all':
            return unique_components
        
        try:
            indices = [int(idx) - 1 for idx in choice.split()]
            selected = [unique_components[i] for i in indices if 0 <= i < len(unique_components)]
            if selected:
                break
            print(f"{RED}No valid components selected. Please try again.{RESET}")
        except (ValueError, IndexError):
            print(f"{RED}Invalid input. Please enter numbers separated by spaces.{RESET}")
    
    return selected

def collect_all_components(directories: List[str], exclude_dirs: List[str]) -> List[str]:
    """Collect all UI components from all .tsx files in the specified directories."""
    all_components = []
    for directory in directories:
        if not os.path.exists(directory):
            continue
            
        for root, dirs, files in os.walk(directory):
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for file in files:
                if file.endswith('.tsx'):
                    file_path = os.path.join(root, file)
                    components, _, _ = extract_ui_imports(file_path)
                    all_components.extend(components)
    
    return all_components

def interactive_mode():
    """Run the script in interactive mode."""
    print(f"\n{CYAN}{BOLD}UI Import Cleanup - Interactive Mode{RESET}")
    
    # Find project root
    project_root = find_project_root()
    print(f"{YELLOW}Project root: {project_root}{RESET}")
    
    # Default directories
    default_dirs = [
        os.path.join(project_root, 'src', 'app'),
        os.path.join(project_root, 'src', 'components'),
        os.path.join(project_root, 'src', 'shared'),
        os.path.join(project_root, 'app'),
        os.path.join(project_root, 'components'),
        os.path.join(project_root, 'shared')
    ]
    
    # Filter to only existing directories
    existing_dirs = [d for d in default_dirs if os.path.exists(d)]
    
    if not existing_dirs:
        print(f"{RED}No default directories found. Please specify custom directories.{RESET}")
        existing_dirs = []
    
    # Ask for custom directories
    print(f"\n{CYAN}Default directories:{RESET}")
    for i, directory in enumerate(existing_dirs):
        print(f"{i+1}. {directory}")
    
    custom_dirs_input = input(f"\n{YELLOW}Enter custom directories to scan (comma-separated) or press Enter to use defaults: {RESET}").strip()
    
    if custom_dirs_input:
        custom_dirs = [d.strip() for d in custom_dirs_input.split(',')]
        # Convert relative paths to absolute
        custom_dirs = [os.path.abspath(d) if not os.path.isabs(d) else d for d in custom_dirs]
        scan_dirs = custom_dirs
    else:
        scan_dirs = existing_dirs
    
    # Ask for directories to exclude
    exclude_input = input(f"\n{YELLOW}Enter directories to exclude (comma-separated) or press Enter for default ['ui']: {RESET}").strip()
    
    if exclude_input:
        exclude_dirs = [d.strip() for d in exclude_input.split(',')]
    else:
        exclude_dirs = ['ui']
    
    print(f"\n{CYAN}Scanning directories:{RESET}")
    for directory in scan_dirs:
        print(f"- {directory}")
    
    print(f"\n{CYAN}Excluding directories:{RESET}")
    for directory in exclude_dirs:
        print(f"- {directory}")
    
    # Ask if user wants to select specific components
    select_specific = input(f"\n{YELLOW}Do you want to select specific components? [y/N]: {RESET}").strip().lower() == 'y'
    
    selected_components = None
    if select_specific:
        print(f"\n{CYAN}Collecting all UI components...{RESET}")
        all_components = collect_all_components(scan_dirs, exclude_dirs)
        
        if not all_components:
            print(f"{RED}No UI components found in the specified directories.{RESET}")
            return
        
        print(f"{GREEN}Found {len(set(all_components))} unique UI components.{RESET}")
        
        # Let user select components
        selected_components = select_components_with_fzf(all_components)
        
        if not selected_components:
            print(f"{YELLOW}No components selected. Exiting.{RESET}")
            return
        
        print(f"\n{GREEN}Selected {len(selected_components)} components:{RESET}")
        for component in sorted(selected_components):
            print(f"- {component}")
    
    # Process files
    print(f"\n{CYAN}Processing files...{RESET}")
    
    total_processed = 0
    for directory in scan_dirs:
        if os.path.exists(directory):
            processed = process_directory(directory, exclude_dirs, selected_components)
            total_processed += processed
    
    if total_processed > 0:
        print(f"\n{GREEN}Successfully processed {total_processed} files.{RESET}")
    else:
        print(f"\n{YELLOW}No files were processed. No matching UI imports found.{RESET}")

def main():
    parser = argparse.ArgumentParser(description='Cleanup UI component imports in TypeScript files.')
    parser.add_argument('--i', metavar='INPUT', help='Path to a specific file to process')
    parser.add_argument('--dir', metavar='DIRECTORY', help='Path to a specific directory to process')
    parser.add_argument('--exclude', metavar='EXCLUDE', help='Directories to exclude (comma-separated)')
    parser.add_argument('--interactive', action='store_true', help='Run in interactive mode')
    args = parser.parse_args()

    # If no arguments or interactive flag, run in interactive mode
    if len(sys.argv) == 1 or args.interactive:
        interactive_mode()
        return

    # Process a specific file
    if args.i:
        if args.i.endswith('.tsx'):
            if process_file(args.i):
                print(f"{GREEN}Processed file: {args.i}{RESET}")
            else:
                print(f"{YELLOW}No UI imports found in {args.i}{RESET}")
        else:
            print(f"{RED}Error: {args.i} is not a .tsx file{RESET}")
        return

    # Process a specific directory
    if args.dir:
        exclude_dirs = ['ui']
        if args.exclude:
            exclude_dirs.extend([d.strip() for d in args.exclude.split(',')])
        
        if os.path.exists(args.dir):
            processed = process_directory(args.dir, exclude_dirs)
            if processed > 0:
                print(f"{GREEN}Successfully processed {processed} files in {args.dir}{RESET}")
            else:
                print(f"{YELLOW}No files were processed in {args.dir}. No matching UI imports found.{RESET}")
        else:
            print(f"{RED}Error: Directory {args.dir} does not exist{RESET}")
        return

    # Default behavior (process src/app and src/components)
    project_root = find_project_root()
    app_dir = os.path.join(project_root, 'src', 'app')
    components_dir = os.path.join(project_root, 'src', 'components')
    exclude_dirs = ['ui']
    
    if args.exclude:
        exclude_dirs.extend([d.strip() for d in args.exclude.split(',')])
    
    total_processed = 0
    for directory in [app_dir, components_dir]:
        if os.path.exists(directory):
            processed = process_directory(directory, exclude_dirs)
            total_processed += processed
    
    if total_processed > 0:
        print(f"{GREEN}Successfully processed {total_processed} files in src/app and src/components directories{RESET}")
    else:
        print(f"{YELLOW}No files were processed. No matching UI imports found.{RESET}")

if __name__ == "__main__":
    main()
