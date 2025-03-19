# Raioa - Next.js Application

This is a [Next.js](https://nextjs.org) project with a custom-rolled architecture and a strong focus on modularity and separation of concerns.

## 🚀 Quick Start

To get started with development, you can use the CLI tool:

```bash
# Start local development server (no database)
./devtool start

# Start with SQLite
./devtool dev --sqlite
```

You can also use the npm scripts:

```bash
# Start Next.js development server
npm run dev

# Start with SQLite
npm run dev:sqlite
```

## 🐳 Docker

For a containerized setup:

```bash
# Start with Docker (no database)
./devtool docker:start
# or
npm run docker:start

# Start with Docker + SQLite in detached mode
./devtool docker:start --sqlite -d
# or
npm run docker:sqlite
```

## ⚙️ Environment Configuration

The system uses environment variables for configuration. You can set them using:

```bash
# Show current environment variables
./devtool env:show

# Set environment variable
./devtool env:set DATABASE_URL=your-connection-string
```

## 🗄️ Database Configuration

### 📁 SQLite

- **Connection String**: `file:./data/raioa.db`
- **Docker**: A volume is created to persist data

## 🧰 Development Tools

```bash
# TypeScript type checking
./devtool typecheck
# or
npm run typecheck
```

## 📝 Environment Variables

| Variable            | Description                          | Default        |
| ------------------- | ------------------------------------ | -------------- |
| `NODE_ENV`          | Environment (development/production) | development    |
| `PORT`              | Application port                     | 3000           |
| `DATABASE_TYPE`     | Database type (postgres/sqlite/none) | none           |
| `DATABASE_URL`      | Database connection URL              | -              |
| `POSTGRES_USER`     | PostgreSQL username                  | raioa          |
| `POSTGRES_PASSWORD` | PostgreSQL password                  | raioa_password |
| `POSTGRES_DB`       | PostgreSQL database name             | raioa_db       |
| `POSTGRES_PORT`     | PostgreSQL port                      | 5432           |

## 🎮 Command Reference

```bash
# Interactive menu
./devtool menu
# or
npm run tool:menu

# Start local development
./devtool start [--open]

# Start with database
./devtool dev [--postgres] [--sqlite] [--open]

# Start with Docker
./devtool docker:start [--postgres] [--sqlite] [--detached|-d] [--build|-b] [--dev] [--open]

# Stop Docker containers
./devtool docker:down

# Clean Docker resources
./devtool docker:clean [--volumes]

# Git operations
./devtool git

# Show help
./devtool --help
```

## 📦 Project Structure

This project follows a modular architecture:

- `src/shared`: Shared logic, components, hooks, and utilities
- `src/components`: Singular-use components
- `src/app`: Page rendering and routing
- `src/views`: UI composition for specific pages
- `src/modules`: Feature-specific code organized by feature name
- `src/server`: Server-side code including database access

## 🔧 Development Environment

### Without Docker

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

### With Docker

```bash
# Start with Docker (no database)
./devtool docker:start

# Start with Docker + SQLite in development mode
./devtool docker:start --sqlite --dev

# Start with Docker + SQLite in detached mode
./devtool docker:start --sqlite -d

# Rebuild Docker containers
./devtool docker:start --build
```

## 📚 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## 📄 License

[MIT](LICENSE)

# Additional examples

```bash
# Start in detached mode (background)
./devtool docker:start --sqlite --detached

# Rebuild Docker containers
./devtool docker:start --build

# Start with development mode flags
./devtool docker:start --dev

# Start with Docker + SQLite in detached mode
./devtool docker:start --sqlite -d
```
