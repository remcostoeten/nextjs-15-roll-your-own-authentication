import os
import re
import sys
import subprocess

# Check if curses is available (for Unix/Linux/macOS)
try:
    import curses
    curses_available = True
except ImportError:
    curses_available = False
    # For Windows, try to use windows-curses
    try:
        check_and_install_package("windows-curses")
        import curses
        curses_available = True
    except:
        print("Curses library not available. Arrow key selection will be disabled.")

# Function to check and install packages (if needed)
def check_and_install_package(package):
    try:
        __import__(package)
    except ImportError:
        print(f"Package {package} is missing. Installing...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])

# Function to check if a page has metadata
def has_metadata(page_content):
    # Check for metadata in App Router format (export const metadata = {...})
    app_router_pattern = r'export\s+const\s+metadata\s*='
    # Check for metadata in Pages Router format (comments or Head component)
    pages_router_pattern = r'<!--.*?metadata.*?-->|<Head>.*?<title>'
    # Check for imported metadata
    imported_metadata_pattern = r'import\s+\{\s*(default)?metadata\s*\}'
    
    return (re.search(app_router_pattern, page_content) is not None or 
            re.search(pages_router_pattern, page_content) is not None or
            re.search(imported_metadata_pattern, page_content) is not None)

# Function to recursively scan for pages and identify metadata
def scan_pages_for_metadata(directory):
    missing_metadata_pages = []
    
    # Walk through the directory
    for root, dirs, files in os.walk(directory):
        for file in files:
            # Check both .tsx and .jsx files that might be pages
            if file.endswith((".tsx", ".jsx")) and (file == "page.tsx" or file == "page.jsx" or "pages" in root):
                page_path = os.path.join(root, file)
                try:
                    with open(page_path, "r", encoding="utf-8") as f:
                        content = f.read()
                        
                        if not has_metadata(content):
                            missing_metadata_pages.append(page_path)
                except Exception as e:
                    print(f"Error reading {page_path}: {e}")
    
    return missing_metadata_pages

# Function to add metadata to a page
def add_metadata_to_page(page_path):
    title = input(f"Enter custom page title for {page_path}: ")
    description = input(f"Enter description for {page_path} (optional): ")
    
    # Read the current content of the page
    with open(page_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Determine if it's an App Router page or Pages Router page
    is_app_router = "app" in page_path and (page_path.endswith("/page.tsx") or page_path.endswith("/page.jsx"))
    
    if is_app_router:
        # Add metadata in App Router format with SEO optimizations
        metadata = f'''
export const metadata = {{
  title: "{title}",
  description: "{description}",
  openGraph: {{
    title: "{title}",
    description: "{description}",
    type: "website",
  }},
  twitter: {{
    card: "summary_large_image",
    title: "{title}",
    description: "{description}",
  }},
}};

'''
        # Find a good position to insert the metadata (after imports but before component)
        import_pattern = r'import.*?[\r\n]+'
        matches = list(re.finditer(import_pattern, content))
        
        if matches:
            last_import_end = matches[-1].end()
            new_content = content[:last_import_end] + "\n" + metadata + content[last_import_end:]
        else:
            new_content = metadata + content
    else:
        # Add metadata in Pages Router format (as a comment)
        metadata = f"<!-- metadata: title=\"{title}\" description=\"{description}\" -->\n"
        new_content = metadata + content
    
    # Write the new content back to the file
    with open(page_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Metadata added to {page_path}")

# Function to add metadata using the config file
def add_config_metadata_to_page(page_path, project_root):
    # Read the current content of the page
    with open(page_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Check if it's an App Router page
    is_app_router = "app" in page_path and (page_path.endswith("/page.tsx") or page_path.endswith("/page.jsx"))
    
    if not is_app_router:
        print(f"Warning: {page_path} doesn't appear to be an App Router page. Metadata config import may not work correctly.")
    
    # Ask if user wants default metadata or custom
    use_default = input("Use default metadata? (y/n): ").strip().lower() == "y"
    
    # Check if Metadata type is already imported
    metadata_import_exists = re.search(r'import\s+(\{\s*Metadata\s*\}|type\s*\{\s*Metadata\s*\})', content) is not None
    
    # Check if the metadata config is already imported
    config_import_exists = re.search(r'import\s+\{\s*(defaultMetadata|getPageMetadata)\s*\}', content) is not None
    
    # Prepare the new imports if needed
    new_imports = ""
    if not metadata_import_exists:
        new_imports += 'import { Metadata } from "next"\n'
    
    if not config_import_exists:
        if use_default:
            new_imports += 'import { defaultMetadata } from "@/src/core/config/metadata"\n'
        else:
            new_imports += 'import { getPageMetadata } from "@/src/core/config/metadata"\n'
    
    # Prepare the metadata export statement
    if use_default:
        metadata_export = 'export const metadata: Metadata = defaultMetadata\n\n'
    else:
        title = input("Enter page title: ")
        description = input("Enter page description (optional, press Enter to skip): ")
        
        if description:
            metadata_export = f'export const metadata: Metadata = getPageMetadata("{title}", "{description}")\n\n'
        else:
            metadata_export = f'export const metadata: Metadata = getPageMetadata("{title}")\n\n'
    
    # Check if metadata already exists in the file
    if re.search(r'export\s+const\s+metadata', content):
        print(f"Warning: Metadata already exists in {page_path}. Replacing it.")
        # Replace existing metadata
        new_content = re.sub(
            r'export\s+const\s+metadata\s*=\s*[^;]*;?', 
            metadata_export.strip(), 
            content
        )
    else:
        # Find where to insert the new imports and metadata
        if new_imports:
            # Find the last import statement
            import_pattern = r'import.*?[\r\n]+'
            matches = list(re.finditer(import_pattern, content))
            
            if matches:
                last_import_end = matches[-1].end()
                content = content[:last_import_end] + new_imports + content[last_import_end:]
        
        # Find where to insert the metadata export (after all imports)
        lines = content.split('\n')
        import_section_end = 0
        
        for i, line in enumerate(lines):
            if line.strip().startswith('import '):
                import_section_end = i + 1
            elif line.strip() and not line.startswith('//') and import_section_end > 0:
                break
        
        # Insert the metadata export after the imports
        lines.insert(import_section_end, metadata_export)
        new_content = '\n'.join(lines)
    
    # Write the new content back to the file
    with open(page_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    
    print(f"Metadata from config added to {page_path}")

# Function to get all pages in a directory
def get_all_pages(directory):
    pages = []
    
    # Walk through the directory
    for root, dirs, files in os.walk(directory):
        for file in files:
            # Check both .tsx and .jsx files that might be pages
            if file.endswith((".tsx", ".jsx")) and (file == "page.tsx" or file == "page.jsx" or "pages" in root):
                page_path = os.path.join(root, file)
                pages.append(page_path)
    
    return pages

# Function to select a page using arrow keys
def select_page_with_arrows(pages):
    if not curses_available or len(pages) == 0:
        # Fallback to simple selection if curses is not available
        for i, page in enumerate(pages):
            print(f"{i+1}. {page}")
        
        choice = 0
        while choice < 1 or choice > len(pages):
            try:
                choice = int(input("\nSelect a page (number): "))
                if choice < 1 or choice > len(pages):
                    print(f"Please enter a number between 1 and {len(pages)}")
            except ValueError:
                print("Please enter a valid number")
        
        return pages[choice-1]
    
    # Use curses for arrow key selection
    def _select_page(stdscr):
        curses.curs_set(0)  # Hide cursor
        current_row = 0
        
        # Get terminal dimensions
        max_y, max_x = stdscr.getmaxyx()
        
        # Calculate how many pages we can display at once
        display_count = min(max_y - 4, len(pages))
        start_idx = 0
        
        # Set up colors
        curses.start_color()
        curses.init_pair(1, curses.COLOR_BLACK, curses.COLOR_WHITE)  # Selected item
        
        while True:
            stdscr.clear()
            
            # Display title
            stdscr.addstr(0, 0, "Select a page using arrow keys (↑/↓) and press Enter:")
            stdscr.addstr(1, 0, "-" * (max_x - 1))
            
            # Display pages
            for i in range(display_count):
                idx = start_idx + i
                if idx >= len(pages):
                    break
                    
                page_display = pages[idx]
                # Truncate if too long for display
                if len(page_display) > max_x - 5:
                    page_display = "..." + page_display[-(max_x - 8):]
                
                if idx == current_row:
                    stdscr.attron(curses.color_pair(1))
                    stdscr.addstr(i + 2, 0, f"> {page_display}")
                    stdscr.attroff(curses.color_pair(1))
                else:
                    stdscr.addstr(i + 2, 0, f"  {page_display}")
            
            # Display scrolling indicators if needed
            if start_idx > 0:
                stdscr.addstr(2, max_x - 3, "↑")
            if start_idx + display_count < len(pages):
                stdscr.addstr(min(display_count + 1, max_y - 1), max_x - 3, "↓")
            
            stdscr.refresh()
            
            # Handle key presses
            key = stdscr.getch()
            
            if key == curses.KEY_UP and current_row > 0:
                current_row -= 1
                # Scroll up if needed
                if current_row < start_idx:
                    start_idx = current_row
            elif key == curses.KEY_DOWN and current_row < len(pages) - 1:
                current_row += 1
                # Scroll down if needed
                if current_row >= start_idx + display_count:
                    start_idx = current_row - display_count + 1
            elif key == curses.KEY_ENTER or key in [10, 13]:  # Enter key
                return pages[current_row]
    
    # Run the curses application
    return curses.wrapper(_select_page)

# Function to check if metadata.ts file is valid
def validate_metadata_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
            # Check for defaultMetadata export
            if not re.search(r'export\s+const\s+defaultMetadata', content):
                print("Warning: defaultMetadata export not found in metadata.ts")
                return False
            
            # Check for getPageMetadata function
            if not re.search(r'export\s+const\s+getPageMetadata', content):
                print("Warning: getPageMetadata function not found in metadata.ts")
                return False
            
            return True
    except Exception as e:
        print(f"Error validating metadata file: {e}")
        return False

# Function to get project root directory
def get_project_root():
    # Try to find the project root by looking for package.json, next.config.js, etc.
    current_dir = os.getcwd()
    
    while True:
        if (os.path.exists(os.path.join(current_dir, "package.json")) or 
            os.path.exists(os.path.join(current_dir, "next.config.js"))):
            return current_dir
        
        parent_dir = os.path.dirname(current_dir)
        if parent_dir == current_dir:  # Reached the root directory
            return os.getcwd()  # Default to current directory
        
        current_dir = parent_dir

# Function to clean metadata file content
def clean_metadata_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Remove inappropriate language
        cleaned_content = re.sub(r'\b(motherfucking|fuck|shit|ass)\b', '', content)
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(cleaned_content)
        
        print("Metadata file cleaned of inappropriate language.")
    except Exception as e:
        print(f"Error cleaning metadata file: {e}")

# Main script
if __name__ == "__main__":
    project_root = get_project_root()
    
    # Check if both app and pages directories exist
    app_dir = os.path.join(project_root, "app")
    pages_dir = os.path.join(project_root, "pages")
    src_app_dir = os.path.join(project_root, "src", "app")
    
    has_app_dir = os.path.exists(app_dir)
    has_src_app_dir = os.path.exists(src_app_dir)
    has_pages_dir = os.path.exists(pages_dir)
    
    print(f"Project root detected as: {project_root}")
    
    if has_app_dir:
        print("App Router directory detected at /app")
    
    if has_src_app_dir:
        print("App Router directory detected at /src/app")
    
    if has_pages_dir:
        print("Pages Router directory detected at /pages")
    
    if not (has_app_dir or has_pages_dir or has_src_app_dir):
        print("Neither app/, src/app/, nor pages/ directories found. Please specify a custom directory.")
    
    # Main menu
    while True:
        print("\n=== Metadata Tool ===")
        print("1. Scan for missing metadata")
        print("2. Insert metadata from config")
        print("3. Exit")
        
        choice = 0
        while choice < 1 or choice > 3:
            try:
                choice = int(input("\nEnter your choice (number): "))
                if choice < 1 or choice > 3:
                    print("Please enter a number between 1 and 3")
            except ValueError:
                print("Please enter a valid number")
        
        if choice == 3:
            print("Exiting...")
            break
        
        # Option 1: Scan for missing metadata
        if choice == 1:
            # Ask the user which directory to scan
            print("\nWhich directory would you like to scan?")
            options = []
            
            if has_app_dir:
                options.append(("App Router directory (/app)", app_dir))
            
            if has_src_app_dir:
                options.append(("App Router directory (/src/app)", src_app_dir))
            
            if has_pages_dir:
                options.append(("Pages Router directory (/pages)", pages_dir))
            
            options.append(("Custom directory", None))
            
            for i, (name, _) in enumerate(options):
                print(f"{i+1}. {name}")
            
            dir_choice = 0
            while dir_choice < 1 or dir_choice > len(options):
                try:
                    dir_choice = int(input("\nEnter your choice (number): "))
                    if dir_choice < 1 or dir_choice > len(options):
                        print(f"Please enter a number between 1 and {len(options)}")
                except ValueError:
                    print("Please enter a valid number")
            
            selected_option = options[dir_choice-1]
            
            if selected_option[1] is None:  # Custom directory
                directory = input("Please specify the directory to scan: ").strip()
            else:
                directory = selected_option[1]
            
            print(f"\nScanning directory: {directory}")
            
            # Scan for missing metadata
            missing_metadata_pages = scan_pages_for_metadata(directory)
            
            if missing_metadata_pages:
                print("\nThe following pages are missing metadata:")
                for page in missing_metadata_pages:
                    print(f"- {page}")
                
                # Optionally add metadata to missing pages
                add_metadata_option = input("\nDo you want to add metadata to these pages? (y/n): ").strip().lower()
                if add_metadata_option == "y":
                    for page in missing_metadata_pages:
                        add_metadata_to_page(page)
            else:
                print("\nAll pages have metadata!")
        
        # Option 2: Insert metadata from config
        elif choice == 2:
            # Check if metadata config file exists
            metadata_config_path = os.path.join(project_root, "src", "core", "config", "metadata.ts")
            if not os.path.exists(metadata_config_path):
                print(f"\nMetadata config file not found at {metadata_config_path}")
                continue
            
            # Validate and clean the metadata file
            if validate_metadata_file(metadata_config_path):
                clean_metadata_file(metadata_config_path)
            else:
                print("Warning: The metadata.ts file may not be properly formatted.")
                continue_anyway = input("Continue anyway? (y/n): ").strip().lower()
                if continue_anyway != "y":
                    continue
            
            # Ask the user which directory to scan for pages
            print("\nWhich directory would you like to select pages from?")
            options = []
            
            if has_app_dir:
                options.append(("App Router directory (/app)", app_dir))
            
            if has_src_app_dir:
                options.append(("App Router directory (/src/app)", src_app_dir))
            
            if has_pages_dir:
                options.append(("Pages Router directory (/pages)", pages_dir))
            
            options.append(("Custom directory", None))
            
            for i, (name, _) in enumerate(options):
                print(f"{i+1}. {name}")
            
            dir_choice = 0
            while dir_choice < 1 or dir_choice > len(options):
                try:
                    dir_choice = int(input("\nEnter your choice (number): "))
                    if dir_choice < 1 or dir_choice > len(options):
                        print(f"Please enter a number between 1 and {len(options)}")
                except ValueError:
                    print("Please enter a valid number")
            
            selected_option = options[dir_choice-1]
            
            if selected_option[1] is None:  # Custom directory
                directory = input("Please specify the directory to scan for pages: ").strip()
            else:
                directory = selected_option[1]
            
            print(f"\nGetting pages from: {directory}")
            
            # Get all pages
            all_pages = get_all_pages(directory)
            
            if not all_pages:
                print("\nNo pages found in the selected directory.")
                continue
            
            # Let user select a page using arrow keys
            print(f"\nFound {len(all_pages)} pages. Select one to add metadata:")
            selected_page = select_page_with_arrows(all_pages)
            
            # Add metadata from config to the selected page
            add_config_metadata_to_page(selected_page, project_root)