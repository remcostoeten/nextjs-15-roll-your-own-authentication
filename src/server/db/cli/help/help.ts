/**
 * @author Remco Stoeten
 * @description Help system for the database CLI tool providing documentation, examples and best practices
 */

import chalk from 'chalk';
import boxen from 'boxen';
import TableLayout from 'table-layout';

type HelpCategory = {
  name: string;
  description: string;
  commands: HelpCommand[];
};

type HelpCommand = {
  name: string;
  description: string;
  usage: string;
  example: string;
};

const helpCategories: HelpCategory[] = [
  {
    name: 'Database Management',
    description: 'Core database operations and management commands',
    commands: [
      {
        name: 'init',
        description: 'Initialize a new database configuration',
        usage: 'db-cli init',
        example: 'db-cli init --type postgresql --orm prisma'
      },
      {
        name: 'generate',
        description: 'Generate database schema',
        usage: 'db-cli generate',
        example: 'db-cli generate'
      },
      {
        name: 'push',
        description: 'Push schema changes to database',
        usage: 'db-cli push',
        example: 'db-cli push'
      }
    ]
  },
  {
    name: 'Optimization',
    description: 'Database optimization and performance tools',
    commands: [
      {
        name: 'analyze',
        description: 'Analyze table sizes and suggest optimizations',
        usage: 'db-cli analyze',
        example: 'db-cli analyze --table users'
      },
      {
        name: 'vacuum',
        description: 'Clean up and optimize database',
        usage: 'db-cli vacuum',
        example: 'db-cli vacuum --full'
      }
    ]
  }
];

export function showMainHelp(): void {
  console.log(boxen(chalk.bold.cyan('Database CLI Help'), { padding: 1 }));
  
  const tableData = helpCategories.map(category => ({
    Category: chalk.green(category.name),
    Description: category.description,
    'Quick Reference': category.commands.map(cmd => chalk.yellow(cmd.name)).join(', ')
  }));

  const table = new TableLayout(tableData, { maxWidth: 100 });
  console.log(table.toString());
  
  console.log(chalk.dim('\nUse db-cli help <category> for more details on specific commands'));
}

export function showCategoryHelp(categoryName: string): void {
  const category = helpCategories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
  
  if (!category) {
    console.log(chalk.red(`Category "${categoryName}" not found`));
    return;
  }

  console.log(boxen(chalk.bold.cyan(`${category.name} Help`), { padding: 1 }));
  
  category.commands.forEach(cmd => {
    console.log(chalk.green(`\n${cmd.name}`));
    console.log(chalk.dim('Description:'), cmd.description);
    console.log(chalk.dim('Usage:'), cmd.usage);
    console.log(chalk.dim('Example:'), chalk.yellow(cmd.example));
  });
} 