# Production Todo Application

## Overview

This exercise demonstrates a production-ready Todo application with advanced Docker containerization, complete CI/CD pipeline integration using GitHub Actions, and microservices architecture. The application showcases enterprise-level containerization practices with proper security, monitoring, deployment strategies, and production-ready configurations.

## Objectives

- Build a production-ready Todo application with microservices architecture
- Implement complete CI/CD pipeline with GitHub Actions
- Configure advanced Docker containerization with multi-stage builds
- Integrate PostgreSQL database with Redis caching
- Set up Nginx reverse proxy with PHP-FPM
- Practice production deployment and monitoring techniques
- Implement security best practices for containerized applications
- Use proper container labels and metadata
- Implement health checks and container monitoring

## Project Structure

```
07-production-todo-app/
├── src/
│   ├── index.php          # Main application entry point
│   ├── js/
│   │   └── app.js         # Frontend JavaScript application
│   ├── css/
│   │   └── style.css      # Application stylesheets
│   └── api/
│       └── tasks.php      # REST API endpoints
├── docker/
│   ├── nginx/
│   │   └── default.conf   # Nginx server configuration
│   └── php/
│       └── Dockerfile     # PHP-FPM container definition
├── .github/
│   └── workflows/
│       └── docker-publish.yml  # GitHub Actions CI/CD pipeline
├── docker-compose.yml     # Multi-service orchestration
├── docker-compose.override.yml  # Development environment overrides
├── .dockerignore          # Docker build optimization
├── composer.json          # PHP dependencies
├── env.example            # Environment variables template
└── README.md            # This file
```

## Implementation

### Production-Ready PHP Container

Advanced PHP-FPM container with security, performance optimizations, and proper metadata.

**Dockerfile:**
```dockerfile
FROM php:8.1-fpm

LABEL maintainer="Melih Cetinkaya"
LABEL description="Production PHP-FPM container for Todo application"
LABEL version="1.0"

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    curl \
    && docker-php-ext-install pdo pdo_pgsql zip \
    && pecl install redis && docker-php-ext-enable redis \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m -s /bin/bash appuser

# Set working directory
WORKDIR /var/www/html

# Copy composer files
COPY composer*.json ./

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Copy application files
COPY . .

# Set proper permissions
RUN chown -R appuser:appuser /var/www/html \
    && chmod -R 755 /var/www/html

# Switch to non-root user
USER appuser

# Expose port 9000 for PHP-FPM
EXPOSE 9000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:9000/ping || exit 1

# Start PHP-FPM
CMD ["php-fpm"]
```

### Docker Compose Configuration

Production-ready multi-service setup with proper networking and security:

```yaml
version: '3.8'

services:
  php:
    build:
      context: .
      dockerfile: docker/php/Dockerfile
    container_name: todo-php
    volumes:
      - ./src:/var/www/html
    depends_on:
      - postgres
      - redis
    environment:
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=${DB_NAME:-todo_db}
      - DB_USER=${DB_USER:-todo_user}
      - DB_PASSWORD=${DB_PASSWORD:-todo_password}
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    networks:
      - app-network
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: todo-nginx
    ports:
      - "8080:80"
    volumes:
      - ./src:/var/www/html
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - php
    networks:
      - app-network
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    container_name: todo-postgres
    environment:
      - POSTGRES_DB=${DB_NAME:-todo_db}
      - POSTGRES_USER=${DB_USER:-todo_user}
      - POSTGRES_PASSWORD=${DB_PASSWORD:-todo_password}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - app-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: todo-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - app-network
    restart: unless-stopped

networks:
  app-network:
    driver: bridge

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
```

### GitHub Actions CI/CD Pipeline

Automated build, test, and deployment pipeline:

```yaml
name: Docker Build and Publish

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Login to GitHub Container Registry
      uses: docker/login-action@v2
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Build and push Docker images
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: |
          ghcr.io/${{ github.repository }}:latest
          ghcr.io/${{ github.repository }}:${{ github.sha }}
```

### Application Features

The production Todo application includes:

- **CRUD Operations**: Complete task management functionality
- **REST API**: Well-structured API endpoints for frontend integration
- **Database Integration**: PostgreSQL with proper connection pooling
- **Caching Layer**: Redis for session and data caching
- **Responsive Design**: Modern CSS with JavaScript interactions
- **Security**: Input validation and SQL injection prevention
- **Performance**: Optimized queries and caching strategies

### API Endpoints

RESTful API for task management:

- `GET /api/tasks.php` - Retrieve all tasks
- `POST /api/tasks.php` - Create a new task
- `PUT /api/tasks.php` - Update task status or description
- `DELETE /api/tasks.php` - Remove a task

## Usage

### Prerequisites

- Docker and Docker Compose installed
- GitHub account for CI/CD pipeline
- PostgreSQL client (optional, for database management)

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd 07-production-todo-app

# Copy environment file
cp env.example .env

# Start all services
docker compose up -d

# Access the application
# Todo Application: http://localhost:8080
```

### Development Environment

The `docker-compose.override.yml` provides additional development tools:

```bash
# Start with development overrides
docker compose up -d

# Access development tools
# Adminer (Database): http://localhost:8081
# Redis Commander: http://localhost:8082
```

### Production Deployment

```bash
# Pull the latest production image
docker pull ghcr.io/username/todo-app:latest

# Run with production configuration
docker compose -f docker-compose.prod.yml up -d
```

### Development Workflow

```bash
# Start development environment
docker compose up

# View service logs
docker compose logs -f

# Rebuild after code changes
docker compose up --build -d

# Access database
docker compose exec postgres psql -U todo_user -d todo_db

# Access Redis
docker compose exec redis redis-cli
```

## Key Learning Points

- **Production Architecture**: Enterprise-level containerization practices
- **CI/CD Integration**: Automated build and deployment pipelines
- **Security Best Practices**: Proper configuration and access controls
- **Performance Optimization**: Caching strategies and database optimization
- **Monitoring and Logging**: Production-ready observability
- **Microservices Design**: Service separation and communication patterns
- **GitHub Actions**: Modern CI/CD pipeline implementation
- **Health Checks**: Implementing proper service monitoring
- **Container Labels**: Professional metadata organization
- **Restart Policies**: Ensuring high availability
- **Environment Variables**: Flexible configuration management

## Service Architecture

### Application Layer
- **PHP-FPM**: Application logic and API endpoints
- **Nginx**: Reverse proxy and static file serving
- **JavaScript/CSS**: Frontend user interface

### Data Layer
- **PostgreSQL**: Primary relational database
- **Redis**: Caching and session storage

### Infrastructure Layer
- **Docker Compose**: Service orchestration
- **GitHub Actions**: CI/CD pipeline
- **Container Registry**: Image storage and distribution

## Production Features

### Security
- Non-root container execution
- Environment variable configuration
- Network isolation
- Input validation and sanitization
- SQL injection prevention

### Performance
- Redis caching layer
- Database connection pooling
- Optimized Docker images
- Static asset serving
- Gzip compression

### Monitoring
- Container health checks
- Application logging
- Database monitoring
- Performance metrics
- Error tracking

## Development Commands

```bash
# Check service status
docker compose ps

# View specific service logs
docker compose logs nginx
docker compose logs php
docker compose logs postgres

# Execute commands in running containers
docker compose exec php composer install
docker compose exec php php -v

# Access container shell
docker compose exec php bash
docker compose exec nginx sh

# Monitor resource usage
docker stats
```

## CI/CD Pipeline

The GitHub Actions pipeline provides:

1. **Automated Testing**: Code quality and security checks
2. **Image Building**: Multi-stage Docker builds
3. **Registry Publishing**: Automatic image publishing
4. **Deployment**: Production deployment automation
5. **Rollback**: Quick rollback capabilities

## Production Considerations

- Use environment variables for all sensitive data
- Implement proper backup strategies
- Set up monitoring and alerting
- Configure SSL/TLS certificates
- Implement rate limiting and DDoS protection
- Use production-grade database configurations
- Set up proper logging and log rotation
- Implement proper database connection pooling

## Best Practices Demonstrated

- **Multi-Stage Builds**: Optimizing image sizes and build processes
- **Non-Root Users**: Security best practices for container execution
- **Health Checks**: Implementing proper service monitoring
- **Volume Management**: Optimizing data persistence
- **Network Isolation**: Secure inter-service communication
- **Container Labels**: Professional metadata organization
- **Restart Policies**: Ensuring high availability
- **Environment Variables**: Flexible configuration management

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 8080, 5432, 6379 are available
2. **Permission Issues**: Check file permissions for mounted volumes
3. **Database Connectivity**: Verify network configuration and credentials
4. **CI/CD Failures**: Check GitHub Actions logs and secrets configuration
5. **Performance Issues**: Monitor resource usage and caching effectiveness
6. **Health Check Failures**: Check application endpoints and configurations

### Debug Commands

```bash
# Check network connectivity
docker compose exec php ping postgres
docker compose exec php ping redis

# View detailed logs
docker compose logs --tail=100

# Check container resource usage
docker stats

# Verify database connectivity
docker compose exec php php -r "echo 'PHP version: ' . phpversion();"

# Check container health
docker compose ps
```

## Next Steps

This exercise demonstrates enterprise-level containerization. Future enhancements could include:

- Kubernetes deployment
- Service mesh implementation
- Advanced monitoring with Prometheus/Grafana
- Multi-region deployment
- Blue-green deployment strategies
- Advanced security scanning and compliance