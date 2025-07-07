# Basic Containers Exercise

## Overview

This exercise demonstrates fundamental Docker container concepts by creating simple Alpine Linux containers with custom commands and proper container metadata.

## Objectives

- Understand basic Docker container creation
- Learn to use Alpine Linux as a base image
- Practice custom command execution in containers
- Master basic Docker commands (build, run)
- Implement proper container labels and metadata

## Project Structure

```
01-basic-containers/
├── Dockerfile          # Container definition with labels
└── README.md          # This file
```

## Implementation

### Container with Professional Labels

A basic Alpine container that displays a greeting message with proper metadata.

**Dockerfile:**
```dockerfile
FROM alpine:latest

LABEL maintainer="Melih Cetinkaya"
LABEL description="Basic Docker container demonstration"
LABEL version="1.0"

CMD echo "Hello, Professor! This is a basic Docker container demonstration."
```

## Usage

### Building the Image

```bash
# Build the container
docker build -t basic-greeting .

# View image details
docker inspect basic-greeting
```

### Running the Container

```bash
# Run the basic greeting
docker run basic-greeting

# Run with custom name
docker run --name my-container basic-greeting
```

### Inspecting Container Metadata

```bash
# View labels
docker inspect basic-greeting --format='{{range $k, $v := .Config.Labels}}{{$k}}={{$v}}{{"\n"}}{{end}}'

# View image history
docker history basic-greeting
```

## Key Learning Points

- **Alpine Linux**: Lightweight base image for containers
- **CMD Instruction**: Default command executed when container starts
- **Image Building**: Creating custom images from Dockerfiles
- **Container Execution**: Running containers and viewing output
- **Container Labels**: Adding metadata for better organization
- **Image Inspection**: Viewing container details and metadata

## Docker Commands Covered

- `docker build`: Build an image from a Dockerfile
- `docker run`: Create and start a container from an image
- `docker images`: List all images on the system
- `docker inspect`: Display detailed information about containers/images
- `docker history`: Show the history of an image

## Best Practices Demonstrated

- **Specific Base Images**: Using `alpine:latest` instead of just `alpine`
- **Container Labels**: Adding maintainer, description, and version metadata
- **Professional Messages**: Using English for international compatibility
- **Image Organization**: Proper labeling for better container management

## Next Steps

This exercise provides the foundation for more complex containerization scenarios. The next exercises will build upon these concepts to create more sophisticated applications with multi-service architectures. 
