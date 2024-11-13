
#!/bin/bash

# Stop all containers
docker-compose down

# Force stop the PostgreSQL container
docker stop auth_system_db

# Remove the container
docker rm auth_system_db

# Remove the volume
docker volume rm v0-auth_postgres_data

# Remove any orphaned volumes
docker volume prune -f

# Start fresh
docker-compose up -d 
