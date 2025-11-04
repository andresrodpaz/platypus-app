# Docker Deployment Guide

## Overview

Platypus QA Lab is fully containerized using Docker for consistent deployment across environments. This guide covers local development, production deployment, and CI/CD integration.

## Quick Start

### Production Deployment

\`\`\`bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
\`\`\`

### Development Mode

\`\`\`bash
# Run with hot reload
docker-compose -f docker-compose.dev.yml up

# Rebuild after dependency changes
docker-compose -f docker-compose.dev.yml up --build
\`\`\`

## Architecture

### Multi-Stage Build

The production Dockerfile uses a multi-stage build for optimization:

1. **deps**: Installs dependencies
2. **builder**: Builds the Next.js application
3. **runner**: Creates minimal production image

Benefits:
- Smaller image size (< 200MB)
- Faster deployments
- Better security (no build tools in production)
- Optimized layer caching

### Services

#### App Service
- Next.js application running on port 3000
- Connects to Supabase for data persistence
- Supports environment variable configuration
- Auto-restarts on failure

#### PostgreSQL Service (Optional)
- Local development database
- Automatically initializes with SQL scripts
- Persistent data storage with volumes
- Health checks for reliability

## Environment Variables

Create a `.env` file in the project root:

\`\`\`env
# Supabase (Required)
SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_POSTGRES_URL=your_postgres_url

# Email Notifications (Optional)
RESEND_API_KEY=your_resend_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
\`\`\`

## Deployment Options

### 1. Docker Compose (Recommended for VPS)

\`\`\`bash
# Production
docker-compose up -d

# With custom env file
docker-compose --env-file .env.production up -d

# Scale services
docker-compose up -d --scale app=3
\`\`\`

### 2. Docker Run

\`\`\`bash
# Build image
docker build -t platypus-qa-lab .

# Run container
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  --name platypus-qa \
  platypus-qa-lab
\`\`\`

### 3. Docker Swarm

\`\`\`bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml platypus

# Scale services
docker service scale platypus_app=3
\`\`\`

### 4. Kubernetes

\`\`\`yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: platypus-qa-lab
spec:
  replicas: 3
  selector:
    matchLabels:
      app: platypus-qa-lab
  template:
    metadata:
      labels:
        app: platypus-qa-lab
    spec:
      containers:
      - name: app
        image: ghcr.io/your-org/platypus-qa-lab:latest
        ports:
        - containerPort: 3000
        envFrom:
        - secretRef:
            name: platypus-secrets
\`\`\`

## CI/CD Integration

### GitHub Actions

The project includes automated Docker builds:

\`\`\`yaml
# .github/workflows/docker.yml
- Builds on push to main/develop
- Creates multi-platform images (amd64, arm64)
- Pushes to GitHub Container Registry
- Tags with version, branch, and SHA
\`\`\`

### Manual Registry Push

\`\`\`bash
# Login to registry
docker login ghcr.io

# Tag image
docker tag platypus-qa-lab ghcr.io/your-org/platypus-qa-lab:latest

# Push image
docker push ghcr.io/your-org/platypus-qa-lab:latest
\`\`\`

## Production Best Practices

### 1. Health Checks

Add to docker-compose.yml:

\`\`\`yaml
services:
  app:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
\`\`\`

### 2. Resource Limits

\`\`\`yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
\`\`\`

### 3. Logging

\`\`\`yaml
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
\`\`\`

### 4. Security

\`\`\`yaml
services:
  app:
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
\`\`\`

## Monitoring

### View Logs

\`\`\`bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app

# Last 100 lines
docker-compose logs --tail=100 app
\`\`\`

### Container Stats

\`\`\`bash
# Real-time stats
docker stats

# Specific container
docker stats platypus-qa-lab
\`\`\`

### Health Status

\`\`\`bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' platypus-qa-lab

# View health check logs
docker inspect --format='{{json .State.Health}}' platypus-qa-lab | jq
\`\`\`

## Troubleshooting

### Container Won't Start

\`\`\`bash
# Check logs
docker-compose logs app

# Inspect container
docker inspect platypus-qa-lab

# Check environment variables
docker exec platypus-qa-lab env
\`\`\`

### Database Connection Issues

\`\`\`bash
# Test database connectivity
docker exec platypus-qa-lab nc -zv postgres 5432

# Check Supabase connection
docker exec platypus-qa-lab curl -v $SUPABASE_URL
\`\`\`

### Performance Issues

\`\`\`bash
# Check resource usage
docker stats platypus-qa-lab

# Analyze image size
docker images platypus-qa-lab

# View build cache
docker system df
\`\`\`

### Clean Up

\`\`\`bash
# Remove containers
docker-compose down

# Remove volumes
docker-compose down -v

# Remove images
docker rmi platypus-qa-lab

# Full cleanup
docker system prune -a --volumes
\`\`\`

## Hosting Providers

### Recommended Options

1. **Railway** - Easy deployment, automatic HTTPS
2. **Render** - Free tier available, auto-deploy from Git
3. **DigitalOcean App Platform** - Managed container hosting
4. **AWS ECS/Fargate** - Enterprise-grade, scalable
5. **Google Cloud Run** - Serverless containers, pay-per-use
6. **Azure Container Instances** - Simple container hosting

### Example: Railway Deployment

\`\`\`bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
\`\`\`

## Performance Optimization

### Build Cache

\`\`\`bash
# Use BuildKit for better caching
DOCKER_BUILDKIT=1 docker build -t platypus-qa-lab .

# Use cache from registry
docker build --cache-from ghcr.io/your-org/platypus-qa-lab:latest .
\`\`\`

### Image Size Reduction

Current optimizations:
- Multi-stage build: ~80% size reduction
- Alpine base image: Minimal footprint
- .dockerignore: Excludes unnecessary files
- Standalone output: Only production dependencies

### Network Optimization

\`\`\`yaml
networks:
  platypus-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.28.0.0/16
\`\`\`

## Support

For deployment issues:
- Check logs: `docker-compose logs -f`
- Review environment variables
- Verify Supabase connection
- Consult [GitHub Issues](https://github.com/your-org/platypus-qa-lab/issues)
