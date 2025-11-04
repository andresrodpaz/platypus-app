# 🐳 Docker Quick Start Guide

Get Platypus QA Lab running with Docker in under 5 minutes!

## Prerequisites

- Docker Desktop installed and running
- Git installed

## One-Command Setup

\`\`\`bash
# Clone, configure, and run
git clone https://github.com/your-username/platypus-qa-lab.git && \
cd platypus-qa-lab && \
cp .env.example .env.local && \
echo "⚠️  Edit .env.local with your Supabase credentials, then run: docker-compose up -d"
\`\`\`

## Step-by-Step

### 1. Get Supabase Credentials (2 minutes)

1. Go to [supabase.com](https://supabase.com) → Sign up (FREE)
2. Create new project
3. Copy from **Settings** → **API**:
   - Project URL
   - anon public key
   - service_role key

### 2. Configure Environment (1 minute)

\`\`\`bash
cp .env.example .env.local
nano .env.local  # or use your favorite editor
\`\`\`

Paste your Supabase credentials:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
\`\`\`

### 3. Start Docker (1 minute)

\`\`\`bash
docker-compose up -d
\`\`\`

### 4. Access Application

Open: **http://localhost:3000**

## Common Commands

\`\`\`bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Logs
docker-compose logs -f

# Restart
docker-compose restart

# Rebuild
docker-compose up -d --build
\`\`\`

## Troubleshooting

### Port 3000 in use?
\`\`\`bash
# Edit docker-compose.yml, change:
ports:
  - "3001:3000"  # Use 3001 instead
\`\`\`

### Container won't start?
\`\`\`bash
docker-compose down -v
docker-compose up -d --build
\`\`\`

### Need to reset everything?
\`\`\`bash
docker-compose down -v
rm -rf node_modules .next
docker-compose up -d --build
\`\`\`

## Production Deployment

\`\`\`bash
# Build production image
docker build -t platypus-qa-lab .

# Run production
docker run -p 3000:3000 --env-file .env.local platypus-qa-lab
\`\`\`

## What's Running?

- **App**: http://localhost:3000 (Next.js application)
- **PostgreSQL**: localhost:5432 (Local database for development)

## Next Steps

- Read `SETUP.md` for detailed setup
- Check `README.md` for features
- See `README.CI-CD.md` for CI/CD setup

---

**Need help?** Open an issue on GitHub!
