---
title: Custom Authentication System
description: Documentation for the custom-built authentication system using JWT, sessions, and ORM
---

# Custom Authentication System

This document outlines the custom authentication system implemented in our application, which uses JWT (JSON Web Tokens), server-side sessions, and database integration via ORM.

## Architecture Overview

Our authentication system follows a modular architecture with clear separation of concerns:

```
src/modules/authentication/
├── api/
│   ├── queries/
│   │   ├── get-user.ts
│   │   └── get-session.ts
│   └── mutations/
│       ├── create-user.ts
│       ├── login-user.ts
│       └── logout-user.ts
├── models/
│   ├── z.user.ts
│   └── z.session.ts
├── state/
│   └── use-auth-state.ts
└── hooks/
    ├── use-auth.ts
    └── use-permissions.ts
```

## Core Technologies

- **JWT (Jose)**: For secure token generation and validation
- **Server Sessions**: For maintaining user state
- **Drizzle ORM**: For database interactions
- **Zod**: For schema validation
- **Next.js Server Actions**: For secure server-side operations

## Authentication Flow

### Registration

1. User submits registration form with email, password, and optional profile information
2. Server validates input using Zod schemas
3. Password is hashed using bcrypt
4. User record is created in the database
5. JWT token is generated and stored in an HTTP-only cookie
6. Session is created and stored in the database
7. User is redirected to the dashboard

### Login

1. User submits login form with email and password
2. Server validates credentials against the database
3. On successful validation, a JWT token is generated and stored in an HTTP-only cookie
4. Session is created and stored in the database
5. User is redirected to the dashboard

### Authentication Verification

1. On protected routes, the server middleware checks for the presence of a valid JWT token
2. Token is verified using the secret key
3. Session is validated against the database
4. If valid, the request proceeds; otherwise, the user is redirected to the login page

### Logout

1. User initiates logout
2. Server invalidates the session in the database
3. JWT cookie is cleared
4. User is redirected to the login page

## Security Measures

- **HTTP-Only Cookies**: Prevents client-side JavaScript from accessing tokens
- **CSRF Protection**: Implemented via Next.js built-in protection
- **Password Hashing**: Using bcrypt with appropriate salt rounds
- **Token Expiration**: JWTs have a configurable expiration time
- **Session Validation**: Double-checking session validity in the database
- **Rate Limiting**: Preventing brute force attacks

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Sessions Table

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, token)
);
```

## Client-Side Integration

The authentication system is exposed to the client through React hooks:

### `useAuth` Hook

```typescript
const {
	user, // Current user object or null
	isLoading, // Loading state
	error, // Error message if any
	login, // Function to log in
	register, // Function to register
	logout, // Function to log out
	isAuthenticated, // Boolean indicating if user is authenticated
} = useAuth()
```

### `usePermissions` Hook

```typescript
const {
	can, // Function to check if user can perform an action
	hasRole, // Function to check if user has a specific role
} = usePermissions()
```

## Configuration

Authentication settings are configured in the `.env` file:

```
# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRATION=8h

# Session Configuration
SESSION_EXPIRATION_DAYS=7

# Password Security
PASSWORD_MIN_LENGTH=8
PASSWORD_HASH_ROUNDS=12
```

## Implementation Details

### JWT Generation (using jose)

```typescript
import { SignJWT } from 'jose'

const generateToken = async (payload: any, secret: string, expiration: string) => {
	const secretKey = new TextEncoder().encode(secret)

	return new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(expiration)
		.sign(secretKey)
}
```

### Password Hashing

```typescript
import bcrypt from 'bcrypt'

const hashPassword = async (password: string): Promise<string> => {
	const saltRounds = Number(process.env.PASSWORD_HASH_ROUNDS) || 12
	return bcrypt.hash(password, saltRounds)
}

const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
	return bcrypt.compare(password, hash)
}
```

### Session Management

```typescript
import { db } from 'db'
import { sessions } from '@/server/db/schema'
import { eq } from 'drizzle-orm'

const createSession = async (userId: string, token: string, expiresAt: Date) => {
	return db
		.insert(sessions)
		.values({
			userId,
			token,
			expiresAt,
		})
		.returning()
}

const validateSession = async (userId: string, token: string) => {
	const session = await db.query.sessions.findFirst({
		where: eq(sessions.userId, userId) && eq(sessions.token, token),
	})

	if (!session) return false
	if (new Date() > session.expiresAt) return false

	return true
}
```

## Best Practices

1. **Never store sensitive information** in the JWT payload
2. **Implement proper error handling** for all authentication operations
3. **Use short-lived tokens** and implement refresh token functionality for long sessions
4. **Validate all user inputs** using Zod schemas
5. **Implement proper logging** for security events
6. **Regularly rotate secrets** in production environments
7. **Implement account lockout** after multiple failed login attempts

## Testing

Authentication components and logic should be thoroughly tested:

- **Unit Tests**: For individual functions like token generation and password hashing
- **Integration Tests**: For the complete authentication flow
- **E2E Tests**: For the user experience of registration, login, and protected routes

## Future Enhancements

- Multi-factor authentication
- OAuth integration for social logins
- Role-based access control
- Account verification via email
