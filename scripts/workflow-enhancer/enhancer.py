#!/usr/bin/env python3

import os
import json
import requests
import asyncio
import aiohttp
from typing import Optional, Dict, List, Union, Any, Tuple
from pathlib import Path
import subprocess
import re
from dataclasses import dataclass
import time
import sys
from enum import Enum
import argparse
import ast
from concurrent.futures import ThreadPoolExecutor
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ANSI Colors for better CLI output
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    END = '\033[0m'
    BOLD = '\033[1m'

@dataclass
class LLMConfig:
    """Configuration for local LLM."""
    base_url: str = "http://localhost:11434"
    model: str = "codellama"
    temperature: float = 0.3
    max_tokens: int = 1000
    timeout: int = 30

class LLMClient:
    """Client for interacting with local LLM."""
    
    def __init__(self, config: LLMConfig):
        self.config = config
        self.session = None
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()

    async def generate(self, prompt: str) -> str:
        """Generate response from local LLM."""
        try:
            async with self.session.post(
                f"{self.config.base_url}/api/generate",
                json={
                    "model": self.config.model,
                    "prompt": prompt,
                    "temperature": self.config.temperature,
                    "max_tokens": self.config.max_tokens
                },
                timeout=self.config.timeout
            ) as response:
                result = await response.json()
                return result.get("response", "").strip()
        except Exception as e:
            logger.error(f"LLM generation error: {str(e)}")
            return ""

class CommitAnalyzer:
    """Advanced git commit message generator."""
    
    def __init__(self, llm: LLMClient):
        self.llm = llm
        
    def _get_staged_files(self) -> List[str]:
        """Get list of staged files."""
        try:
            result = subprocess.check_output(['git', 'diff', '--cached', '--name-only']).decode('utf-8')
            return result.splitlines()
        except subprocess.CalledProcessError:
            return []

    def _get_file_diff(self, file_path: str) -> str:
        """Get diff for a specific file."""
        try:
            return subprocess.check_output(['git', 'diff', '--cached', file_path]).decode('utf-8')
        except subprocess.CalledProcessError:
            return ""

    def _analyze_changes(self, files: List[str]) -> Dict[str, Any]:
        """Analyze the nature of changes in staged files."""
        analysis = {
            'features': [],
            'fixes': [],
            'refactors': [],
            'files_by_type': {},
            'significant_changes': []
        }
        
        for file in files:
            ext = Path(file).suffix
            analysis['files_by_type'][ext] = analysis['files_by_type'].get(ext, 0) + 1
            
            diff = self._get_file_diff(file)
            if diff:
                # Analyze change significance
                added_lines = len(re.findall(r'^\+[^+]', diff, re.MULTILINE))
                removed_lines = len(re.findall(r'^-[^-]', diff, re.MULTILINE))
                
                if added_lines + removed_lines > 50:
                    analysis['significant_changes'].append(file)
                
                # Categorize changes
                if 'feat' in diff.lower() or 'feature' in diff.lower():
                    analysis['features'].append(file)
                elif 'fix' in diff.lower() or 'bug' in diff.lower():
                    analysis['fixes'].append(file)
                elif 'refactor' in diff.lower():
                    analysis['refactors'].append(file)
        
        return analysis

    async def generate_commit_message(self) -> Optional[str]:
        """Generate a comprehensive commit message."""
        files = self._get_staged_files()
        if not files:
            print(f"{Colors.WARNING}No staged changes found. Run 'git add' first.{Colors.END}")
            return None
            
        print(f"{Colors.CYAN}Analyzing changes in {len(files)} files...{Colors.END}")
        
        analysis = self._analyze_changes(files)
        
        # Create detailed prompt for LLM
        prompt = f"""Analyze these git changes and generate a commit message:

Files changed: {', '.join(files)}
Analysis:
- Features: {len(analysis['features'])}
- Fixes: {len(analysis['fixes'])}
- Refactors: {len(analysis['refactors'])}
- Significant changes in: {', '.join(analysis['significant_changes'])}

Generate a commit message that:
1. Follows conventional commits format (feat/fix/refactor/etc)
2. Is concise but descriptive
3. Includes scope if clear from changes
4. Mentions breaking changes if detected
5. Adds detailed body for significant changes

Staged changes summary:
"""
        
        # Add diff summaries for key files
        for file in files[:3]:  # Limit to 3 files to avoid token limits
            diff = self._get_file_diff(file)
            if diff:
                prompt += f"\n{file}:\n{diff[:500]}"

        message = await self.llm.generate(prompt)
        return message

class APISpecGenerator:
    """Advanced OpenAPI/Swagger specification generator."""
    
    def __init__(self, llm: LLMClient):
        self.llm = llm
        
    def _parse_route_file(self, file_path: str) -> Dict[str, Any]:
        """Parse route handler file for endpoints."""
        try:
            with open(file_path, 'r') as f:
                content = f.read()
                
            routes = {
                'endpoints': [],
                'imports': [],
                'models': [],
                'middleware': []
            }
            
            # Extract routes
            route_patterns = [
                r'@\w+\.(\w+)\([\'"]([^\'"]+)[\'"]\)',  # Decorators
                r'\w+\.(\w+)\([\'"]([^\'"]+)[\'"].*\)',  # Method calls
                r'router\.\w+\([\'"]([^\'"]+)[\'"]'      # Router definitions
            ]
            
            for pattern in route_patterns:
                matches = re.finditer(pattern, content)
                for match in matches:
                    if len(match.groups()) >= 2:
                        method, path = match.groups()
                    else:
                        path = match.group(1)
                        method = self._guess_method(content, path)
                    
                    routes['endpoints'].append({
                        'path': path,
                        'method': method.upper(),
                        'handler': self._find_handler(content, path)
                    })
            
            # Extract models/types
            type_matches = re.finditer(r'(interface|type|class)\s+(\w+)\s*{([^}]+)}', content)
            for match in type_matches:
                routes['models'].append({
                    'name': match.group(2),
                    'definition': match.group(3).strip()
                })
                
            return routes
            
        except Exception as e:
            logger.error(f"Error parsing route file: {str(e)}")
            return {'endpoints': [], 'models': []}

    def _guess_method(self, content: str, path: str) -> str:
        """Guess HTTP method from context."""
        context = content[max(0, content.find(path)-100):content.find(path)+100]
        methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
        for method in methods:
            if method.lower() in context.lower():
                return method
        return 'GET'

    def _find_handler(self, content: str, path: str) -> str:
        """Extract handler function for endpoint."""
        try:
            handler_match = re.search(
                rf'async\s+def\s+(\w+)\s*\([^)]*\)\s*(?:->\s*\w+\s*)?\s*:\s*(?:#[^\n]*)?\s*([^{{}}]+?)(?=\n\w+|$)',
                content
            )
            if handler_match:
                return handler_match.group(1)
        except Exception:
            pass
        return ""

    async def generate_spec(self, route_files: List[str]) -> str:
        """Generate OpenAPI specification from route files."""
        all_routes = []
        all_models = []
        
        for file_path in route_files:
            routes = self._parse_route_file(file_path)
            all_routes.extend(routes['endpoints'])
            all_models.extend(routes['models'])

        prompt = f"""Generate OpenAPI 3.0 specification for these endpoints:

Endpoints:
{json.dumps(all_routes, indent=2)}

Data Models:
{json.dumps(all_models, indent=2)}

Requirements:
1. Include detailed parameter descriptions
2. Add example requests/responses
3. Document authentication if present
4. Include error responses
5. Add schema validations
"""

        spec = await self.llm.generate(prompt)
        return spec

class CodeOptimizer:
    """Advanced code optimization suggester."""
    
    def __init__(self, llm: LLMClient):
        self.llm = llm
        
    def _analyze_code_metrics(self, content: str) -> Dict[str, Any]:
        """Analyze code for various metrics."""
        metrics = {
            'complexity': 0,
            'patterns': [],
            'imports': [],
            'functions': [],
            'classes': [],
            'potential_issues': []
        }
        
        try:
            tree = ast.parse(content)
            
            # Analyze imports
            metrics['imports'] = [node.names[0].name for node in ast.walk(tree) if isinstance(node, ast.Import)]
            
            # Function analysis
            for node in ast.walk(tree):
                if isinstance(node, ast.FunctionDef):
                    metrics['functions'].append({
                        'name': node.name,
                        'args': len(node.args.args),
                        'complexity': self._analyze_function_complexity(node)
                    })
                elif isinstance(node, ast.ClassDef):
                    metrics['classes'].append({
                        'name': node.name,
                        'methods': len([n for n in node.body if isinstance(n, ast.FunctionDef)])
                    })
            
            # Identify potential issues
            metrics['potential_issues'] = self._identify_issues(tree)
            
        except SyntaxError:
            # If Python parsing fails, try simpler analysis
            metrics['complexity'] = len(re.findall(r'\b(if|while|for|and|or)\b', content))
        
        return metrics
    
    def _analyze_function_complexity(self, node: ast.AST) -> int:
        """Calculate function complexity."""
        complexity = 1
        for child in ast.walk(node):
            if isinstance(child, (ast.If, ast.While, ast.For, ast.ExceptHandler)):
                complexity += 1
            elif isinstance(child, ast.BoolOp):
                complexity += len(child.values) - 1
        return complexity
    
    def _identify_issues(self, tree: ast.AST) -> List[Dict[str, str]]:
        """Identify potential code issues."""
        issues = []
        
        for node in ast.walk(tree):
            # Large function detection
            if isinstance(node, ast.FunctionDef) and len(node.body) > 20:
                issues.append({
                    'type': 'large_function',
                    'location': f'Function {node.name}',
                    'description': 'Function is too large, consider breaking it down'
                })
            
            # Nested loop detection
            if isinstance(node, (ast.For, ast.While)):
                for child in ast.walk(node):
                    if isinstance(child, (ast.For, ast.While)) and child is not node:
                        issues.append({
                            'type': 'nested_loop',
                            'description': 'Nested loop detected, consider optimization'
                        })
        
        return issues

    async def optimize(self, file_path: str) -> Dict[str, Any]:
        """Generate optimization suggestions."""
        try:
            with open(file_path, 'r') as f:
                content = f.read()
                
            metrics = self._analyze_code_metrics(content)
            
            prompt = f"""Analyze this code for optimization opportunities:

Code metrics:
{json.dumps(metrics, indent=2)}

Original code:
{content[:2000]}

Provide specific suggestions for:
1. Performance optimization
2. Code organization
3. Memory usage
4. Error handling
5. Best practices

Include code examples for each suggestion."""

            suggestions = await self.llm.generate(prompt)
            
            return {
                'metrics': metrics,
                'suggestions': suggestions,
                'summary': self._create_optimization_summary(metrics)
            }
            
        except Exception as e:
            logger.error(f"Error analyzing {file_path}: {str(e)}")
            return {'error': str(e)}

    def _create_optimization_summary(self, metrics: Dict[str, Any]) -> str:
        """Create a summary of optimization opportunities."""
        summary = []
        
        # Complexity warnings
        for func in metrics['functions']:
            if func['complexity'] > 10:
                summary.append(f"High complexity in function {func['name']}")
        
        # Large classes
        for cls in metrics['classes']:
            if cls['methods'] > 10:
                summary.append(f"Large class {cls['name']} with {cls['methods']} methods")
        
        # Add identified issues
        for issue in metrics['potential_issues']:
            summary.append(issue['description'])
        
        return '\n'.join(summary)

async def main():
    parser = argparse.ArgumentParser(description="Development Workflow Tools")
    parser.add_argument('--commit', action='store_true', help="Generate commit message")
    parser.add_argument('--api-spec', nargs='+', help="Generate API spec from route files")
    parser.add_argument('--optimize', help="Optimize code file")
    
    args = parser.parse_args()
    
    config = LLMConfig()
    
    async with LLMClient(config) as llm:
        if args.commit:
            analyzer = CommitAnalyzer(llm)
            message = await analyzer.generate_commit_message()
            if message:
                print(f"\n{Colors.GREEN}Generated commit message:{Colors.END}")
                print(f"{Colors.BOLD}{message}{Colors.END}")
                
                if input("\nUse this message? [Y/n] ").lower() != 'n':
                    subprocess.run(['git', 'commit', '-m', message])
                    
        elif args.api_spec:
            generator = APISpecGenerator(llm)
            print(f"{Colors.CYAN}Analyzing route files...{Colors.END}")
            spec = await generator.generate_spec(args.api_spec)
            
            if spec:
                output_file = 'openapi.yaml'
                with open(output_file, 'w') as f:
                    f.write(spec)
                print(f"{Colors.GREEN}Generated OpenAPI spec saved to {output_file}{Colors.END}")
                
        elif args.optimize:
            optimizer = CodeOptimizer(llm)
            print(f"{Colors.CYAN}Analyzing code for optimization...{Colors.END}")
            
            result = await optimizer.optimize(args.optimize)
            
            if 'error' in result:
                print(f"{Colors.FAIL}Error: {result['error']}{Colors.END}")
            else:
                print(f"\n{Colors.GREEN}Code Analysis Results:{Colors.END}")
                print("\nMetrics:")
                print(f"- Functions analyzed: {len(result['metrics']['functions'])}")
                print(f"- Classes analyzed: {len(result['metrics']['classes'])}")
                print(f"- Potential issues found: {len(result['metrics']['potential_issues'])}")
                
                print(f"\n{Colors.BLUE}Optimization Summary:{Colors.END}")
                print(result['summary'])
                
                print(f"\n{Colors.BLUE}Detailed Suggestions:{Colors.END}")
                print(result['suggestions'])
                
                output_file = f"{args.optimize}_analysis.md"
                with open(output_file, 'w') as f:
                    f.write(f"# Code Analysis for {args.optimize}\n\n")
                    f.write("## Metrics\n")
                    f.write(f"```json\n{json.dumps(result['metrics'], indent=2)}\n```\n\n")
                    f.write("## Summary\n")
                    f.write(result['summary'])
                    f.write("\n\n## Detailed Suggestions\n")
                    f.write(result['suggestions'])
                
                print(f"\n{Colors.GREEN}Full analysis saved to {output_file}{Colors.END}")
        
        else:
            parser.print_help()

def run():
    """Entry point with error handling."""
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print(f"\n{Colors.WARNING}Process interrupted by user{Colors.END}")
    except Exception as e:
        print(f"\n{Colors.FAIL}Fatal error: {str(e)}{Colors.END}")
        sys.exit(1)

if __name__ == "__main__":
    run()
