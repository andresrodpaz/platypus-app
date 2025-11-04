# 🚀 Platypus QA Lab - Deployment Guide

Complete guide for deploying Platypus QA Lab to various platforms.

## 📋 Deployment Options

1. **Vercel** (Recommended) - Easiest, optimized for Next.js
2. **Docker** - Self-hosted, full control
3. **AWS/GCP/Azure** - Enterprise deployments
4. **Railway/Render** - Alternative platforms

## 🎯 Vercel Deployment (Recommended)

### Prerequisites

- Vercel account
- GitHub repository
- Supabase project

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/platypus-qa-lab)

### Manual Deployment

1. **Install Vercel CLI**
   \`\`\`bash
   npm i -g vercel
   \`\`\`

2. **Login to Vercel**
   \`\`\`bash
   vercel login
   \`\`\`

3. **Deploy**
   \`\`\`bash
   # Development
   vercel
   
   # Production
   vercel --prod
   \`\`\`

4. **Configure Environment Variables**
   \`\`\`bash
   # Via CLI
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   
   # Or via Vercel Dashboard
   # Project Settings > Environment Variables
   \`\`\`

### GitHub Integration

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure environment variables
5. Deploy

**Auto-deployments:**
- Push to `main` → Production
- Push to `develop` → Preview
- Pull requests → Preview deployments

## 🐳 Docker Deployment

### Using Docker Compose

1. **Clone repository**
   \`\`\`bash
   git clone https://github.com/your-username/platypus-qa-lab.git
   cd platypus-qa-lab
   \`\`\`

2. **Configure environment**
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   \`\`\`

3. **Deploy**
   \`\`\`bash
   docker-compose up -d
   \`\`\`

4. **Access application**
   \`\`\`
   http://your-server-ip:3000
   \`\`\`

### Using Pre-built Image

\`\`\`bash
# Pull from GitHub Container Registry
docker pull ghcr.io/your-username/platypus-qa-lab:latest

# Run container
docker run -d \
  -p 3000:3000 \
  --env-file .env.local \
  --name platypus-qa \
  ghcr.io/your-username/platypus-qa-lab:latest
\`\`\`

## ☁️ Cloud Platform Deployments

### AWS (Elastic Beanstalk)

1. **Install EB CLI**
   \`\`\`bash
   pip install awsebcli
   \`\`\`

2. **Initialize**
   \`\`\`bash
   eb init -p docker platypus-qa-lab
   \`\`\`

3. **Create environment**
   \`\`\`bash
   eb create production
   \`\`\`

4. **Deploy**
   \`\`\`bash
   eb deploy
   \`\`\`

### AWS (ECS with Fargate)

1. **Build and push image**
   \`\`\`bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
   
   docker build -t platypus-qa-lab .
   docker tag platypus-qa-lab:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/platypus-qa-lab:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/platypus-qa-lab:latest
   \`\`\`

2. **Create ECS task definition**
3. **Create ECS service**
4. **Configure load balancer**

### Google Cloud Run

\`\`\`bash
# Build and deploy
gcloud run deploy platypus-qa-lab \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
\`\`\`

### Azure Container Instances

\`\`\`bash
# Create resource group
az group create --name platypus-qa-rg --location eastus

# Deploy container
az container create \
  --resource-group platypus-qa-rg \
  --name platypus-qa-lab \
  --image ghcr.io/your-username/platypus-qa-lab:latest \
  --dns-name-label platypus-qa \
  --ports 3000
\`\`\`

## 🚂 Railway Deployment

1. **Install Railway CLI**
   \`\`\`bash
   npm i -g @railway/cli
   \`\`\`

2. **Login**
   \`\`\`bash
   railway login
   \`\`\`

3. **Initialize project**
   \`\`\`bash
   railway init
   \`\`\`

4. **Deploy**
   \`\`\`bash
   railway up
   \`\`\`

## 🎨 Render Deployment

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Add variables from `.env.example`
5. Deploy

## 🔧 Post-Deployment Configuration

### 1. Environment Variables

Ensure all required variables are set:

\`\`\`bash
# Required
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# Optional
OPENAI_API_KEY
RESEND_API_KEY
NEXT_PUBLIC_APP_URL
\`\`\`

### 2. Database Setup

Run initialization scripts:

\`\`\`bash
# If using Supabase, run via Supabase SQL Editor
# Or via CLI
psql $DATABASE_URL < scripts/init.sql
\`\`\`

### 3. Domain Configuration

#### Vercel
1. Project Settings → Domains
2. Add custom domain
3. Configure DNS records

#### Docker/Self-hosted
1. Configure reverse proxy (Nginx/Caddy)
2. Set up SSL certificates (Let's Encrypt)
3. Update `NEXT_PUBLIC_APP_URL`

### 4. Health Checks

Verify deployment:

\`\`\`bash
# Health check endpoint
curl https://your-domain.com/api/health

# Expected response
{"status":"ok","timestamp":"2025-01-01T00:00:00.000Z"}
\`\`\`

## 🔐 Security Checklist

- [ ] All secrets in environment variables (not in code)
- [ ] HTTPS enabled
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Database connection secured
- [ ] API keys rotated regularly
- [ ] Security headers configured
- [ ] Dependencies updated

## 📊 Monitoring & Logging

### Vercel Analytics

Automatically enabled when deployed to Vercel.

### Custom Monitoring

Add monitoring service:

\`\`\`typescript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
\`\`\`

### Logging

\`\`\`typescript
// Use structured logging
console.log(JSON.stringify({
  level: 'info',
  message: 'API request',
  timestamp: new Date().toISOString(),
  metadata: { userId, endpoint }
}))
\`\`\`

## 🔄 Continuous Deployment

### Automatic Deployments

Configured via GitHub Actions (see `.github/workflows/deploy.yml`):

- Push to `main` → Production
- Push to `develop` → Staging
- Tags `v*.*.*` → Versioned release

### Manual Deployments

\`\`\`bash
# Trigger via GitHub CLI
gh workflow run deploy.yml -f environment=production

# Or via Vercel CLI
vercel --prod
\`\`\`

## 🐛 Troubleshooting

### Build Failures

\`\`\`bash
# Check build logs
vercel logs

# Test build locally
npm run build
\`\`\`

### Runtime Errors

\`\`\`bash
# Check application logs
vercel logs --follow

# Or Docker logs
docker logs -f platypus-qa
\`\`\`

### Database Connection Issues

\`\`\`bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check environment variables
vercel env ls
\`\`\`

## 📈 Performance Optimization

### Enable Caching

\`\`\`typescript
// next.config.mjs
export default {
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=60' }
      ]
    }
  ]
}
\`\`\`

### Image Optimization

Already configured in `next.config.mjs`:

\`\`\`javascript
images: {
  unoptimized: true, // Or configure image domains
}
\`\`\`

### Database Connection Pooling

Use Supabase pooled connection:

\`\`\`
SUPABASE_POSTGRES_PRISMA_URL=postgresql://...?pgbouncer=true
\`\`\`

## 🆘 Rollback Procedures

### Vercel

\`\`\`bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback <deployment-url>
\`\`\`

### Docker

\`\`\`bash
# Pull previous version
docker pull ghcr.io/your-username/platypus-qa-lab:v1.0.0

# Restart with previous version
docker-compose down
docker-compose up -d
\`\`\`

## 📚 Additional Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Docker Deployment Guide](https://docs.docker.com/get-started/)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)

---

**Deploy with confidence! The platypus has your back! 🦦🚀**
