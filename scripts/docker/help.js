#!/usr/bin/env node
'use strict'

import chalk from 'chalk'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const topics = {
	general: `
# Project Commands Help

## Getting Started
- ${chalk.green('pnpm dev')} - Start development server with Turbopack
- ${chalk.green('pnpm build')} - Build production application
- ${chalk.green('pnpm check')} - Run TypeScript type checking
- ${chalk.green('pnpm f')} - Format code with Prettier
- ${chalk.green('pnpm re')} - Clean reinstall of dependencies

## Database Management
- ${chalk.green('pnpm manage:db')} - Manage Docker and PostgreSQL containers
- ${chalk.green('pnpm push')} - Push schema changes to database
- ${chalk.green('pnpm gen')} - Generate new migrations

## Environment & Security
- ${chalk.green('pnpm gen-secret')} - Generate new JWT secret
- ${chalk.green('pnpm extract-db')} - Extract database URL from docker-compose
- ${chalk.green('pnpm env')} - Manage environment variables

## Help Commands
- ${chalk.green('pnpm help')} - Show this general help
- ${chalk.green('pnpm help:env')} - Show environment management help
- ${chalk.green('pnpm help:docker')} - Show Docker management help
`,

	env: `
# Environment Management

## Environment Variables
Required environment variables for the project:
- ${chalk.yellow('DATABASE_URL')}: PostgreSQL connection string (auto-configured via Docker)
- ${chalk.yellow('JWT_SECRET')}: Secret key for JWT token signing
- ${chalk.yellow('NEXTAUTH_URL')}: Your application's base URL
- ${chalk.yellow('NODE_ENV')}: Development/production environment

## Database URL Configuration
The DATABASE_URL is automatically configured when running:
1. ${chalk.green('pnpm manage:db')} - This starts the Docker container
2. ${chalk.green('pnpm extract-db')} - This extracts the correct URL, but requires manual .env update

⚠️ ${chalk.red('Important')}: After getting the DATABASE_URL prompt, you need to:
1. Copy the provided URL
2. Manually add it to your .env file
3. Format should be: DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app

## Managing Environment Variables
1. Use ${chalk.green('pnpm env')} to manage your environment variables
   - Interactive CLI tool for managing .env files
   - Automatically validates required variables
   - Creates backups before modifications
   - Note: Database URL requires manual update

2. Common Commands:
   - ${chalk.green('pnpm env check')} - Validate current environment setup
   - ${chalk.green('pnpm env set')} - Set a new environment variable
   - ${chalk.green('pnpm env backup')} - Create .env backup
   - ${chalk.green('pnpm env restore')} - Restore from backup

## Environment File Structure
\`\`\`env
# Manual update required for DATABASE_URL after Docker setup
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app
JWT_SECRET=your-secret-key
\`\`\`

## Setup Process
1. Start Docker containers: ${chalk.green('pnpm manage:db')}
2. Get database URL: ${chalk.green('pnpm extract-db')}
3. Manually update .env with the provided DATABASE_URL
4. Generate JWT secret: ${chalk.green('pnpm gen-secret')}
5. Set remaining environment variables

## Security Best Practices
- Never commit .env files to version control
- Regularly rotate JWT_SECRET in production
- Use strong, unique values for secrets
- Keep separate .env files for development/production
`,

	docker: `
# Docker Management

## Container Management
- Start containers: ${chalk.green('./scripts/manage-docker.sh start')}
- Stop containers: ${chalk.green('./scripts/manage-docker.sh stop')}
- View logs: ${chalk.green('./scripts/manage-docker.sh logs')}
- Reset data: ${chalk.green('./scripts/manage-docker.sh reset')}

## Database Configuration
- PostgreSQL runs on port 5432
- Default credentials:
  - Database: ${chalk.yellow('app')}
  - Username: ${chalk.yellow('postgres')}
  - Password: ${chalk.yellow('postgres')}
  - Host: ${chalk.yellow('localhost')}

## Common Docker Commands
1. Container Management:
   - ${chalk.green('./scripts/manage-docker.sh start')} - Start all containers
   - ${chalk.green('./scripts/manage-docker.sh stop')} - Stop all containers
   - ${chalk.green('./scripts/manage-docker.sh restart')} - Restart containers
   - ${chalk.green('./scripts/manage-docker.sh status')} - Check container status

2. Database Operations:
   - ${chalk.green('./scripts/manage-docker.sh db:backup')} - Backup database
   - ${chalk.green('./scripts/manage-docker.sh db:restore')} - Restore database
   - ${chalk.green('./scripts/manage-docker.sh db:reset')} - Reset database

## Troubleshooting Guide
1. Container Issues:
   - Check port conflicts (5432 for PostgreSQL)
   - Verify Docker daemon status
   - Review logs with ${chalk.green('./scripts/manage-docker.sh logs')}

2. Database Connection:
   - Confirm DATABASE_URL in .env
   - Check container health
   - Test network connectivity
`,

	secret: `
# JWT Secret Management

## Generate Secret Key
The ${chalk.green('pnpm gen-secret')} command:
- Generates a cryptographically secure random string
- Suitable for JWT token signing
- 64 characters long by default
- Uses Node.js crypto module

## Usage
1. Generate new secret:
   ${chalk.green('pnpm gen-secret')}

2. Output format:
   \`\`\`
   New JWT_SECRET: <generated-secret>
   \`\`\`

3. Automatically updates .env file when requested

## Security Notes
- Generate unique secrets for each environment
- Never reuse secrets across projects
- Rotate secrets periodically in production
- Store securely in environment variables
`,

	extract: `
# Database URL Extraction

## Extract Database URL
The ${chalk.green('pnpm extract-db')} command:
- Parses docker-compose configuration
- Extracts database connection details
- Generates proper DATABASE_URL string
- Optionally updates .env file

## Usage
1. Extract URL:
   ${chalk.green('pnpm extract-db')}

2. Output format:
   \`\`\`
   DATABASE_URL=postgresql://user:password@host:port/database
   \`\`\`

## Configuration
- Supports custom port mapping
- Handles different database names
- Works with modified credentials
- Compatible with development/production setups

## Common Use Cases
1. Initial setup:
   - Generate correct DATABASE_URL
   - Verify database configuration
   - Update environment variables

2. Troubleshooting:
   - Validate connection string
   - Check port mappings
   - Verify credentials
`
}

function renderHelp(topic = 'general') {
	const content = topics[topic] || topics.general

	// Remove ANSI color codes for marked parsing
	const plainContent = content.replace(/\u001b\[.*?m/g, '')

	// Parse markdown and print
	console.log(content)
}

// Handle command line arguments
const topic = process.argv[2]?.toLowerCase()
renderHelp(topic)

// Export for potential programmatic usage
export const helpTopics = topics
