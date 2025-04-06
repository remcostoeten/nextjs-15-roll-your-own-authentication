#!/usr/bin/env python3
"""
Script to find unused files in a Next.js TypeScript project.
It checks which .tsx and .ts files are not imported anywhere in the project.
"""

import os
import re
import argparse
from collections import defaultdict
import sys
from typing import List, Set, Dict, Tuple
import time

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
    return parser.parse_args()

def find_all_files(root_dir: str, extensions: List[str], exclude_dirs: List[str]) -> List[str]:
    """Find all files with the specified extensions in the given directory."""
    all_files = []
    
    for root, dirs, files in os.walk(root_dir):
        # Skip excluded directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for file in files:
            file_ext = file.split('.')[-1]
            if file_ext in extensions:
                all_files.append(os.path.join(root, file))
    
    return all_files

def normalize_path(path: str) -> str:
    """Normalize a file path for consistent comparison."""
    return os.path.normpath(path)

def find_imports_in_file(file_path: str) -> Set[str]:
    """Find all imports in a file."""
    imports = set()
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Look for import statements with relative paths
            patterns = [
                r'from\s+[\'"](\.[^\'"]+)[\'"]',  # from './path/file'
                r'import\s+[^\'";]+\s+from\s+[\'"](\.[^\'"]+)[\'"]',  # import X from './path/file'
                r'import\s+[\'"](\.[^\'"]+)[\'"]',  # import './path/file'
                r'require\([\'"](\.[^\'")]+)[\'"]\)'  # require('./path/file')
            ]
            
            for pattern in patterns:
                matches = re.findall(pattern, content)
                for match in matches:
                    imports.add(match)
    except Exception as e:
        print(f"Error reading {file_path}: {str(e)}")
    
    return imports

def resolve_import_path(base_dir: str, import_path: str, extensions: List[str]) -> List[str]:
    """Resolve a relative import path to absolute file paths."""
    base_dir = os.path.dirname(base_dir)
    
    # Handle the path without extension
    normalized_import = normalize_path(os.path.join(base_dir, import_path))
    
    potential_paths = []
    
    # Case 1: Direct file reference
    for ext in extensions:
        # Check if the import path already has an extension
        if import_path.endswith(f'.{ext}'):
            potential_paths.append(normalized_import)
            break
        else:
            potential_paths.append(f"{normalized_import}.{ext}")
    
    # Case 2: Directory with index file
    for ext in extensions:
        potential_paths.append(normalize_path(os.path.join(normalized_import, f"index.{ext}")))
    
    return potential_paths

def find_unused_files(args):
    extensions = args.files
    exclude_dirs = args.exclude
    root_dir = args.dir
    verbose = args.verbose
    
    print(f"Searching for unused files with extensions: {', '.join(extensions)}")
    print(f"Excluding directories: {', '.join(exclude_dirs)}")
    print(f"Starting from directory: {root_dir}")
    
    start_time = time.time()
    
    # Step 1: Find all files with the specified extensions
    all_files = find_all_files(root_dir, extensions, exclude_dirs)
    normalized_all_files = [normalize_path(f) for f in all_files]
    
    if verbose:
        print(f"Found {len(all_files)} files to analyze")
    
    # Keep track of files that are imported
    imported_files = set()
    
    # Step 2: Check each file for imports
    for i, file_path in enumerate(all_files):
        if verbose:
            progress = (i + 1) / len(all_files) * 100
            print(f"Analyzing file {i+1}/{len(all_files)} ({progress:.1f}%): {file_path}", end="\r")
        
        imports = find_imports_in_file(file_path)
        
        for import_path in imports:
            potential_paths = resolve_import_path(file_path, import_path, extensions)
            
            for path in potential_paths:
                if path in normalized_all_files:
                    imported_files.add(path)
    
    if verbose:
        print("\n")
    
    # Step 3: Find unused files
    used_files = set(normalized_all_files) & imported_files
    unused_files = set(normalized_all_files) - imported_files
    
    # Convert back to relative paths from the project root
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
    else:
        print("\nAll files are being imported somewhere!")
    
    # Return data for potential further use
    return {
        "total_files": len(all_files),
        "used_files": used_files_rel,
        "unused_files": unused_files_rel,
        "duration": duration
    }

def main():
    args = parse_arguments()
    results = find_unused_files(args)
    
    # You could optionally save results to a file
    # with open('unused_files_report.txt', 'w') as f:
    #     f.write(f"Unused files ({len(results['unused_files'])}):\n")
    #     for file in sorted(results['unused_files']):
    #         f.write(f"{file}\n")

if __name__ == "__main__":
    main()