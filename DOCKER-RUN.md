# 🐳 How to Run Platypus QA Lab with Docker

## Quick Start (Production Mode)

### Prerequisites
- Docker Desktop installed and running
- Docker Compose installed (usually included with Docker Desktop)

### Step 1: Clone and Navigate
```bash
git clone <your-repo-url>
cd platypus-qa
```

### Step 2: Create Environment File (Optional)
Copy the example environment file:
```bash
cp .env.example .env
```

**Note**: The default values in `docker-compose.yml` work out of the box, so you can skip this step for initial testing.

### Step 3: Start the Application
```bash
docker-compose up -d
```

This command will:
- Build the Next.js application image
- Start PostgreSQL database container
- Initialize the database with schema and test data
- Start the application on port 3000

### Step 4: Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

## Verify Everything is Working

### Check Container Status
```bash
docker-compose ps
```

You should see:
- `platypus-qa-app` - Status: Up (healthy)
- `platypus-qa-postgres` - Status: Up (healthy)

### Check Health Endpoint
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "not_configured",
  "databaseType": "local",
  "message": "Running without Supabase (using local storage or direct PostgreSQL)",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### Verify Database Initialization
```bash
docker-compose exec postgres psql -U postgres -d platypus_qa -c "SELECT COUNT(*) FROM user_profiles;"
```

Expected output: Should show at least 4 test users.

## Useful Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres
```

### Stop the Application
```bash
docker-compose down
```

### Stop and Remove Volumes (⚠️ This deletes all data)
```bash
docker-compose down -v
```

### Restart Services
```bash
docker-compose restart
docker-compose restart app
docker-compose restart postgres
```

### Rebuild After Code Changes
```bash
docker-compose up -d --build
```

### Access Database Directly
```bash
docker-compose exec postgres psql -U postgres -d platypus_qa
```

### Execute SQL Script
```bash
docker-compose exec -T postgres psql -U postgres -d platypus_qa < scripts/init.sql
```

## Development Mode

For development with hot reload, use the development Docker Compose file:

```bash
docker-compose -f docker-compose.dev.yml up
```

This will:
- Mount your local code for hot reload
- Run in development mode
- Enable faster iteration

## Configuration

### Change Ports

Edit `docker-compose.yml`:
```yaml
services:
  app:
    ports:
      - "3001:3000"  # Change host port to 3001
  
  postgres:
    ports:
      - "5433:5432"  # Change host port to 5433
```

Or use environment variables:
```bash
POSTGRES_PORT=5433 docker-compose up -d
```

### Environment Variables

Create a `.env` file or set environment variables:

```bash
# Database
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=platypus_qa

# Supabase (optional - leave empty for local PostgreSQL)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Troubleshooting

### Application Won't Start

1. **Check logs:**
   ```bash
   docker-compose logs app
   ```

2. **Verify PostgreSQL is healthy:**
   ```bash
   docker-compose exec postgres pg_isready -U postgres
   ```

3. **Rebuild containers:**
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

### Database Connection Errors

1. **Verify database is initialized:**
   ```bash
   docker-compose exec postgres psql -U postgres -d platypus_qa -c "\dt"
   ```

2. **Reinitialize database:**
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

3. **Manually run init script:**
   ```bash
   docker-compose exec -T postgres psql -U postgres -d platypus_qa < scripts/init.sql
   ```

### Port Already in Use

If port 3000 is already in use:

1. **Find what's using the port:**
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # Linux/Mac
   lsof -i :3000
   ```

2. **Change the port in docker-compose.yml:**
   ```yaml
   ports:
     - "3001:3000"
   ```

### Health Check Failing

1. **Check if wget is installed:**
   ```bash
   docker-compose exec app wget --version
   ```

2. **Check application logs:**
   ```bash
   docker-compose logs app | tail -50
   ```

3. **Test health endpoint manually:**
   ```bash
   docker-compose exec app wget -qO- http://localhost:3000/api/health
   ```

## Clean Reset

If you want to start completely fresh:

```bash
# Stop and remove everything
docker-compose down -v

# Remove the image (optional)
docker rmi platypus-qa-app

# Start fresh
docker-compose up -d --build
```

## Production Deployment

For production, consider:

1. **Set strong database passwords**
2. **Configure Supabase or use managed PostgreSQL**
3. **Set up reverse proxy (nginx, Traefik)**
4. **Enable SSL/TLS**
5. **Configure proper backups**
6. **Set up monitoring**

## What's Included

The Docker setup includes:
- ✅ Next.js application (production-optimized)
- ✅ PostgreSQL 16 database
- ✅ Automatic database initialization
- ✅ Test data (users, test suites, bugs, mocks)
- ✅ Health checks
- ✅ Automatic restarts
- ✅ Persistent data volumes

## Next Steps

- Explore the application at http://localhost:3000
- Check out the documentation in `/docs`
- Review the test data in the database
- Start creating your own test suites!

---

**Need Help?** Check the logs with `docker-compose logs -f` or review the documentation in the `/docs` folder.
