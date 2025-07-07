# SASS Compilation with Docker

## Overview

This exercise demonstrates how to use Docker for frontend development workflows, specifically SASS compilation with hot reloading capabilities using Node.js containers.

## Objectives

- Containerize Node.js development environment
- Implement SASS compilation workflows
- Set up hot reloading for development
- Practice volume mounting for live development
- Use proper container labels and metadata

## Project Structure

```
02-sass-compilation/
├── css/
│   └── styles.css          # Compiled CSS output
├── scss/
│   ├── components/
│   │   └── _homepage.scss  # Component styles
│   ├── _settings.scss      # SASS variables and settings
│   └── styles.scss         # Main SASS file
├── index.html              # Sample HTML file
├── package.json            # Node.js dependencies
├── package-lock.json       # Locked dependencies
├── Dockerfile              # Node.js container for SASS compilation
└── README.md              # This file
```

## Implementation

### Professional Node.js Container

A Node.js container specifically configured for SASS compilation with proper metadata.

**Dockerfile:**
```dockerfile
FROM node:19-alpine

LABEL maintainer="Melih Cetinkaya"
LABEL description="SASS compilation container with hot reloading"
LABEL version="1.0"

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port for live reload (if needed)
EXPOSE 35729

# Default command to compile SASS
CMD ["npm", "run", "sass-compile"]
```

### Method 1: Interactive Node.js Container

Run a Node.js container in interactive mode for development:

```bash
# Start interactive container with volume mounting
docker run -v %cd%:/app -it node:19-alpine bash

# Inside the container
cd /app
npm install
npm run sass-compile
```

### Method 2: Automated Build Process

Create a Dockerfile for automated SASS compilation:

```bash
# Build the image
docker build -t sass-compiler .

# Run the compilation
docker run sass-compiler
```

## Usage

### Interactive Development

```bash
# Start development container
docker run -v %cd%:/app -it node:19-alpine bash

# Install dependencies
npm install

# Compile SASS
npm run sass-compile

# Watch for changes (optional)
npm run sass-watch
```

### Automated Build

```bash
# Build the image
docker build -t sass-compiler .

# Run the compilation
docker run sass-compiler

# Run with volume mounting for live development
docker run -v $(pwd):/app sass-compiler npm run sass-watch
```

### Production Build

```bash
# Build optimized image
docker build -t sass-compiler:production .

# Run production compilation
docker run sass-compiler:production
```

## NPM Scripts

- `sass-compile`: Compile SASS to CSS once
- `sass-watch`: Watch for SASS changes and recompile
- `livereload`: Start live reload server for development

## Key Learning Points

- **Volume Mounting**: Real-time file synchronization between host and container
- **Development Workflows**: Interactive development in containers
- **Build Optimization**: Multi-stage builds for production
- **Hot Reloading**: Live development with automatic recompilation
- **Container Labels**: Professional metadata for better organization
- **Node.js Integration**: Using Node.js ecosystem for frontend tooling

## Docker Commands Covered

- `docker run -v`: Mount volumes for file sharing
- `docker run -it`: Interactive terminal access
- `docker build`: Build images from Dockerfile
- `docker inspect`: View container metadata and labels

## Development Workflow

1. Mount source code as volume
2. Install dependencies in container
3. Run compilation tools
4. Watch for changes with hot reloading
5. Access compiled assets from host

## Best Practices Demonstrated

- **Alpine Images**: Using lightweight Alpine-based Node.js images
- **Layer Optimization**: Copying package files before source code
- **Port Exposure**: Exposing ports for development tools
- **Professional Labels**: Adding maintainer and description metadata
- **Workflow Flexibility**: Supporting both interactive and automated modes

## Next Steps

This exercise demonstrates development workflows in containers. The next exercises will focus on full-stack applications with databases and web servers.