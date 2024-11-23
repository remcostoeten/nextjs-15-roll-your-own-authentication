#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting database reset process...${NC}"

# 1. Stop and remove containers, volumes
echo -e "${BLUE}1. Cleaning up existing containers and volumes...${NC}"
docker-compose down -v
docker system prune -f
echo -e "${GREEN}✓ Cleanup complete${NC}"

# 2. Generate new credentials
DB_USER="postgres"
DB_PASSWORD=$(openssl rand -base64 12)
DB_NAME="auth_system"
DB_PORT="5432"

# 3. Update docker-compose.yml
echo -e "${BLUE}2. Updating docker-compose.yml...${NC}"
cat > docker-compose.yml << EOF
version: "3.8"
services:
  db:
    image: postgres:latest
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "${DB_PORT}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
EOF
echo -e "${GREEN}✓ docker-compose.yml updated${NC}"

# 4. Update .env file
echo -e "${BLUE}3. Updating DATABASE_URL in .env...${NC}"
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}"
sed -i.bak "s#DATABASE_URL=.*#DATABASE_URL=\"${DATABASE_URL}\"#" .env
echo -e "${GREEN}✓ .env updated${NC}"

# 5. Start containers
echo -e "${BLUE}4. Starting Docker containers...${NC}"
docker-compose up -d

# 6. Wait for database to be ready
echo -e "${BLUE}5. Waiting for database to be ready...${NC}"
sleep 5

# 7. Push schema
echo -e "${BLUE}6. Pushing database schema...${NC}"
npm run db:push

# 8. Verify connection
echo -e "${BLUE}7. Verifying database connection...${NC}"
if docker exec -it $(docker ps -qf "name=db") pg_isready -U ${DB_USER}; then
    echo -e "${GREEN}✅ Database reset complete!${NC}"
    echo -e "${BLUE}New database credentials:${NC}"
    echo -e "User: ${DB_USER}"
    echo -e "Password: ${DB_PASSWORD}"
    echo -e "Database: ${DB_NAME}"
    echo -e "Port: ${DB_PORT}"
    echo -e "Connection URL: ${DATABASE_URL}"
else
    echo -e "${RED}❌ Database connection failed${NC}"
    exit 1
fi 
