# PHP Application with Apache and MariaDB

## Overview

This exercise demonstrates a complete PHP web application with Apache web server and MariaDB database, including CI/CD pipeline integration with GitLab and Docker Compose orchestration. The application features proper container labels, health checks, and production-ready configurations.

## Objectives

- Containerize PHP applications with Apache
- Implement MariaDB database integration
- Set up GitLab CI/CD pipelines for automated deployment
- Practice multi-version PHP builds with build arguments
- Orchestrate services with Docker Compose
- Implement health checks and container monitoring
- Use proper container labels and metadata

## Project Structure

```
04-php-apache-mariadb/
├── database/              # MariaDB data persistence
├── index.php              # PHP application entry point
├── Dockerfile             # PHP-Apache container definition
├── docker-compose.yml     # Multi-service orchestration
├── patie-1-gitlab-ci.yml  # GitLab CI configuration (Part 1)
├── patie-2-gitlab-ci.yml  # GitLab CI configuration (Part 2)
└── README.md             # This file
```

## Implementation

### Part 1: Professional PHP Container

PHP application container with build arguments for version flexibility and proper metadata.

**Dockerfile:**
```dockerfile
# Define PHP version as build argument
ARG PHP_VERSION="8.1"

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

# Copy application files
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

### Part 2: Multi-Version PHP Support

Dockerfile with build arguments for different PHP versions:

```bash
# Build with specific PHP version
docker build --build-arg PHP_VERSION=8.2 -t php-app:8.2 .

# Run the container
docker run -p 8081:80 php-app:8.2
```

### Part 3: GitLab CI/CD Pipeline

Optimized CI/CD configuration with reusable jobs:

```yaml
stages:
  - build

.build-image:
  script:
    - docker build --build-arg PHP_VERSION=$PHP_VERSION -t $CI_REGISTRY_IMAGE/ex5:$PHP_VERSION .
    - docker push $CI_REGISTRY_IMAGE/ex5:$PHP_VERSION

build-image-8.1:
  extends:
    - .build-image
  variables:
    PHP_VERSION: '8.1'

build-image-8.2:
  extends:
    - .build-image
  variables:
    PHP_VERSION: '8.2'

build-image-8.3:
  extends:
    - .build-image
  variables:
    PHP_VERSION: '8.3'
```

### Part 4: Docker Compose Orchestration

Complete multi-service setup with web, database, and admin interface:

```yaml
version: '3.8'

services:
  web:
    build: .
    container_name: php-apache-app
    ports:
      - "8081:80"
    depends_on:
      - mariadb
    environment:
      - APACHE_DOCUMENT_ROOT=/var/www/html
    volumes:
      - .:/var/www/html
    networks:
      - app-network
    restart: unless-stopped

  mariadb:
    image: mariadb:10.5
    container_name: mariadb-db
    environment:
      MYSQL_ROOT_PASSWORD: root
      MARIADB_DATABASE: mydb
      MARIADB_USER: app_user
      MARIADB_PASSWORD: app_password
    volumes:
      - mariadb-data:/var/lib/mysql
    ports:
      - "3306:3306"
    networks:
      - app-network
    restart: unless-stopped

  phpmyadmin:
    image: phpmyadmin/phpmyadmin:latest
    container_name: phpmyadmin
    environment:
      PMA_HOST: mariadb
      PMA_PORT: 3306
      PMA_USER: root
      PMA_PASSWORD: root
    ports:
      - "8082:80"
    depends_on:
      - mariadb
    networks:
      - app-network
    restart: unless-stopped

networks:
  app-network:
    driver: bridge

volumes:
  mariadb-data:
    driver: local
```

## Usage

### Local Development

```bash
# Build and start all services
docker compose up -d

# Access the application
# PHP Application: http://localhost:8081
# phpMyAdmin: http://localhost:8082
```

### GitLab CI/CD Pipeline

The pipeline automatically builds and deploys images for multiple PHP versions:

1. **Build Stage**: Creates Docker images for PHP 8.1, 8.2, and 8.3
2. **Registry Push**: Pushes images to GitLab Container Registry
3. **Optimization**: Uses reusable job templates to reduce code duplication

### Testing Different PHP Versions

```bash
# Build with specific PHP version
docker build --build-arg PHP_VERSION=8.2 -t php-app:8.2 .

# Run the container
docker run -p 8081:80 php-app:8.2

# Test multiple versions
docker run -p 8081:80 php-app:8.1
docker run -p 8082:80 php-app:8.2
docker run -p 8083:80 php-app:8.3
```

## Key Learning Points

- **Build Arguments**: Parameterizing Docker builds for different versions
- **CI/CD Integration**: Automated build and deployment pipelines
- **Service Orchestration**: Managing web, database, and admin services
- **Volume Persistence**: Maintaining database data across deployments
- **Network Configuration**: Service communication in Docker networks
- **Health Checks**: Monitoring application and service health
- **Container Labels**: Professional metadata for better organization
- **Restart Policies**: Ensuring service availability

## Docker Compose Features

- **Multi-Service Architecture**: Web server, database, and admin interface
- **Volume Management**: Persistent database storage
- **Network Isolation**: Secure service communication
- **Environment Configuration**: Database credentials and connection settings
- **Port Mapping**: Service access from host system
- **Restart Policies**: Automatic service recovery
- **Health Checks**: Service monitoring and status

## Development Workflow

1. **Local Development**: Use Docker Compose for local testing
2. **Code Changes**: Modify PHP application code
3. **CI/CD Pipeline**: Automatic builds on GitLab push
4. **Registry Storage**: Images stored in GitLab Container Registry
5. **Deployment**: Pull and run images in production environment

## Best Practices Demonstrated

- **Build Arguments**: Flexible version management
- **Alpine Images**: Using lightweight base images where possible
- **Health Checks**: Implementing proper service monitoring
- **Volume Management**: Optimizing data persistence
- **Network Isolation**: Secure inter-service communication
- **Container Labels**: Professional metadata organization
- **Restart Policies**: Ensuring high availability

## Production Considerations

- Implement proper security configurations for MariaDB
- Use environment variables for sensitive data
- Configure proper backup strategies
- Set up monitoring and logging
- Implement health checks for all services
- Use production-ready images with security patches
- Configure SSL/TLS certificates for HTTPS

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 8081, 8082, 3306 are available
2. **Database Connectivity**: Verify network configuration and credentials
3. **Health Check Failures**: Check application endpoints and configurations
4. **Permission Issues**: Ensure proper file permissions for mounted volumes

### Debug Commands

```bash
# Check service status
docker compose ps

# View detailed logs
docker compose logs --tail=100

# Access container shell
docker compose exec web bash
docker compose exec mariadb mysql -u root -p

# Check network connectivity
docker compose exec web ping mariadb
```

## Next Steps

This exercise demonstrates advanced containerization with CI/CD. The next exercises will focus on complex multi-service architectures with additional databases and caching layers.
