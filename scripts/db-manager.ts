#!/usr/bin/env node

const helpMenu = `
Database Manager Help Menu
-------------------------

Commands:
  pnpm db:switch <database-name>  Create/switch to a new database
  pnpm db:list                    List all running databases
  pnpm db:backup                  Create a backup of current database

Options:
  --help, -h     Show this help menu
  --list, -l     List all available databases

Examples:
  pnpm db:switch dev-db          Switch to development database
  pnpm db:switch test-db         Switch to testing database
  pnpm db:switch --help          Show this help menu
  pnpm db:switch --list          List available databases

Environment Variables:
  Only DATABASE_URL is required in .env file
  Format: postgresql://postgres:postgres@localhost:5432/database-name
`;

const createEnvFile = (dbName: string, envFile: string) => {
  const envContent = `
# Authentication
JWT_SECRET=your-super-secret-key-change-this-in-production
ADMIN_EMAIL=admin@example.com

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/${dbName}

# Environment
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
type DbConfig = {
  name: string;
  user: string;
  password: string;
  port: string;
  host: string;
};

const createEnvFile = (config: DbConfig, envFile: string) => {
  const envContent = `
DATABASE_URL=postgresql://${config.user}:${config.password}@${config.host}:${config.port}/${config.name}
POSTGRES_USER=${config.user}
POSTGRES_PASSWORD=${config.password}
POSTGRES_DB=${config.name}
JWT_SECRET=${process.env.JWT_SECRET || 'your-secret-key'}
`;

  fs.writeFileSync(envFile, envContent.trim());
};

const switchDatabase = async (dbName: string) => {
  const config: DbConfig = {
    name: dbName,
    user: 'postgres',
    password: 'postgres',
    port: '5432',
    host: 'localhost',
  };

  // Create new .env file with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const newEnvFile = `.env.${dbName}`;
  
  // Backup current .env if it exists
  if (fs.existsSync('.env')) {
    fs.copyFileSync('.env', `.env.backup.${timestamp}`);
  }

  // Create new .env file
  createEnvFile(config, newEnvFile);
  fs.copyFileSync(newEnvFile, '.env');

  // Stop current database container
  try {
    execSync('docker-compose down');
  } catch (error) {
    console.log('No running containers to stop');
  }

  // Start new database container
  execSync('docker-compose up -d');

  // Wait for database to be ready
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Run migrations
  try {
    execSync('pnpm drizzle-kit push:pg');
    console.log('✅ Database migrations applied successfully');
  } catch (error) {
    console.error('❌ Error applying migrations:', error);
  }

  console.log(`
✨ Database switch complete!
📊 New database: ${dbName}
🔧 Connection URL: postgresql://${config.user}:${config.password}@${config.host}:${config.port}/${dbName}
📝 Environment file: ${newEnvFile}
`);
}; 
