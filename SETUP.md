# 🦦 Platypus QA Lab - Complete Setup Guide

This guide will help you set up Platypus QA Lab in your local environment using Docker.

## 📋 Prerequisites

- **Docker Desktop** (or Docker Engine + Docker Compose)
  - [Download for Mac](https://docs.docker.com/desktop/install/mac-install/)
  - [Download for Windows](https://docs.docker.com/desktop/install/windows-install/)
  - [Download for Linux](https://docs.docker.com/desktop/install/linux-install/)
- **Git** (for cloning the repository)
- **Supabase Account** (100% FREE - no credit card required)

## 🚀 Quick Start (5 minutes)

### Step 1: Clone the Repository

\`\`\`bash
git clone https://github.com/your-username/platypus-qa-lab.git
cd platypus-qa-lab
\`\`\`

### Step 2: Set Up Supabase (FREE)

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up for a free account (no credit card required)
3. Click "New Project"
4. Fill in:
   - **Name**: platypus-qa-lab
   - **Database Password**: (choose a strong password)
   - **Region**: (choose closest to you)
5. Wait 2-3 minutes for project creation
6. Go to **Project Settings** → **API**
7. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (click "Reveal" to see it)

### Step 3: Configure Environment Variables

\`\`\`bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your favorite editor
nano .env.local  # or vim, code, etc.
\`\`\`

**Paste your Supabase credentials:**

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
\`\`\`

**Generate a secure secret:**

\`\`\`bash
# On Mac/Linux:
openssl rand -base64 32

# Copy the output and paste it as NEXTAUTH_SECRET in .env.local
\`\`\`

### Step 4: Run with Docker

\`\`\`bash
# Start the application
docker-compose up -d

# Check if it's running
docker-compose ps

# View logs
docker-compose logs -f app
\`\`\`

### Step 5: Access the Application

Open your browser and go to: **http://localhost:3000**

🎉 **You're done!** The platypus is ready to help you with QA testing!

---

## 🛠️ Development Setup (Without Docker)

If you prefer to run without Docker:

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
\`\`\`

---

## 🐳 Docker Commands Cheat Sheet

\`\`\`bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f app

# Rebuild after code changes
docker-compose up -d --build

# Stop and remove everything (including volumes)
docker-compose down -v

# Check service status
docker-compose ps

# Execute commands inside container
docker-compose exec app sh
\`\`\`

---

## 📊 Database Setup

The application will automatically create the necessary tables on first run. If you need to manually set up the database:

\`\`\`bash
# Run database migrations (if using local PostgreSQL)
docker-compose exec postgres psql -U postgres -d platypus_qa -f /docker-entrypoint-initdb.d/init.sql
\`\`\`

---

## 🔧 Troubleshooting

### Port 3000 is already in use

\`\`\`bash
# Find what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change the port in docker-compose.yml
ports:
  - "3001:3000"  # Use port 3001 instead
\`\`\`

### Docker container won't start

\`\`\`bash
# Check logs
docker-compose logs app

# Remove old containers and volumes
docker-compose down -v

# Rebuild from scratch
docker-compose up -d --build
\`\`\`

### Supabase connection errors

1. Verify your credentials in `.env.local`
2. Check if your Supabase project is active
3. Ensure you copied the correct keys (anon vs service_role)
4. Check Supabase dashboard for any issues

### Database connection errors

\`\`\`bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Restart PostgreSQL
docker-compose restart postgres

# Check PostgreSQL logs
docker-compose logs postgres
\`\`\`

---

## 🎯 Optional Features

### Enable AI-Powered Humor (FREE TIER AVAILABLE)

1. **OpenAI** (Free $5 credit for new accounts):
   - Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Create an API key
   - Add to `.env.local`: `OPENAI_API_KEY=sk-...`

2. **xAI Grok** (Free tier available):
   - Go to [https://console.x.ai/](https://console.x.ai/)
   - Create an API key
   - Add to `.env.local`: `XAI_API_KEY=xai-...`

3. Enable the feature:
   \`\`\`env
   NEXT_PUBLIC_ENABLE_AI_HUMOR=true
   \`\`\`

### Enable Email Notifications (FREE TIER)

1. **Resend** (Free: 100 emails/day, 3,000/month):
   - Go to [https://resend.com/api-keys](https://resend.com/api-keys)
   - Create an API key
   - Add to `.env.local`:
     \`\`\`env
     RESEND_API_KEY=re_...
     NOTIFICATION_EMAIL_FROM=noreply@yourdomain.com
     NOTIFICATION_EMAIL_TO=your-email@example.com
     NEXT_PUBLIC_ENABLE_EMAIL_NOTIFICATIONS=true
     \`\`\`

---

## 🚀 Deployment

### Deploy to Vercel (FREE)

1. Push your code to GitHub
2. Go to [https://vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables from `.env.local`
6. Click "Deploy"

**Vercel Free Tier includes:**
- Unlimited deployments
- Automatic HTTPS
- Global CDN
- Serverless functions
- 100GB bandwidth/month

### Deploy with Docker

\`\`\`bash
# Build production image
docker build -t platypus-qa-lab .

# Run production container
docker run -p 3000:3000 --env-file .env.local platypus-qa-lab
\`\`\`

---

## 📚 Next Steps

1. **Read the Documentation**: Check out `README.md` for feature overview
2. **Set Up CI/CD**: See `README.CI-CD.md` for GitHub Actions setup
3. **Learn Docker**: Read `README.Docker.md` for advanced Docker usage
4. **Deploy**: Check `DEPLOYMENT.md` for deployment options

---

## 💰 Cost Breakdown

**Everything is FREE for personal/small team use:**

| Service | Free Tier | Cost |
|---------|-----------|------|
| Supabase | 500MB database, 2GB bandwidth | $0 |
| Vercel | 100GB bandwidth, unlimited deployments | $0 |
| GitHub Actions | 2,000 minutes/month | $0 |
| Docker (local) | Unlimited | $0 |
| OpenAI (optional) | $5 credit for new accounts | $0 initially |
| Resend (optional) | 100 emails/day | $0 |
| **TOTAL** | | **$0/month** |

---

## 🆘 Need Help?

- **Issues**: [GitHub Issues](https://github.com/your-username/platypus-qa-lab/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/platypus-qa-lab/discussions)
- **Documentation**: Check the `/docs` folder

---

**Made with 💙 by the Platypus QA Lab team**
