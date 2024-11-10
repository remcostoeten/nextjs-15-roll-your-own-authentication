#!/usr/bin/env python3

import argparse
import os
import sys
import time
import shutil
from typing import Optional
from datetime import datetime

class DocUtility:
    def __init__(self):
        self.blocks_added = 0
        self.start_time = time.time()

    def validate_file(self, file_path: str) -> bool:
        """
        Validates if the file exists and has the correct extension.
        
        @param file_path: Path to the file to validate
        @returns: Boolean indicating if file is valid
        """
        if not os.path.exists(file_path):
            print(f"Error: File '{file_path}' does not exist.")
            return False
        
        if not file_path.endswith(('.ts', '.tsx')):
            print("Error: File must be a TypeScript (.ts) or TSX (.tsx) file.")
            return False
        
        return True

    def create_backup(self, file_path: str) -> str:
        """
        Creates a backup of the original file.
        
        @param file_path: Path to the file to backup
        @returns: Path to the backup file
        """
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_path = f"{file_path}.{timestamp}.bak"
        shutil.copy2(file_path, backup_path)
        return backup_path

    def add_description(self, content: str, description: str) -> str:
        """
        Adds a description block at the start of the file.
        
        @param content: Original file content
        @param description: Description to add
        @returns: Modified content
        """
        doc_block = f"""/**
 * @description {description}
 * 
 */

"""
        self.blocks_added += 1
        return doc_block + content

    def add_example(self, content: str) -> str:
        """
        Adds an example block at the end of the file.
        
        @param content: Original file content
        @returns: Modified content
        """
        doc_block = """

/**
 * @example
 * 
 */
"""
        self.blocks_added += 1
        return content + doc_block

    def process_file(self, file_path: str, description: Optional[str], add_example: bool) -> bool:
        """
        Processes the file and adds the requested documentation blocks.
        
        @param file_path: Path to the file to process
        @param description: Optional description to add
        @param add_example: Whether to add an example block
        @returns: Boolean indicating success
        """
        try:
            # Create backup
            backup_path = self.create_backup(file_path)
            
            # Read file
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Add documentation blocks
            if description:
                content = self.add_description(content, description)
                print("✓ Added description block at start of file")
            
            if add_example:
                content = self.add_example(content)
                print("✓ Added example block at end of file")
            
            # Write modified content
            with open(file_path, 'w', encoding='utf-8', newline='') as f:
                f.write(content)
            
            return True
            
        except Exception as e:
            print(f"Error processing file: {str(e)}")
            # Restore backup if exists
            if os.path.exists(backup_path):
                shutil.copy2(backup_path, file_path)
            return False

    def print_statistics(self, file_path: str) -> None:
        """
        Prints processing statistics.
        
        @param file_path: Path to the processed file
        """
        processing_time = time.time() - self.start_time
        file_size = os.path.getsize(file_path) / 1024  # Convert to KB
        file_type = 'TSX' if file_path.endswith('.tsx') else 'TS'

        print("\nStatistics:")
        print(f"- Blocks added: {self.blocks_added}")
        print(f"- File type: {file_type}")
        print(f"- File size: {file_size:.1f}KB")
        print(f"- Processing time: {processing_time:.2f}s")

def main():
    parser = argparse.ArgumentParser(
        description="TypeScript/TSX documentation utility",
        formatter_class=argparse.RawTextHelpFormatter
    )
    
    parser.add_argument('-i', '--input', required=True, help="Input file path (.ts or .tsx)")
    parser.add_argument('-d', '--description', help="Add description block with provided text")
    parser.add_argument('-e', '--example', action='store_true', help="Add example block")
    
    args = parser.parse_args()
    
    utility = DocUtility()
    
    print(f"Processing file: {args.input}")
    
    if not utility.validate_file(args.input):
        sys.exit(1)
    
    if utility.process_file(args.input, args.description, args.example):
        utility.print_statistics(args.input)
        print("\nOperation completed successfully!")
    else:
        print("\nOperation failed!")
        sys.exit(1)

if __name__ == "__main__":
    main() 
