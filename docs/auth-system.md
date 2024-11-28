# Authentication System with Role-Based Access Control

## Features

1. User registration with email verification
2. Secure login with rate limiting
3. Role-based access control (user and admin roles)
4. Session management using JWT
5. Password strength validation
6. Admin dashboard for user management

## Docker Setup

This project uses Docker for local development to ensure consistency across different environments. Here's how to get started:

1. Install Docker and Docker Compose on your machine.
2. Run `pnpm run docker:dev` to start the application and database containers.
3. The application will be available at `http://localhost:3000`.

To start only the database, you can run `pnpm run docker:db`.

## Environment Variables

We use a `.env` file to manage environment variables. You can sync your `.env` file with the example file by running:
