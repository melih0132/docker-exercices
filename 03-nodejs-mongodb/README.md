# Node.js Application with MongoDB

## Overview

This exercise demonstrates a full-stack application using Node.js backend with MongoDB database, containerized with Docker Compose for easy development and deployment. The application includes proper health checks, container labels, and production-ready configurations.

## Objectives

- Build a Node.js application with MongoDB integration
- Implement Docker Compose for multi-service orchestration
- Practice database connectivity in containerized environments
- Learn service dependency management
- Implement health checks and container monitoring
- Use proper container labels and metadata

## Project Structure

```
03-nodejs-mongodb/
├── css/
│   └── styles.css          # Compiled CSS styles
├── scss/
│   ├── components/
│   │   └── _homepage.scss  # Component styles
│   ├── _settings.scss      # SASS variables
│   └── styles.scss         # Main SASS file
├── index.html              # Frontend application
├── package.json            # Node.js dependencies
├── package-lock.json       # Locked dependencies
├── Dockerfile              # Node.js application container
├── docker-compose.yml      # Multi-service orchestration
└── README.md              # This file
```

## Implementation

### Professional Node.js Container

A Node.js container with health checks and proper metadata for production use.

**Dockerfile:**
```dockerfile
FROM node:19-alpine

LABEL maintainer="Melih Cetinkaya"
LABEL description="Node.js application with MongoDB integration"
LABEL version="1.0"

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "server.js"]
```

### Docker Compose Configuration

The application uses Docker Compose to orchestrate two services with proper networking and restart policies:

```yaml
version: '3.8'

services:
  backend:
    build: .
    container_name: nodejs-backend
    ports:
      - "3000:3000"
    depends_on:
      - mongo
    environment:
      MONGO_URL: mongodb://mongo:27017/mydb
      NODE_ENV: development
    volumes:
      - .:/app
      - /app/node_modules
    networks:
      - app-network
    restart: unless-stopped

  mongo:
    image: mongo:7
    container_name: mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: mydb
    volumes:
      - mongo-data:/data/db
    networks:
      - app-network
    restart: unless-stopped

networks:
  app-network:
    driver: bridge

volumes:
  mongo-data:
    driver: local
```

## Usage

### Starting the Application

```bash
# Build and start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

### Development Workflow

```bash
# Start services in development mode
docker compose up

# Rebuild after code changes
docker compose up --build -d

# Access MongoDB shell
docker compose exec mongo mongosh

# Check container health
docker compose ps
```

### Production Deployment

```bash
# Build production images
docker compose -f docker-compose.prod.yml up -d

# Scale services
docker compose up -d --scale backend=3
```

## Accessing the Application

- **Frontend**: http://localhost:3000
- **MongoDB**: localhost:27017
- **Health Check**: http://localhost:3000/health

## Key Learning Points

- **Service Orchestration**: Managing multiple containers with Docker Compose
- **Database Integration**: Connecting Node.js applications to MongoDB
- **Environment Variables**: Configuring service communication
- **Volume Persistence**: Maintaining database data across container restarts
- **Service Dependencies**: Managing startup order and connectivity
- **Health Checks**: Monitoring application and service health
- **Container Labels**: Professional metadata for better organization
- **Restart Policies**: Ensuring service availability

## Docker Compose Features Used

- **Services**: Defining multiple application components
- **Networks**: Automatic network creation for service communication
- **Volumes**: Persistent data storage for databases
- **Environment Variables**: Service configuration and connectivity
- **Port Mapping**: Exposing services to host system
- **Restart Policies**: Automatic service recovery
- **Health Checks**: Service monitoring and status

## Development Commands

```bash
# Check service status
docker compose ps

# View specific service logs
docker compose logs backend
docker compose logs mongo

# Execute commands in running containers
docker compose exec backend npm install
docker compose exec backend node -v

# Access container shell
docker compose exec backend sh
docker compose exec mongo mongosh

# Monitor resource usage
docker stats
```

## Production Considerations

- Use production MongoDB images with security configurations
- Implement proper environment variable management
- Add comprehensive health checks for service monitoring
- Configure backup strategies for database volumes
- Implement proper logging and monitoring
- Use production-grade Node.js configurations
- Set up proper network security and access controls

## Best Practices Demonstrated

- **Alpine Images**: Using lightweight Alpine-based images
- **Health Checks**: Implementing proper service monitoring
- **Volume Management**: Optimizing data persistence
- **Network Isolation**: Secure inter-service communication
- **Restart Policies**: Ensuring high availability
- **Container Labels**: Professional metadata organization

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 3000, 27017 are available
2. **Database Connectivity**: Verify network configuration and credentials
3. **Health Check Failures**: Check application endpoints and configurations
4. **Volume Permissions**: Ensure proper file permissions for mounted volumes

### Debug Commands

```bash
# Check network connectivity
docker compose exec backend ping mongo

# View detailed logs
docker compose logs --tail=100

# Check container resource usage
docker stats

# Verify MongoDB connectivity
docker compose exec backend node -e "console.log('Node.js version:', process.version)"
```

## Next Steps

This exercise demonstrates basic multi-service orchestration. The next exercises will introduce more complex architectures with additional services and CI/CD pipelines.