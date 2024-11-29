# Use an official Node runtime as a parent image
FROM node:18-alpine

# Install pnpm globally first
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set the working directory
WORKDIR /app

# Copy package files with root
COPY package*.json pnpm-lock.yaml* ./

# Set correct permissions
RUN mkdir -p node_modules && \
    chown -R node:node /app

# Switch to non-root user
USER node

# Install dependencies
RUN pnpm install

# Copy the rest of the code
COPY --chown=node:node . .

# Build the application
RUN pnpm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
