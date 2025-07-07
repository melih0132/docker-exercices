# Docker Skills

A comprehensive collection of Docker exercises and projects demonstrating various containerization techniques, from basic concepts to advanced multi-service orchestration.

## Skills Demonstrated

- **Container Basics**: Building and running simple containers
- **Multi-stage Builds**: Optimizing image sizes and build processes
- **Docker Compose**: Orchestrating multi-service applications
- **CI/CD Integration**: GitLab CI and GitHub Actions pipelines
- **Database Management**: MySQL, PostgreSQL, MongoDB, Redis
- **Web Servers**: Nginx, Apache configurations
- **Development Workflows**: Hot reloading, volume mounting
- **Production Deployment**: Optimized production-ready containers

## Project Structure

| Exercise | Description | Technologies |
|----------|-------------|--------------|
| [01-basic-containers](./01-basic-containers/) | Simple Alpine containers with custom commands | Alpine Linux |
| [02-sass-compilation](./02-sass-compilation/) | Node.js container for SCSS compilation with hot reloading | Node.js, Sass |
| [03-nodejs-mongodb](./03-nodejs-mongodb/) | Full-stack application with Node.js backend and MongoDB | Node.js, MongoDB |
| [04-php-apache-mariadb](./04-php-apache-mariadb/) | PHP application with Apache and MariaDB, including CI/CD | PHP, Apache, MariaDB, GitLab CI |
| [05-multi-service-stack](./05-multi-service-stack/) | Complex multi-service application with multiple databases | PHP, Nginx, MariaDB, PostgreSQL, Redis |
| [06-todo-application](./06-todo-application/) | Complete Todo application with multi-service architecture | PHP, Nginx, MariaDB, PostgreSQL, Redis |
| [07-production-todo-app](./07-production-todo-app/) | Production-ready Todo application with CI/CD pipeline | PHP, Nginx, PostgreSQL, Redis, GitHub Actions |

## Quick Start

Each exercise is self-contained with its own README and instructions. Navigate to any exercise directory and follow the setup instructions.

### Prerequisites

- Docker Desktop or Docker Engine
- Docker Compose
- Git

### Example: Running the Todo Application

```bash
cd 06-todo-application
docker compose up -d
# Access at http://localhost:8080
```

## Technologies Used

- **Containerization**: Docker, Docker Compose
- **Languages**: PHP, Node.js, JavaScript
- **Databases**: MySQL, PostgreSQL, MongoDB, Redis
- **Web Servers**: Nginx, Apache
- **CI/CD**: GitLab CI, GitHub Actions
- **Build Tools**: Composer, npm, Sass

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Author**: Melih Cetinkaya  
**Course**: Virtualization and Containerization
