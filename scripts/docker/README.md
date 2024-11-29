# Scripts Directory

This directory contains various utility scripts for managing environment variables, Docker, and database configurations.

## Available Scripts

### 🔐 Environment Management

-   `env-manager.sh` / `env-manager.js` - Interactive environment variable manager
    -   Generate new JWT secrets
    -   Extract database URLs from docker-compose
    -   Manage multiple .env files
    -   Create automatic backups
    ```bash
    # Usage
    pnpm env              # Interactive CLI
    pnpm gen-secret       # Generate JWT secret
    pnpm extract-db       # Extract DB URL
    ```

### 🐳 Docker Management

-   `manage-docker.sh` - Comprehensive Docker management script
    -   Start/stop Docker Compose services
    -   View and manage containers
    -   Handle PostgreSQL database setup
    -   Backup and restore functionality
    ```bash
    # Usage
    pnpm manage:db       # Interactive Docker menu
    ```

### 🔧 Utility Scripts

-   `extract-db.js` - Extract database URL from docker-compose.yml

    -   Parses Docker configuration
    -   Updates .env files automatically
    -   Copies to clipboard

    ```bash
    pnpm extract-db
    ```

-   `generate-secret.js` - Generate secure JWT secrets
    -   Creates cryptographically secure tokens
    -   Automatic clipboard copy
    -   Optional .env file update
    ```bash
    pnpm gen-secret
    ```

### 📚 Help System

-   `help.js` - Documentation and help system
    -   Detailed command explanations
    -   Environment setup guides
    -   Docker management instructions
    ```bash
    pnpm help            # General help
    pnpm help:env        # Environment help
    pnpm help:docker     # Docker help
    ```

## Common Workflows

### Initial Setup

1. Start Docker services:

    ```bash
    pnpm manage:db
    # Select "Start Docker Compose"
    ```

2. Configure environment:

    ```bash
    pnpm env
    # Follow interactive prompts
    ```

3. Generate secrets:
    ```bash
    pnpm gen-secret
    ```

### Database Management

1. Extract database URL:

    ```bash
    pnpm extract-db
    ```

2. Update environment files:
    ```bash
    pnpm env
    # Choose option to update DATABASE_URL
    ```

-   Check environment configuration:
    ```bash
    pnpm help:env
    ```

## Script Dependencies

-   Node.js and npm/pnpm
-   Docker and Docker Compose
-   bash shell
-   xclip (Linux) or pbcopy (macOS) for clipboard operations
