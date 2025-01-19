/**
 * @author Remco Stoeten
 * @description Comprehensive help system for database CLI
 */

import chalk from 'chalk';
import boxen from 'boxen';
import TableLayout from 'table-layout';

// ... rest of the types ...

export function showMainHelp(): void {
  console.log(boxen(chalk.bold.cyan('Database CLI Help'), { 
    padding: 1, 
    margin: 1,
    borderStyle: 'double',
    borderColor: 'cyan'
  }));

  console.log(chalk.yellow('\n📚 Available Categories:\n'));
  helpCategories.forEach((category, index) => {
    console.log(chalk.blue(`${index + 1}. ${category.title}`));
    console.log(chalk.gray(`   ${category.description}\n`));
  });

  console.log(chalk.yellow('\n🔍 Quick Reference:\n'));
  const quickReferenceData = [
    { command: 'Command', description: 'Description' },
    { command: 'pnpm db', description: 'Start the CLI' },
    { command: 'pnpm db help', description: 'Show this help' },
    { command: 'pnpm db <command> --help', description: 'Show command help' },
  ];
  
  const table = new TableLayout(quickReferenceData);
  console.log(table.toString());

  console.log(chalk.yellow('\n💡 Tips:\n'));
  console.log(chalk.gray('• Use numbers 1-10 for quick navigation'));
  console.log(chalk.gray('• Type "help <command>" for detailed help'));
  console.log(chalk.gray('• Press Ctrl+C to exit anytime'));
}

// ... rest of the code ... 