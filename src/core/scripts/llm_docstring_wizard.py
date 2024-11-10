#!/usr/bin/env python3

import os
import json
import requests
from typing import Optional, Dict, Tuple
import re
from pathlib import Path

class LLMDocGenerator:
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url
        self.model = "codellama"  # Default to codellama for code understanding
        
    def _call_llm(self, prompt: str) -> str:
        """Make a request to the local LLM."""
        try:
            response = requests.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False
                }
            )
            return response.json()["response"]
        except Exception as e:
            print(f"{RED}Error calling LLM: {str(e)}{RESET}")
            return ""

    def analyze_component(self, file_path: str) -> Dict[str, any]:
        """Analyze the component and return its structure."""
        with open(file_path, 'r') as f:
            content = f.read()
            
        # Ask LLM to analyze the component
        prompt = f"""
        Analyze this React component and extract key information:
        {content}
        
        Return a JSON object with:
        - componentType: main component type
        - subComponents: list of sub-components if any
        - props: list of props and their types
        - description: brief technical description
        """
        
        analysis = self._call_llm(prompt)
        try:
            return json.loads(analysis)
        except:
            return {"error": "Failed to analyze component"}

    def generate_description(self, file_content: str, detail_level: str) -> str:
        """Generate component description based on detail level."""
        detail_prompts = {
            'short': "Write a one-line description of this React component.",
            'normal': "Write a clear, paragraph-length description of this React component, including its main purpose and key features.",
            'advanced': """Write a detailed technical description of this React component, including:
                         1. Main purpose
                         2. Key features and functionality
                         3. Props and customization options
                         4. Usage considerations
                         5. Any dependencies or requirements"""
        }
        
        prompt = f"""
        Based on this React component:
        {file_content}
        
        {detail_prompts[detail_level]}
        Return only the description text, no formatting.
        """
        
        return self._call_llm(prompt)

    def generate_example(self, file_content: str, example_type: str) -> str:
        """Generate usage examples based on type."""
        example_prompts = {
            'basic': """Create a simple, basic example of how to use this component with minimal props.""",
            'common': """Create a practical example showing common usage patterns and typical props.""",
            'advanced': """Create an advanced example showing:
                         1. Multiple component variations
                         2. Common use cases
                         3. Prop combinations
                         4. Integration with other components
                         Include comments explaining key points."""
        }
        
        prompt = f"""
        Based on this React component:
        {file_content}
        
        {example_prompts[example_type]}
        Return the example as a JSX code block with imports.
        """
        
        return self._call_llm(prompt)

def interactive_doc_generation(file_path: str) -> Tuple[str, str]:
    """Interactive documentation generation process."""
    generator = LLMDocGenerator()
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Analyze component
    print(f"\n{CYAN}Analyzing component...{RESET}")
    analysis = generator.analyze_component(file_path)
    
    # Show component info
    print(f"\n{GREEN}Component Analysis:{RESET}")
    print(f"Type: {analysis.get('componentType', 'Unknown')}")
    if analysis.get('subComponents'):
        print("Sub-components:", ', '.join(analysis['subComponents']))
    
    # Get description detail level
    print(f"\n{YELLOW}Choose description detail level:{RESET}")
    print(f"{CYAN}1. Short{RESET} - One-line description")
    print(f"{CYAN}2. Normal{RESET} - Paragraph with main features")
    print(f"{CYAN}3. Advanced{RESET} - Detailed technical description")
    
    while True:
        choice = input(f"\n{CYAN}Select detail level (1-3):{RESET} ").strip()
        if choice in {'1', '2', '3'}:
            detail_level = {
                '1': 'short',
                '2': 'normal',
                '3': 'advanced'
            }[choice]
            break
        print(f"{RED}Invalid choice. Please select 1, 2, or 3.{RESET}")
    
    # Generate description
    description = generator.generate_description(content, detail_level)
    
    # Ask about examples
    print(f"\n{YELLOW}Would you like to generate usage examples?{RESET}")
    print(f"{CYAN}1. Basic{RESET} - Simple usage example")
    print(f"{CYAN}2. Common{RESET} - Typical use cases")
    print(f"{CYAN}3. Advanced{RESET} - Complex examples with multiple features")
    print(f"{CYAN}4. No examples{RESET}")
    
    while True:
        choice = input(f"\n{CYAN}Select example type (1-4):{RESET} ").strip()
        if choice in {'1', '2', '3', '4'}:
            if choice == '4':
                example = ""
            else:
                example_type = {
                    '1': 'basic',
                    '2': 'common',
                    '3': 'advanced'
                }[choice]
                example = generator.generate_example(content, example_type)
            break
        print(f"{RED}Invalid choice. Please select 1-4.{RESET}")
    
    return description, example

def main():
    # ... (rest of your existing main function)
    # Add this before generating docs:
    description, example = interactive_doc_generation(selected_file_path)
    
    # Then use these values with your existing doc_utility.py:
    cmd = [
        'python3',
        doc_utility_path,
        '-i', selected_file_path,
        '-d', description,
    ]
    
    if example:
        # Save example to a temporary file and read it
        with open('temp_example.txt', 'w') as f:
            f.write(example)
        cmd.extend(['-e'])

if __name__ == "__main__":
    main()
