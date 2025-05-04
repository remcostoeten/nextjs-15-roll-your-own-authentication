import { string } from './index';

export const ENV_SCHEMA = {
    /**
     * Database connection string. Required for database operations.
     * Example for local Docker development: "postgresql://postgres:password@postgres:5432/ryoa"
     * Ensure the user/password/db match your Docker setup.
     */
    DATABASE_URL: string('DATABASE_URL')
        .required()
        .hint('Required. Provides the connection string for the primary PostgreSQL database. For local dev with default docker-compose, use: "postgresql://postgres:password@postgres:5432/ryoa"'),

    /**
     * Secret key for signing JWTs (JSON Web Tokens). Required for authentication.
     * Generate a strong, random secret. You can use tools like OpenSSL or a package manager script.
     * Example generation command: `pnpm secret` (if you have such a script) or `openssl rand -base64 32`
     */
    JWT_SECRET: string('JWT_SECRET')
        .required()
        .hint('Required. A strong secret for signing JWTs. To auto generate and paste inside your env run `(pnpn/npm/bun) run secret`. If that fails run `openssl rand -base64 32`).'),

    /**
     * Optional email address that will automatically receive admin privileges upon registration.
     * If not set, no user will be automatically granted admin rights.
     */
    ADMIN_EMAIL: string('ADMIN_EMAIL')
        .optional()
        .hint('Optional. If set, the user registering with this email address will gain admin privileges.'),

    /**
     * Optional connection URL for a Redis instance.
     * Used for caching, session management, or background jobs.
     * To run Redis locally with Docker Compose, use the 'redis' profile: `docker-compose --profile redis up -d`
     * The default URL when using the profile is typically: "redis://redis:6379"
     */
    REDIS_URL: string('REDIS_URL')
        .optional()
        .hint('Optional. Connection URL for Redis. If using the Docker Compose redis profile (`docker-compose --profile redis up`), the URL is likely "redis://redis:6379".'),

    /**
     * Specifies the runtime environment. Typically 'development', 'production', or 'test'.
     * Next.js usually sets this automatically based on the run command (dev, start, build).
     * Optional here for clarity or specific overrides.
     */
    NODE_ENV: string('NODE_ENV')
        .optional()
        .hint('Optional. Sets the runtime environment (e.g., "development", "production"). Often set by Next.js automatically.'),
};

