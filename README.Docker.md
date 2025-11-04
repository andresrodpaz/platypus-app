# 🦦 Platypus QA Lab - Docker Setup Guide

Complete guide for running Platypus QA Lab in Docker containers for local development and production.

## 📋 Prerequisites

- Docker Engine 20.10+ installed
- Docker Compose 2.0+ installed
- Node.js 20+ (for local development without Docker)
- Git

## 🚀 Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/your-username/platypus-qa-lab.git
cd platypus-qa-lab
\`\`\`

### 2. Configure Environment Variables

Copy the example environment file and fill in your values:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your actual credentials:
- Supabase credentials (required)
- OpenAI or xAI API key (optional, for AI features)
- Resend API key (optional, for email notifications)

### 3. Run with Docker Compose

#### Development Mode (with hot reload)

\`\`\`bash
# Start all services
docker-compose -f docker-compose.dev.yml up

# Or run in detached mode
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
\`\`\`

#### Production Mode

\`\`\`bash
# Build and start
docker-compose up --build

# Or run in detached mode
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove volumes (WARNING: deletes database data)
docker-compose down -v
\`\`\`

## 🏗️ Docker Architecture

### Services

1. **app** - Next.js application
   - Port: 3000
   - Hot reload enabled in dev mode
   - Multi-stage build for production

2. **postgres** - PostgreSQL database
   - Port: 5432
   - Persistent volume for data
   - Auto-initialization with SQL scripts

### Networks

- `platypus-network` (production)
- `platypus-dev-network` (development)

### Volumes

- `postgres-data` - Production database storage
- `postgres-dev-data` - Development database storage

## 🛠️ Common Commands

### Development

\`\`\`bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# Rebuild after dependency changes
docker-compose -f docker-compose.dev.yml up --build

# Access app container shell
docker-compose -f docker-compose.dev.yml exec app sh

# Access database
docker-compose -f docker-compose.dev.yml exec postgres psql -U postgres -d platypus_qa

# View logs for specific service
docker-compose -f docker-compose.dev.yml logs -f app
docker-compose -f docker-compose.dev.yml logs -f postgres
\`\`\`

### Production

\`\`\`bash
# Build production image
docker build -t platypus-qa-lab:latest .

# Run production container
docker-compose up -d

# Check container status
docker-compose ps

# View resource usage
docker stats

# Restart services
docker-compose restart

# Update and restart
docker-compose pull
docker-compose up -d
\`\`\`

### Database Management

\`\`\`bash
# Backup database
docker-compose exec postgres pg_dump -U postgres platypus_qa > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres platypus_qa < backup.sql

# Access PostgreSQL CLI
docker-compose exec postgres psql -U postgres -d platypus_qa

# Run SQL script
docker-compose exec -T postgres psql -U postgres -d platypus_qa < ./scripts/init.sql
\`\`\`

### Cleanup

\`\`\`bash
# Stop and remove containers
docker-compose down

# Remove containers and volumes (WARNING: deletes data)
docker-compose down -v

# Remove all unused Docker resources
docker system prune -a

# Remove specific image
docker rmi platypus-qa-lab:latest
\`\`\`

## 🔧 Troubleshooting

### Port Already in Use

If port 3000 or 5432 is already in use:

\`\`\`bash
# Find process using port
lsof -i :3000
lsof -i :5432

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - "3001:3000"  # Use port 3001 instead
\`\`\`

### Container Won't Start

\`\`\`bash
# Check logs
docker-compose logs app
docker-compose logs postgres

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up
\`\`\`

### Database Connection Issues

\`\`\`bash
# Check if postgres is healthy
docker-compose ps

# Verify environment variables
docker-compose exec app env | grep POSTGRES

# Test database connection
docker-compose exec postgres pg_isready -U postgres
\`\`\`

### Permission Issues

\`\`\`bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Fix volume permissions
docker-compose down
sudo rm -rf postgres-data
docker-compose up
\`\`\`

## 🌐 Accessing the Application

- **Application**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Health Check**: http://localhost:3000/api/health

## 📦 Building for Production

### Multi-stage Build

The production Dockerfile uses multi-stage builds for optimization:

1. **deps** - Install dependencies
2. **builder** - Build application
3. **runner** - Minimal runtime image

### Build Optimization

\`\`\`bash
# Build with BuildKit (faster)
DOCKER_BUILDKIT=1 docker build -t platypus-qa-lab:latest .

# Build for specific platform
docker build --platform linux/amd64 -t platypus-qa-lab:latest .

# Build with cache
docker build --cache-from platypus-qa-lab:latest -t platypus-qa-lab:latest .
\`\`\`

## 🔐 Security Best Practices

1. **Never commit `.env.local`** - Contains sensitive credentials
2. **Use secrets management** - For production deployments
3. **Regular updates** - Keep base images updated
4. **Scan for vulnerabilities** - Use `docker scout` or similar tools
5. **Limit container privileges** - Run as non-root user (already configured)

## 📊 Monitoring

### Health Checks

Both services include health checks:

\`\`\`bash
# Check health status
docker-compose ps

# View health check logs
docker inspect --format='{{json .State.Health}}' platypus-qa-app
\`\`\`

### Resource Monitoring

\`\`\`bash
# Real-time stats
docker stats

# Container logs
docker-compose logs -f --tail=100
\`\`\`

## 🚢 Deployment

### GitHub Container Registry

Images are automatically built and pushed to GHCR via GitHub Actions:

\`\`\`bash
# Pull latest image
docker pull ghcr.io/your-username/platypus-qa-lab:latest

# Run pulled image
docker run -p 3000:3000 --env-file .env.local ghcr.io/your-username/platypus-qa-lab:latest
\`\`\`

### Manual Deployment

\`\`\`bash
# Tag image
docker tag platypus-qa-lab:latest your-registry.com/platypus-qa-lab:v1.0.0

# Push to registry
docker push your-registry.com/platypus-qa-lab:v1.0.0

# Deploy on server
docker pull your-registry.com/platypus-qa-lab:v1.0.0
docker-compose up -d
\`\`\`

## 📝 Environment Variables Reference

See `.env.example` for complete list of environment variables.

### Required Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Optional Variables

- `OPENAI_API_KEY` - For AI-powered features
- `RESEND_API_KEY` - For email notifications
- `NEXT_PUBLIC_APP_URL` - Application URL

## 🆘 Support

For issues or questions:
1. Check the logs: `docker-compose logs`
2. Review this documentation
3. Open an issue on GitHub
4. Check Docker and Docker Compose versions

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)

---

**The platypus approves this Docker setup! 🦦**
