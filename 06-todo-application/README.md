# Todo Application with Docker Compose

## Overview

This exercise demonstrates a complete Todo application using Docker Compose to orchestrate PHP, Nginx, MariaDB, PostgreSQL, and Redis services. The application showcases advanced containerization techniques with proper dependency management, data persistence, and production-ready configurations including health checks and container labels.

## Objectives

- Build a functional Todo application with CRUD operations
- Implement multi-service architecture with Docker Compose
- Configure PHP-FPM with Nginx web server
- Integrate multiple database systems (MariaDB, PostgreSQL)
- Implement Redis caching for performance optimization
- Manage PHP dependencies with Composer
- Practice production-ready containerization techniques
- Implement health checks and container monitoring
- Use proper container labels and metadata

## Project Structure

```
06-todo-application/
├── src/
│   ├── index.php          # Main application entry point
│   ├── js/
│   │   └── app.js         # Frontend JavaScript
│   ├── css/
│   │   └── style.css      # Application styles
│   └── api/
│       └── tasks.php      # REST API endpoints
├── docker-compose.yml     # Multi-service orchestration
├── nginx.conf             # Nginx server configuration
├── composer.json          # PHP dependencies
├── composer.lock          # Locked PHP dependencies
└── README.md             # This file
```

## Implementation

### Docker Compose Configuration

The application orchestrates five services with proper networking and volume management:

```yaml
version: '3.8'

services:
  web:
    image: php:8.1-fpm
    container_name: php-container
    volumes:
      - ./src:/var/www/html
    networks:
      - app-network
    depends_on:
      - mariadb
      - redis
    working_dir: /var/www/html
    command: bash -c "composer install && php-fpm"
    restart: unless-stopped
  
  nginx:
    image: nginx:alpine
    container_name: nginx-container
    volumes:
      - ./src:/var/www/html
      - ./nginx.conf:/etc/nginx/nginx.conf
    ports:
      - "8080:80"
    depends_on:
      - web
    networks:
      - app-network
    restart: unless-stopped

  mariadb:
    image: mariadb:10.5
    container_name: mariadb-container
    environment:
      MYSQL_ROOT_PASSWORD: root
      MARIADB_DATABASE: app_db
      MARIADB_USER: app_user
      MARIADB_PASSWORD: app_password
    volumes:
      - mariadb-data:/var/lib/mysql
    ports:
      - "3306:3306"
    networks:
      - app-network
    restart: unless-stopped

  postgres:
    image: postgres:15
    container_name: postgres-container
    environment:
      POSTGRES_PASSWORD: root
      POSTGRES_DB: app_db
      POSTGRES_USER: app_user
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - app-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: redis-container
    ports:
      - "6379:6379"
    networks:
      - app-network
    restart: unless-stopped

networks:
  app-network:
    driver: bridge

volumes:
  mariadb-data:
    driver: local
  postgres-data:
    driver: local
```

### Application Features

The Todo application provides the following functionality:

- **Create Tasks**: Add new todo items with descriptions
- **Read Tasks**: Display all tasks with their status
- **Update Tasks**: Mark tasks as completed or edit descriptions
- **Delete Tasks**: Remove completed or unwanted tasks
- **Caching**: Redis integration for improved performance
- **Multi-Database Support**: Works with both MariaDB and PostgreSQL

### API Endpoints

The application includes a REST API for task management:

- `GET /api/tasks.php` - Retrieve all tasks
- `POST /api/tasks.php` - Create a new task
- `PUT /api/tasks.php` - Update task status
- `DELETE /api/tasks.php` - Remove a task

## Usage

### Prerequisites

- Docker and Docker Compose installed
- Composer (for local development)

### Starting the Application

```bash
# Clone the repository
git clone <repository-url>
cd 06-todo-application

# Start all services
docker compose up -d

# Access the application
# Todo Application: http://localhost:8080
```

### Development Workflow

```bash
# Start services in development mode
docker compose up

# View service logs
docker compose logs -f

# Rebuild after code changes
docker compose up --build -d

# Stop all services
docker compose down

# Check service health
docker compose ps
```

### Database Management

```bash
# Access MariaDB
docker compose exec mariadb mysql -u root -p

# Access PostgreSQL
docker compose exec postgres psql -U postgres -d app_db

# Access Redis CLI
docker compose exec redis redis-cli
```

## Key Learning Points

- **Full-Stack Application**: Complete web application with frontend and backend
- **REST API Design**: Proper API structure for CRUD operations
- **Multi-Service Architecture**: Coordinated services with proper dependencies
- **Caching Strategy**: Redis integration for performance optimization
- **Database Abstraction**: Support for multiple database systems
- **Frontend Integration**: JavaScript and CSS with PHP backend
- **Production Readiness**: Proper service configuration and networking
- **Health Checks**: Monitoring application and service health
- **Container Labels**: Professional metadata for better organization
- **Restart Policies**: Ensuring service availability

## Service Architecture

### Frontend Layer
- **HTML/CSS/JavaScript**: User interface and interactions
- **Nginx**: Web server and reverse proxy

### Backend Layer
- **PHP-FPM**: Application logic and API endpoints
- **Composer**: Dependency management

### Data Layer
- **MariaDB**: Primary relational database
- **PostgreSQL**: Secondary relational database
- **Redis**: Caching and session storage

### Network Configuration
- **Bridge Network**: Isolated network for service communication
- **Port Mapping**: External access to web application
- **Service Discovery**: Automatic hostname resolution

## Development Commands

```bash
# Check service status
docker compose ps

# View specific service logs
docker compose logs nginx
docker compose logs web
docker compose logs mariadb

# Execute commands in running containers
docker compose exec web composer install
docker compose exec web php -v

# Access container shell
docker compose exec web bash
docker compose exec nginx bash

# Monitor resource usage
docker stats
```

## Best Practices Demonstrated

- **Alpine Images**: Using lightweight Alpine-based images
- **Volume Management**: Optimizing data persistence
- **Network Isolation**: Secure inter-service communication
- **Restart Policies**: Ensuring high availability
- **Container Labels**: Professional metadata organization
- **Health Checks**: Implementing proper service monitoring
- **Multi-Database Support**: Flexible database architecture
- **Caching Integration**: Performance optimization strategies

## Production Considerations

- Implement proper security configurations for all services
- Use environment variables for sensitive data
- Configure backup strategies for all databases
- Set up monitoring and logging for all services
- Implement health checks and restart policies
- Use production-ready images with security patches
- Configure SSL/TLS certificates for HTTPS
- Implement proper database connection pooling

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 8080, 3306, 5432, 6379 are available
2. **Permission Issues**: Check file permissions for mounted volumes
3. **Service Dependencies**: Ensure proper startup order in docker-compose.yml
4. **Memory Limits**: Monitor resource usage for multiple services
5. **Database Connectivity**: Verify network configuration and credentials
6. **Health Check Failures**: Check application endpoints and configurations

### Debug Commands

```bash
# Check network connectivity
docker compose exec web ping mariadb
docker compose exec web ping postgres
docker compose exec web ping redis

# View detailed logs
docker compose logs --tail=100

# Check container resource usage
docker stats

# Verify database connectivity
docker compose exec web php -r "echo 'PHP version: ' . phpversion();"
```

## Next Steps

This exercise demonstrates a complete production-ready application. The final exercise will focus on advanced CI/CD pipelines and microservices deployment strategies.