#!/usr/bin/env python3
"""
Script to find unused files in a Next.js TypeScript project.
It checks which .tsx and .ts files are not imported anywhere in the project.
Handles Next.js specific files and conventions.
"""

import os
import re
import argparse
import json
from collections import defaultdict
import sys
from typing import List, Set, Dict, Tuple
import time
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path
import shutil
from datetime import datetime

# Default settings
DEFAULT_EXTENSIONS = ["tsx", "ts"]
DEFAULT_EXCLUDE = ["node_modules", ".next", ".git", "dist", "build"]
DEFAULT_PARALLEL_JOBS = os.cpu_count()

# ANSI colors for better output
GREEN = '\033[92m'
YELLOW = '\033[93m'
RED = '\033[91m'
CYAN = '\033[96m'
BOLD = '\033[1m'
RESET = '\033[0m'

def print_banner():
    """Print a nice banner for the tool."""
    banner = f"""
{CYAN}{BOLD}╔══════════════════════════════════════════════════════════════╗
║                    Next.js File Analyzer                       ║
║           Find and manage unused files in your project        ║
╚══════════════════════════════════════════════════════════════╝{RESET}
"""
    print(banner)

def print_menu():
    """Print the main menu options."""
    menu = f"""
{BOLD}Available Commands:{RESET}

{GREEN}1. Analyze Project{RESET}
   Find unused files in the project

{GREEN}2. Interactive Cleanup{RESET}
   Review and remove unused files interactively

{GREEN}3. Move to Archive{RESET}
   Move unused files to an archive directory

{GREEN}4. Generate Report{RESET}
   Create a detailed HTML report of unused files

{GREEN}5. Show Statistics{RESET}
   Display project file statistics

{GREEN}6. Configure Settings{RESET}
   Modify analysis settings

{GREEN}7. Help{RESET}
   Show detailed help and usage information

{GREEN}8. Exit{RESET}
   Exit the program

Enter your choice (1-8): """
    return input(menu)

def show_help():
    """Display detailed help information."""
    help_text = f"""
{BOLD}Next.js File Analyzer - Help{RESET}

{CYAN}Purpose:{RESET}
This tool helps you find and manage unused files in your Next.js project.
It analyzes import statements and identifies files that aren't imported anywhere.

{CYAN}Features:{RESET}
• Detects unused TypeScript/JavaScript files
• Handles Next.js special files (pages, layouts, etc.)
• Supports path aliases from tsconfig.json
• Parallel processing for better performance
• Interactive file cleanup
• Report generation

{CYAN}Common Use Cases:{RESET}
1. Finding dead code:
   Use option 1 to analyze your project and find unused files

2. Cleaning up your project:
   Use option 2 to interactively review and remove unused files

3. Safe archiving:
   Use option 3 to move unused files to an archive directory
   instead of deleting them

4. Documentation:
   Use option 4 to generate a detailed HTML report for review

{CYAN}Tips:{RESET}
• Always commit your changes before removing files
• Use the archive option if you're unsure about deleting files
• Check the generated report for detailed analysis
• Some files (like Next.js pages) are automatically considered used

Press Enter to return to the main menu..."""

    print(help_text)
    input()

def interactive_cleanup(unused_files: List[str]):
    """Interactively review and remove unused files."""
    if not unused_files:
        print(f"{YELLOW}No unused files to clean up.{RESET}")
        return

    print(f"\n{CYAN}Interactive Cleanup{RESET}")
    print("Review each file and choose what to do with it.\n")

    for file in unused_files:
        while True:
            choice = input(f"""
{BOLD}File: {file}{RESET}
1. Delete file
2. Skip file
3. View file contents
4. Move to archive
Choice (1-4): """)

            if choice == '1':
                try:
                    os.remove(file)
                    print(f"{GREEN}Deleted: {file}{RESET}")
                except Exception as e:
                    print(f"{RED}Error deleting {file}: {str(e)}{RESET}")
                break
            elif choice == '2':
                print(f"{YELLOW}Skipped: {file}{RESET}")
                break
            elif choice == '3':
                try:
                    with open(file, 'r') as f:
                        print(f"\n{CYAN}Contents of {file}:{RESET}\n")
                        print(f.read())
                    input("\nPress Enter to continue...")
                except Exception as e:
                    print(f"{RED}Error reading {file}: {str(e)}{RESET}")
            elif choice == '4':
                archive_dir = "archived_files"
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                archive_path = os.path.join(archive_dir, timestamp, os.path.dirname(file))
                try:
                    os.makedirs(archive_path, exist_ok=True)
                    shutil.move(file, os.path.join(archive_path, os.path.basename(file)))
                    print(f"{GREEN}Moved to archive: {file}{RESET}")
                except Exception as e:
                    print(f"{RED}Error archiving {file}: {str(e)}{RESET}")
                break

def generate_html_report(results: Dict):
    """Generate a detailed HTML report of the analysis."""
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    report_file = f"unused_files_report_{timestamp}.html"

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Next.js File Analysis Report</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 40px; }}
            h1 {{ color: #0070f3; }}
            .stats {{ background: #f6f6f6; padding: 20px; border-radius: 8px; }}
            .file-list {{ margin-top: 20px; }}
            .directory {{ margin: 10px 0; }}
            .directory-name {{ font-weight: bold; color: #666; }}
            .file {{ margin-left: 20px; color: #333; }}
            .timestamp {{ color: #666; font-size: 0.9em; }}
        </style>
    </head>
    <body>
        <h1>Next.js File Analysis Report</h1>
        <div class="timestamp">Generated on: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</div>

        <div class="stats">
            <h2>Statistics</h2>
            <p>Total files analyzed: {results["total_files"]}</p>
            <p>Used files: {len(results["used_files"])}</p>
            <p>Unused files: {len(results["unused_files"])}</p>
            <p>Analysis duration: {results["duration"]:.2f} seconds</p>
        </div>

        <div class="file-list">
            <h2>Unused Files by Directory</h2>
    """

    for dir_name, files in results["unused_by_directory"].items():
        html_content += f"""
            <div class="directory">
                <div class="directory-name">{dir_name}/</div>
                {"".join(f'<div class="file">- {f}</div>' for f in sorted(files))}
            </div>
        """

    html_content += """
        </div>
    </body>
    </html>
    """

    with open(report_file, 'w') as f:
        f.write(html_content)

    print(f"{GREEN}Report generated: {report_file}{RESET}")

def show_statistics(results: Dict):
    """Display detailed project statistics."""
    print(f"\n{CYAN}{BOLD}Project Statistics{RESET}")
    print(f"\nTotal files analyzed: {results['total_files']}")
    print(f"Used files: {len(results['used_files'])}")
    print(f"Unused files: {len(results['unused_files'])}")
    print(f"Analysis duration: {results['duration']:.2f} seconds")

    # File type statistics
    file_types = defaultdict(int)
    for file in results['unused_files']:
        ext = os.path.splitext(file)[1]
        file_types[ext] += 1

    print(f"\n{BOLD}Unused Files by Type:{RESET}")
    for ext, count in sorted(file_types.items()):
        print(f"{ext}: {count} files")

    # Directory statistics
    print(f"\n{BOLD}Unused Files by Directory:{RESET}")
    for dir_name, files in sorted(results["unused_by_directory"].items()):
        print(f"\n{dir_name}/")
        for f in sorted(files):
            print(f"  - {f}")

def configure_settings():
    """Configure analysis settings."""
    print(f"\n{CYAN}{BOLD}Configure Settings{RESET}")

    settings = {
        'extensions': input(f"\n{BOLD}File extensions to analyze (comma-separated) [{', '.join(DEFAULT_EXTENSIONS)}]:{RESET} ").strip() or DEFAULT_EXTENSIONS,
        'exclude_dirs': input(f"\n{BOLD}Directories to exclude (comma-separated) [{', '.join(DEFAULT_EXCLUDE)}]:{RESET} ").strip() or DEFAULT_EXCLUDE,
        'parallel_jobs': int(input(f"\n{BOLD}Number of parallel jobs [{os.cpu_count()}]:{RESET} ").strip() or os.cpu_count()),
    }

    # Save settings to a config file
    with open('file_analyzer_config.json', 'w') as f:
        json.dump(settings, f, indent=2)

    print(f"\n{GREEN}Settings saved to file_analyzer_config.json{RESET}")
    return settings

def parse_tsconfig(project_root: str) -> Dict:
    """Parse tsconfig.json to get path aliases."""
    tsconfig_path = os.path.join(project_root, 'tsconfig.json')
    if not os.path.exists(tsconfig_path):
        return {}

    try:
        with open(tsconfig_path, 'r') as f:
            tsconfig = json.load(f)
            paths = tsconfig.get('compilerOptions', {}).get('paths', {})
            return paths
    except Exception as e:
        print(f"{YELLOW}Warning: Could not parse tsconfig.json: {e}{RESET}")
        return {}

def is_nextjs_special_file(file_path: str) -> bool:
    """Check if file is a Next.js special file that should always be considered used."""
    special_files = {
        'page.tsx', 'page.ts',
        'layout.tsx', 'layout.ts',
        'loading.tsx', 'loading.ts',
        'error.tsx', 'error.ts',
        'route.tsx', 'route.ts',
        'middleware.ts',
        'not-found.tsx',
    }
    return os.path.basename(file_path) in special_files

def parse_arguments():
    parser = argparse.ArgumentParser(
        description="Find unused files in a Next.js TypeScript project"
    )
    parser.add_argument(
        "--files",
        nargs="+",
        default=["tsx", "ts"],
        help="File extensions to check for unused files (default: tsx ts)"
    )
    parser.add_argument(
        "--exclude",
        nargs="+",
        default=["node_modules", ".next", ".git", "dist", "build"],
        help="Directories to exclude from the search (default: node_modules .next .git dist build)"
    )
    parser.add_argument(
        "--dir",
        default=".",
        help="Root directory to start the search from (default: current directory)"
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Print detailed information during the search"
    )
    parser.add_argument(
        "--jobs",
        type=int,
        default=os.cpu_count(),
        help="Number of parallel jobs for processing (default: number of CPU cores)"
    )
    return parser.parse_args()

def find_all_files(root_dir: str, extensions: List[str], exclude_dirs: List[str]) -> List[str]:
    """Find all files with the specified extensions in the given directory."""
    all_files = []
    exclude_dirs = set(exclude_dirs)

    for root, dirs, files in os.walk(root_dir):
        # Skip excluded directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs]

        for file in files:
            file_ext = file.split('.')[-1]
            if file_ext in extensions:
                file_path = os.path.join(root, file)
                # Skip test files as they're not meant to be imported
                if not any(part.startswith('__tests__') or part.endswith('.test') or part.endswith('.spec')
                          for part in file_path.split(os.sep)):
                    all_files.append(file_path)

    return all_files

def normalize_path(path: str) -> str:
    """Normalize a file path for consistent comparison."""
    return os.path.normpath(path)

def resolve_alias_path(import_path: str, aliases: Dict[str, List[str]], project_root: str) -> List[str]:
    """Resolve an import path using tsconfig aliases."""
    potential_paths = []

    for alias, paths in aliases.items():
        alias = alias.replace('/*', '')
        if import_path.startswith(alias):
            relative_path = import_path[len(alias):].lstrip('/')
            for base_path in paths:
                base_path = base_path.replace('/*', '')
                full_path = os.path.join(project_root, base_path, relative_path)
                potential_paths.append(normalize_path(full_path))

    return potential_paths

def find_imports_in_file(file_path: str, aliases: Dict) -> Set[str]:
    """Find all imports in a file."""
    imports = set()
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

            # Look for various import patterns
            patterns = [
                # Relative imports
                r'from\s+[\'"](\.[^\'"]+)[\'"]',
                r'import\s+[^\'";]+\s+from\s+[\'"](\.[^\'"]+)[\'"]',
                r'import\s+[\'"](\.[^\'"]+)[\'"]',
                r'require\([\'"](\.[^\'")]+)[\'"]\)',

                # Absolute imports (including alias paths)
                r'from\s+[\'"](@[^\'"]+)[\'"]',
                r'import\s+[^\'";]+\s+from\s+[\'"](@[^\'"]+)[\'"]',
                r'from\s+[\'"]([^\'".][^\'"]+)[\'"]',  # Non-relative imports
                r'import\s+[^\'";]+\s+from\s+[\'"]([^\'".][^\'"]+)[\'"]',  # Non-relative imports

                # Dynamic imports
                r'import\([\'"](\.[^\'"]+)[\'"]\)',
                r'import\([\'"](@[^\'"]+)[\'"]\)',

                # Special handling for UI component imports
                r'from\s+[\'"](@/shared/components/ui/[^\'"]+/[^\'"]+)[\'"]',
                r'import\s+[^\'";]+\s+from\s+[\'"](@/shared/components/ui/[^\'"]+/[^\'"]+)[\'"]',
                r'from\s+[\'"](@/components/ui/[^\'"]+/[^\'"]+)[\'"]',
                r'import\s+[^\'";]+\s+from\s+[\'"](@/components/ui/[^\'"]+/[^\'"]+)[\'"]'
            ]

            for pattern in patterns:
                matches = re.findall(pattern, content)
                for match in matches:
                    if isinstance(match, tuple):
                        match = match[0]
                    # Clean up UI component paths
                    if '/ui/index.ts/' in match:
                        match = match.replace('/index.ts/', '/')
                    imports.add(match)

            # Look for re-exports
            re_export_patterns = [
                r'export\s+\*\s+from\s+[\'"]([^\'"]+)[\'"]',
                r'export\s+{\s*[^}]+\s*}\s+from\s+[\'"]([^\'"]+)[\'"]',
            ]

            for pattern in re_export_patterns:
                matches = re.findall(pattern, content)
                imports.update(matches)

    except Exception as e:
        print(f"{RED}Error reading {file_path}: {str(e)}{RESET}")

    return imports

def resolve_import_path(base_dir: str, import_path: str, extensions: List[str], aliases: Dict) -> List[str]:
    """Resolve a relative import path to absolute file paths."""
    potential_paths = []

    # Handle absolute imports with aliases
    if import_path.startswith('@'):
        potential_paths.extend(resolve_alias_path(import_path, aliases, os.path.dirname(base_dir)))
    else:
        # Handle relative imports
        base_dir = os.path.dirname(base_dir)
        normalized_import = normalize_path(os.path.join(base_dir, import_path))

        # Case 1: Direct file reference
        for ext in extensions:
            if import_path.endswith(f'.{ext}'):
                potential_paths.append(normalized_import)
                break
            else:
                potential_paths.append(f"{normalized_import}.{ext}")

        # Case 2: Directory with index file
        for ext in extensions:
            potential_paths.append(normalize_path(os.path.join(normalized_import, f"index.{ext}")))

    return potential_paths

def process_file(args: Tuple[str, List[str], Dict, List[str]]) -> Set[str]:
    """Process a single file to find its imports. Used for parallel processing."""
    file_path, extensions, aliases, normalized_all_files = args
    imports = find_imports_in_file(file_path, aliases)
    imported_files = set()

    for import_path in imports:
        potential_paths = resolve_import_path(file_path, import_path, extensions, aliases)
        for path in potential_paths:
            if path in normalized_all_files:
                imported_files.add(path)

    return imported_files

def find_unused_files(args):
    extensions = args.files
    exclude_dirs = args.exclude
    root_dir = args.dir
    verbose = args.verbose
    n_jobs = args.jobs

    print(f"Searching for unused files with extensions: {', '.join(extensions)}")
    print(f"Excluding directories: {', '.join(exclude_dirs)}")
    print(f"Starting from directory: {root_dir}")
    print(f"Using {n_jobs} parallel jobs")

    start_time = time.time()

    # Parse tsconfig.json for aliases
    aliases = parse_tsconfig(root_dir)

    # Step 1: Find all files
    all_files = find_all_files(root_dir, extensions, exclude_dirs)
    normalized_all_files = [normalize_path(f) for f in all_files]

    if verbose:
        print(f"Found {len(all_files)} files to analyze")

    # Step 2: Process files in parallel
    imported_files = set()
    with ProcessPoolExecutor(max_workers=n_jobs) as executor:
        process_args = [(f, extensions, aliases, normalized_all_files) for f in all_files]
        results = list(executor.map(process_file, process_args))

        for result in results:
            imported_files.update(result)

    # Step 3: Find unused files
    used_files = set(normalized_all_files) & imported_files
    unused_files = set()

    # Consider Next.js special files as used
    for file in set(normalized_all_files) - imported_files:
        if not is_nextjs_special_file(file):
            unused_files.add(file)

    # Convert back to relative paths
    root_abs_path = os.path.abspath(root_dir)
    unused_files_rel = [os.path.relpath(f, root_abs_path) for f in unused_files]
    used_files_rel = [os.path.relpath(f, root_abs_path) for f in used_files]

    # Results
    end_time = time.time()
    duration = end_time - start_time

    print("\n=== RESULTS ===")
    print(f"Total files analyzed: {len(all_files)}")
    print(f"Files that are imported: {len(used_files)}")
    print(f"Files that are NOT imported anywhere: {len(unused_files)}")
    print(f"Time taken: {duration:.2f} seconds")

    if unused_files_rel:
        print("\nUnused files:")
        for f in sorted(unused_files_rel):
            print(f"  - {f}")

        # Group unused files by directory for better analysis
        unused_by_dir = defaultdict(list)
        for f in unused_files_rel:
            dir_name = os.path.dirname(f) or '.'
            unused_by_dir[dir_name].append(os.path.basename(f))

        print("\nUnused files by directory:")
        for dir_name, files in sorted(unused_by_dir.items()):
            print(f"\n{dir_name}/")
            for f in sorted(files):
                print(f"  - {f}")
    else:
        print("\nAll files are being imported somewhere!")

    # Return data for potential further use
    return {
        "total_files": len(all_files),
        "used_files": used_files_rel,
        "unused_files": unused_files_rel,
        "duration": duration,
        "unused_by_directory": {
            dir_name: files for dir_name, files in unused_by_dir.items()
        } if 'unused_by_dir' in locals() else {}
    }

def main():
    print_banner()

    while True:
        choice = print_menu()

        if choice == '1':
            args = parse_arguments()
            results = find_unused_files(args)
            print(f"\n{GREEN}Analysis complete! Use other menu options to manage results.{RESET}")

        elif choice == '2':
            if 'results' not in locals():
                print(f"{YELLOW}Please run analysis first (Option 1){RESET}")
                continue
            interactive_cleanup(results['unused_files'])

        elif choice == '3':
            if 'results' not in locals():
                print(f"{YELLOW}Please run analysis first (Option 1){RESET}")
                continue
            archive_dir = "archived_files"
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            for file in results['unused_files']:
                archive_path = os.path.join(archive_dir, timestamp, os.path.dirname(file))
                os.makedirs(archive_path, exist_ok=True)
                try:
                    shutil.move(file, os.path.join(archive_path, os.path.basename(file)))
                    print(f"{GREEN}Archived: {file}{RESET}")
                except Exception as e:
                    print(f"{RED}Error archiving {file}: {str(e)}{RESET}")

        elif choice == '4':
            if 'results' not in locals():
                print(f"{YELLOW}Please run analysis first (Option 1){RESET}")
                continue
            generate_html_report(results)

        elif choice == '5':
            if 'results' not in locals():
                print(f"{YELLOW}Please run analysis first (Option 1){RESET}")
                continue
            show_statistics(results)

        elif choice == '6':
            settings = configure_settings()
            print("Settings updated. Please run analysis again with new settings.")

        elif choice == '7':
            show_help()

        elif choice == '8':
            print(f"\n{GREEN}Goodbye!{RESET}")
            break

        else:
            print(f"{RED}Invalid choice. Please try again.{RESET}")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n{YELLOW}Program interrupted by user. Goodbye!{RESET}")
    except Exception as e:
        print(f"\n{RED}An error occurred: {str(e)}{RESET}")
        sys.exit(1)
