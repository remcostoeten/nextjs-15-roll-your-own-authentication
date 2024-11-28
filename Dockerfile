# Use an official Node runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

# Add these lines before npm install if needed
RUN chown -R node:node /app
USER node

