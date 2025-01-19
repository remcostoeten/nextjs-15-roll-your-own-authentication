#!/usr/bin/env node

/**
 * @author Remco Stoeten
 * @description CLI tool for managing database configuration and ORM switching
 */

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import { exec } from 'child_process';
import { promisify } from 'util';
import { showMainHelp, showCategoryHelp } from './help/help';

const execAsync = promisify(exec);

// Types
type DatabaseType = 'sqlite' | 'postgresql';
type ORMType = 'prisma' | 'drizzle';

interface DatabaseConfig {
  type: DatabaseType;
  orm: ORMType;
}

// Constants
const CONFIG_FILE = '.db-config.json';
const SQLITE_PATH = './prisma/dev.db';
const DOCKER_COMPOSE = `
version: '3.8'
services:
  postgres:
    image: postgres:latest
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: myapp
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
`;

// Utility functions
const spinner = ora({
  color: 'green'
});

async function getCurrentConfig(): Promise<DatabaseConfig> {
  try {
    if (await fs.pathExists(CONFIG_FILE)) {
      return await fs.readJSON(CONFIG_FILE);
    }
  } catch (error) {
    console.error('Error reading config:', error);
  }
  
  // Default config
  return {
    type: 'sqlite',
    orm: 'prisma'
  };
}

async function saveConfig(config: DatabaseConfig) {
  await fs.writeJSON(CONFIG_FILE, config, { spaces: 2 });
}

async function checkDockerStatus(): Promise<boolean> {
  try {
    await execAsync('docker ps');
    return true;
  } catch {
    return false;
  }
}

// Command handlers
async function viewCurrentImplementation() {
  const config = await getCurrentConfig();
  console.log('\nCurrent Database Implementation:');
  console.log(chalk.green(`Database: ${chalk.bold(config.type)}`));
  console.log(chalk.green(`ORM: ${chalk.bold(config.orm)}`));
  
  if (config.type === 'postgresql') {
    const isDockerRunning = await checkDockerStatus();
    console.log(chalk.yellow(`Docker Status: ${isDockerRunning ? '🟢 Running' : '🔴 Stopped'}`));
  }
}

async function startDatabase() {
  const config = await getCurrentConfig();
  
  if (config.type === 'postgresql') {
    spinner.start('Starting PostgreSQL database...');
    
    try {
      // Create docker-compose file if it doesn't exist
      await fs.writeFile('docker-compose.yml', DOCKER_COMPOSE);
      
      await execAsync('docker-compose up -d');
      spinner.succeed('PostgreSQL database started successfully');
    } catch (error) {
      spinner.fail('Failed to start PostgreSQL database');
      console.error(chalk.red(error));
    }
  } else {
    console.log(chalk.yellow('SQLite database is always running locally'));
  }
}

async function stopDatabase() {
  const config = await getCurrentConfig();
  
  if (config.type === 'postgresql') {
    spinner.start('Stopping PostgreSQL database...');
    
    try {
      await execAsync('docker-compose down');
      spinner.succeed('PostgreSQL database stopped successfully');
    } catch (error) {
      spinner.fail('Failed to stop PostgreSQL database');
      console.error(chalk.red(error));
    }
  } else {
    console.log(chalk.yellow('SQLite database cannot be stopped as it\'s file-based'));
  }
}

async function removeDatabase() {
  const config = await getCurrentConfig();
  
  if (config.type === 'postgresql') {
    spinner.start('Removing PostgreSQL database...');
    
    try {
      await execAsync('docker-compose down -v');
      await fs.remove('docker-compose.yml');
      spinner.succeed('PostgreSQL database removed successfully');
    } catch (error) {
      spinner.fail('Failed to remove PostgreSQL database');
      console.error(chalk.red(error));
    }
  } else {
    spinner.start('Removing SQLite database...');
    try {
      await fs.remove(SQLITE_PATH);
      spinner.succeed('SQLite database removed successfully');
    } catch (error) {
      spinner.fail('Failed to remove SQLite database');
      console.error(chalk.red(error));
    }
  }
}

async function switchORM(targetORM: ORMType) {
  const config = await getCurrentConfig();
  
  if (config.orm === targetORM) {
    console.log(chalk.yellow(`Already using ${targetORM}`));
    return;
  }
  
  spinner.start(`Switching to ${targetORM}...`);
  
  try {
    if (targetORM === 'prisma') {
      await execAsync('pnpm remove drizzle-orm drizzle-kit');
      await execAsync('pnpm add @prisma/client');
      await execAsync('pnpm add -D prisma');
      await execAsync('npx prisma generate');
      await execAsync('npx prisma db push');
    } else {
      await execAsync('pnpm remove @prisma/client prisma');
      await execAsync('pnpm add drizzle-orm');
      await execAsync('pnpm add -D drizzle-kit');
      // TODO: Add drizzle migration commands
    }
    
    config.orm = targetORM;
    await saveConfig(config);
    
    spinner.succeed(`Successfully switched to ${targetORM}`);
  } catch (error) {
    spinner.fail(`Failed to switch to ${targetORM}`);
    console.error(chalk.red(error));
  }
}

async function switchDatabase(targetDB: DatabaseType) {
  const config = await getCurrentConfig();
  
  if (config.type === targetDB) {
    console.log(chalk.yellow(`Already using ${targetDB}`));
    return;
  }
  
  spinner.start(`Switching to ${targetDB}...`);
  
  try {
    if (targetDB === 'postgresql') {
      // Create docker-compose file
      await fs.writeFile('docker-compose.yml', DOCKER_COMPOSE);
      
      // Update .env file
      const envContent = 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/myapp"';
      await fs.writeFile('.env', envContent);
      
      // Start PostgreSQL
      await execAsync('docker-compose up -d');
    } else {
      // Stop PostgreSQL if running
      try {
        await execAsync('docker-compose down');
        await fs.remove('docker-compose.yml');
      } catch {}
      
      // Update .env file
      const envContent = `DATABASE_URL="file:${SQLITE_PATH}"`;
      await fs.writeFile('.env', envContent);
    }
    
    // Update schema based on ORM
    if (config.orm === 'prisma') {
      const prismaSchema = await fs.readFile('prisma/schema.prisma', 'utf-8');
      const dbUrl = targetDB === 'postgresql' 
        ? 'postgresql://postgres:postgres@localhost:5432/myapp'
        : `file:${SQLITE_PATH}`;
        
      const updatedSchema = prismaSchema
        .replace(/provider = "(postgresql|sqlite)"/, `provider = "${targetDB}"`)
        .replace(/url\s*=\s*"[^"]*"/, `url = "${dbUrl}"`);
        
      await fs.writeFile('prisma/schema.prisma', updatedSchema);
      
      await execAsync('npx prisma generate');
      await execAsync('npx prisma db push');
    } else {
      // TODO: Update drizzle config
    }
    
    config.type = targetDB;
    await saveConfig(config);
    
    spinner.succeed(`Successfully switched to ${targetDB}`);
  } catch (error) {
    spinner.fail(`Failed to switch to ${targetDB}`);
    console.error(chalk.red(error));
  }
}

// Add new functions for schema generation
async function generateSchema() {
  const config = await getCurrentConfig();
  spinner.start('Generating schema...');
  
  try {
    if (config.orm === 'prisma') {
      await execAsync('npx prisma generate');
      spinner.succeed('Successfully generated Prisma schema');
    } else {
      await execAsync('pnpm drizzle-kit generate:sqlite');
      spinner.succeed('Successfully generated Drizzle schema');
    }
  } catch (error) {
    spinner.fail('Failed to generate schema');
    console.error(chalk.red(error));
  }
}

async function pushSchema() {
  const config = await getCurrentConfig();
  spinner.start('Pushing schema changes...');
  
  try {
    if (config.orm === 'prisma') {
      await execAsync('npx prisma db push');
      spinner.succeed('Successfully pushed Prisma schema changes');
    } else {
      await execAsync('pnpm drizzle-kit push:sqlite');
      spinner.succeed('Successfully pushed Drizzle schema changes');
    }
  } catch (error) {
    spinner.fail('Failed to push schema changes');
    console.error(chalk.red(error));
  }
}

// Main menu
async function showMainMenu() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      pageSize: 15,
      choices: [
        { name: '👀 View current implementation', value: 'view' },
        { name: '🚀 Start database', value: 'start' },
        { name: '🛑 Stop database', value: 'stop' },
        { name: '🗑️  Remove database', value: 'remove' },
        { name: '🔄 Switch ORM', value: 'switchOrm' },
        { name: '💾 Switch database type', value: 'switchDb' },
        { name: '📝 Generate Schema', value: 'generate' },
        { name: '⬆️  Push Schema Changes', value: 'push' },
        { name: '❓ Help', value: 'help' },
        { name: '❌ Exit', value: 'exit' }
      ]
    }
  ]);
  
  switch (action) {
    case 'view':
      await viewCurrentImplementation();
      break;
    case 'start':
      await startDatabase();
      break;
    case 'stop':
      await stopDatabase();
      break;
    case 'remove':
      await removeDatabase();
      break;
    case 'switchOrm': {
      const { orm } = await inquirer.prompt([
        {
          type: 'list',
          name: 'orm',
          message: 'Select target ORM:',
          choices: [
            { name: 'Prisma', value: 'prisma' },
            { name: 'Drizzle', value: 'drizzle' }
          ]
        }
      ]);
      await switchORM(orm);
      break;
    }
    case 'switchDb': {
      const { db } = await inquirer.prompt([
        {
          type: 'list',
          name: 'db',
          message: 'Select target database:',
          choices: [
            { name: 'SQLite', value: 'sqlite' },
            { name: 'PostgreSQL', value: 'postgresql' }
          ]
        }
      ]);
      await switchDatabase(db);
      break;
    }
    case 'generate':
      await generateSchema();
      break;
    case 'push':
      await pushSchema();
      break;
    case 'help': {
      const helpAnswer = await inquirer.prompt([{
        type: 'list',
        name: 'category',
        message: 'Select help category:',
        choices: ['Main Help', 'Database Management', 'Optimization', 'Back to Main Menu']
      }]);

      if (helpAnswer.category !== 'Back to Main Menu') {
        if (helpAnswer.category === 'Main Help') {
          showMainHelp();
        } else {
          showCategoryHelp(helpAnswer.category);
        }
        // Wait for user to press enter before returning to main menu
        await inquirer.prompt([{
          type: 'input',
          name: 'continue',
          message: 'Press enter to return to main menu...'
        }]);
      }
      break;
    }
    case 'exit':
      console.log(chalk.green('Goodbye! 👋'));
      process.exit(0);
  }
  
  // Show menu again unless exiting
  if (action !== 'exit') {
    console.log('\n');
    await showMainMenu();
  }
}

// Initialize CLI
const program = new Command();

program
  .name('db-cli')
  .description('Database management CLI tool')
  .version('1.0.0');

program.action(async () => {
  console.log(chalk.bold.green('\n🗄️  Database Management CLI\n'));
  await showMainMenu();
});

program.parse(); 