import { sql } from 'drizzle-orm'

export async function dup(db: any) {
	await sql`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            name TEXT,
            role VARCHAR(50) NOT NULL DEFAULT 'user',
            email_verified BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            avatar VARCHAR(255)
        );

        CREATE TABLE IF NOT EXISTS sessions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            token TEXT NOT NULL UNIQUE,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS email_verifications (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            token VARCHAR(255) NOT NULL UNIQUE,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS password_resets (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            token VARCHAR(255) NOT NULL UNIQUE,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            used BOOLEAN DEFAULT FALSE
        );

        CREATE TABLE IF NOT EXISTS rate_limits (
            id SERIAL PRIMARY KEY,
            key VARCHAR(255) NOT NULL UNIQUE,
            points INTEGER NOT NULL DEFAULT 0,
            expire TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS login_history (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            user_agent TEXT,
            ip_address VARCHAR(45),
            location JSONB DEFAULT '{}',
            success BOOLEAN DEFAULT TRUE,
            month TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            count INTEGER NOT NULL DEFAULT 1
        );
    `
}

export async function down(db: any) {
	await sql`
        DROP TABLE IF EXISTS login_history;
        DROP TABLE IF EXISTS rate_limits;
        DROP TABLE IF EXISTS password_resets;
        DROP TABLE IF EXISTS email_verifications;
        DROP TABLE IF EXISTS sessions;
        DROP TABLE IF EXISTS users;
    `
}
