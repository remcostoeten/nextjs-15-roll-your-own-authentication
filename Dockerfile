# Use an official Node runtime as a parent image
FROM node:18-alpine

# Add necessary system dependencies
RUN apk add --no-cache libc6-compat

# Set the working directory in the container
WORKDIR /app

# Install specific pnpm version
RUN npm install -g pnpm@8.15.1

# Copy package files first for better caching
COPY pnpm-lock.yaml package.json ./

# Install dependencies with force flag to handle lockfile compatibility
RUN pnpm install --force

# Copy the rest of the application
COPY . .

# Build the application
RUN pnpm run build

# Expose port
EXPOSE 3000

# Set proper permissions
RUN chown -R node:node .
USER node

# Start the application
CMD ["pnpm", "run", "dev"]

