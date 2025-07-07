# Multi-Service Application Stack

## Overview

This exercise demonstrates a complex multi-service application architecture using Docker Compose to orchestrate PHP, Nginx, MariaDB, PostgreSQL, and Redis services with proper dependency management, data persistence, and production-ready configurations including health checks and container labels.

## Objectives

- Orchestrate multiple services with Docker Compose
- Implement PHP-FPM with Nginx web server
- Configure multiple database systems (MariaDB, PostgreSQL)
- Integrate Redis caching layer
- Manage PHP dependencies with Composer
- Practice data persistence with Docker volumes
- Implement health checks and container monitoring
- Use proper container labels and metadata

## Project Structure

```
05-multi-service-stack/
├── src/
│   └── index.php          # PHP application entry point
├── docker-compose.yml     # Multi-service orchestration
├── nginx.conf             # Nginx server configuration
├── composer.json          # PHP dependencies
├── composer.lock          # Locked PHP dependencies
├── Dockerfile             # PHP-Apache container definition
└── README.md             # This file
```

## Implementation

### Professional PHP Container

PHP container with build arguments for version flexibility and proper metadata.

**Dockerfile:**
```dockerfile
# Define PHP version as build argument with default value
ARG PHP_VERSION="8.1"

# Use the specified PHP version to create the image
FROM php:${PHP_VERSION}-apache

LABEL maintainer="Melih Cetinkaya"
LABEL description="PHP application with Apache web server"
LABEL version="1.0"

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-install zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy PHP file
COPY index.php /var/www/html/

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1
```

### Docker Compose Configuration

The application orchestrates five services with proper networking and volume management:

```yaml
version: '3.8'

services:
  web:
    build: .
    container_name: php-apache-app
    ports:
      - "8081:80"  # Map host port 8081 to container port 80
    volumes:
      - .:/var/www/html  # Mount current directory to /var/www/html in container
    networks:
      - app-network  # Declare network for service communication
    restart: unless-stopped

  mariadb:
    image: mariadb:10.5
    container_name: mariadb-db
    environment:
      MYSQL_ROOT_PASSWORD: root  # Root password for database
      MARIADB_DATABASE: mydb  # Create database "mydb" on startup
      MARIADB_USER: app_user
      MARIADB_PASSWORD: app_password
    volumes:
      - mariadb-data:/var/lib/mysql  # Persist database data
    ports:
      - "3306:3306"
    networks:
      - app-network  # Use same network to communicate with web service
    restart: unless-stopped

  phpmyadmin:
    image: phpmyadmin/phpmyadmin:latest
    container_name: phpmyadmin
    environment:
      PMA_HOST: mariadb  # Specify that phpMyAdmin should connect to mariadb service
      PMA_PORT: 3306  # Default MariaDB port
      PMA_USER: root
      PMA_PASSWORD: root
    ports:
      - "8082:80"  # Map host port 8082 to container port 80
    depends_on:
      - mariadb
    networks:
      - app-network  # Use same network to communicate with other services
    restart: unless-stopped

networks:
  app-network:
    driver: bridge  # Define virtual network for service communication

volumes:
  mariadb-data:
    driver: local  # Create local volume to store database data
```

### Nginx Configuration

Custom Nginx configuration for serving PHP applications:

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    server {
        listen 80;
        server_name localhost;
        root /var/www/html;
        index index.php;
        
        location / {
            try_files $uri $uri/ /index.php?$query_string;
        }
        
        location ~ \.php$ {
            fastcgi_pass web:9000;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include fastcgi_params;
        }
    }
}
```

## Usage

### Prerequisites

- Docker and Docker Compose installed
- Composer (for local development)

### Starting the Application

```bash
# Clone the repository
git clone <repository-url>
cd 05-multi-service-stack

# Start all services
docker compose up -d

# Access the application
# Web Application: http://localhost:8081
# phpMyAdmin: http://localhost:8082
```

### Service Management

```bash
# View service logs
docker compose logs -f

# View specific service logs
docker compose logs nginx
docker compose logs web
docker compose logs mariadb

# Stop all services
docker compose down

# Rebuild and restart
docker compose up --build -d

# Check service health
docker compose ps
```

### Database Access

```bash
# Access MariaDB
docker compose exec mariadb mysql -u root -p

# Access PostgreSQL
docker compose exec postgres psql -U postgres -d app_db

# Access Redis CLI
docker compose exec redis redis-cli
```

## Key Learning Points

- **Service Orchestration**: Managing multiple interconnected services
- **PHP-FPM Integration**: Running PHP with FastCGI Process Manager
- **Multi-Database Architecture**: Using different database systems simultaneously
- **Caching Layer**: Redis integration for performance optimization
- **Volume Persistence**: Maintaining data across container restarts
- **Network Isolation**: Secure inter-service communication
- **Dependency Management**: Composer integration in containers
- **Health Checks**: Monitoring application and service health
- **Container Labels**: Professional metadata for better organization
- **Restart Policies**: Ensuring service availability

## Service Architecture

### Web Layer
- **Nginx**: Reverse proxy and static file server
- **PHP-FPM**: PHP FastCGI Process Manager for dynamic content

### Database Layer
- **MariaDB**: Primary relational database
- **PostgreSQL**: Secondary relational database
- **Redis**: In-memory caching and session storage

### Network Configuration
- **Bridge Network**: Isolated network for service communication
- **Port Mapping**: External access to web application
- **Service Discovery**: Automatic hostname resolution

## Development Workflow

1. **Local Development**: Use Docker Compose for consistent environment
2. **Code Changes**: Mount source code as volumes for live development
3. **Dependency Management**: Composer installs PHP dependencies automatically
4. **Database Management**: Access databases through container shells
5. **Testing**: Test application with multiple database backends

## Best Practices Demonstrated

- **Build Arguments**: Flexible version management
- **Alpine Images**: Using lightweight base images where possible
- **Health Checks**: Implementing proper service monitoring
- **Volume Management**: Optimizing data persistence
- **Network Isolation**: Secure inter-service communication
- **Container Labels**: Professional metadata organization
- **Restart Policies**: Ensuring high availability
- **English Comments**: Professional documentation standards

## Production Considerations

- Implement proper security configurations for all services
- Use environment variables for sensitive data
- Configure backup strategies for all databases
- Set up monitoring and logging for all services
- Implement health checks and restart policies
- Use production-ready images with security patches
- Configure SSL/TLS certificates for HTTPS

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 8081, 8082, 3306, 5432, 6379 are available
2. **Permission Issues**: Check file permissions for mounted volumes
3. **Service Dependencies**: Ensure proper startup order in docker-compose.yml
4. **Memory Limits**: Monitor resource usage for multiple services
5. **Health Check Failures**: Check application endpoints and configurations

### Debug Commands

```bash
# Check service status
docker compose ps

# View detailed logs
docker compose logs --tail=100

# Access container shell
docker compose exec web bash
docker compose exec nginx bash

# Check network connectivity
docker compose exec web ping mariadb
docker compose exec web ping postgres
docker compose exec web ping redis

# Monitor resource usage
docker stats
```

## Next Steps

This exercise demonstrates advanced multi-service orchestration. The final exercise will focus on production-ready applications with complete CI/CD pipelines and microservices architecture.