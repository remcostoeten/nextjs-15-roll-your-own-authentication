# Development Tool CLI Guide

This guide explains how to use the `devtool` command-line interface (CLI) to manage your development environment.

## Getting Started

The `devtool` CLI provides an interactive menu system and command-line options for managing your development environment.

### Interactive Menu

To access the interactive menu, run:

```bash
./devtool menu
# or
npm run tool:menu
```

This will display a menu with options for starting the application, managing Docker, and more.

### Command Line Options

You can also use the CLI from the command line directly:

```bash
# Start the application (no database)
./devtool start

# Start with PostgreSQL
./devtool dev --postgres

# Start with SQLite
./devtool dev --sqlite
```

## Docker Commands

For Docker-based development:

```bash
# Start with Docker (no database)
./devtool docker:start

# Start with Docker + PostgreSQL
./devtool docker:start --postgres

# Start with Docker + SQLite in detached mode
./devtool docker:start --sqlite --detached
```

## Development Tools

```bash
# Run TypeScript type checking
./devtool typecheck
# or
npm run typecheck
```

## Environment Management

Manage environment variables:

```bash
# Show current environment variables
./devtool env:show

# Set environment variable
./devtool env:set DATABASE_URL=your-connection-string
```

## Git Operations

Manage git operations:

```bash
# Open git menu
./devtool git
```

## NPM Scripts

The following npm scripts are available for convenience:

```bash
# Start Next.js development server
npm run dev

# Start with PostgreSQL
npm run dev:postgres

# Start with SQLite
npm run dev:sqlite

# Start with Docker
npm run docker:start

# Start with Docker + PostgreSQL
npm run docker:postgres

# Start with Docker + SQLite
npm run docker:sqlite

# Access the CLI tool
npm run tool

# Open the interactive menu
npm run tool:menu
```

## Command Reference

```bash
# Show help
./devtool --help

# Start application without Docker
./devtool start [--open]

# Start development environment
./devtool dev [--postgres] [--sqlite] [--open]

# Start with Docker
./devtool docker:start [--postgres] [--sqlite] [--detached|-d] [--build|-b] [--dev] [--open]

# Stop Docker containers
./devtool docker:down

# Clean up Docker resources
./devtool docker:clean [--volumes|-v]

# Show environment variables
./devtool env:show

# Set environment variable
./devtool env:set KEY=VALUE
```
