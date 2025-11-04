# Platypus QA Lab - Complete Setup Guide

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Setup](#detailed-setup)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Email Configuration](#email-configuration)
7. [Running the Application](#running-the-application)
8. [Running Tests](#running-tests)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you start, make sure you have:

- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **pnpm** package manager (or npm/yarn)
- **Git** for version control
- **Supabase account** (free tier works perfectly) - [Sign up here](https://supabase.com)
- **Resend account** (optional, for email notifications) - [Sign up here](https://resend.com)

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/andresrodpaz/platypus-app.git
cd platypus-qa
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Setup Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials (see [Environment Variables](#environment-variables) section below).

### 4. Setup Database

Run the database initialization script in Supabase SQL Editor (see [Database Setup](#database-setup) section).

### 5. Start Development Server

```bash
pnpm dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

---

## Detailed Setup

### Step 1: Clone and Install

```bash
# Clone repository
git clone https://github.com/andresrodpaz/platypus-app.git
cd platypus-qa

# Install dependencies
pnpm install
```

### Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Name: `platypus-qa-lab` (or your choice)
   - Database Password: Choose a strong password
   - Region: Select closest to you
4. Wait for project to be created (2-3 minutes)

### Step 3: Get Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`, keep this secret!)

### Step 4: Configure Environment Variables

Create `.env.local` file in the project root:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AI Analysis (Optional - for Grok AI-powered analysis)
GROK_XAI_API_KEY=xai-...

# Email Notifications (Optional - for scheduled test notifications)
RESEND_API_KEY=re_...
NOTIFICATION_EMAIL_FROM=noreply@yourdomain.com

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_HUMOR=true
NEXT_PUBLIC_ENABLE_EMAIL_NOTIFICATIONS=false
NEXT_PUBLIC_ENABLE_SCHEDULED_TESTS=true
```

**Important**: Never commit `.env.local` to version control!

### Step 5: Initialize Database

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project
2. Click **SQL Editor** in the sidebar
3. Click **New Query**
4. Copy the contents of `scripts/init.sql` or `scripts/MASTER_SETUP.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press `Ctrl/Cmd + Enter`)
7. Verify tables were created in **Table Editor**

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Step 6: Verify Setup

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Visit `http://localhost:3000/api/health`
   - Should return: `{"status":"healthy","database":"connected",...}`

3. Visit `http://localhost:3000`
   - Should see the home page

---

## Environment Variables

### Required Variables

#### Supabase Configuration

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key | Supabase Dashboard → Settings → API → anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (keep secret!) | Supabase Dashboard → Settings → API → service_role key |
| `SUPABASE_URL` | Same as NEXT_PUBLIC_SUPABASE_URL | Same as above |
| `SUPABASE_ANON_KEY` | Same as NEXT_PUBLIC_SUPABASE_ANON_KEY | Same as above |

### Optional Variables

#### AI Analysis

| Variable | Description | Default |
|----------|-------------|---------|
| `GROK_XAI_API_KEY` | Grok AI API key for intelligent analysis | Uses fallback analysis |

**How to get Grok API Key**:
1. Go to [x.ai](https://x.ai)
2. Sign up for API access
3. Generate API key
4. Add to `.env.local`

#### Email Notifications

| Variable | Description | Default |
|----------|-------------|---------|
| `RESEND_API_KEY` | Resend API key for email notifications | Email notifications disabled |
| `NOTIFICATION_EMAIL_FROM` | From email address | `noreply@platypuslab.dev` |

**How to get Resend API Key** (see [Email Configuration](#email-configuration) section):
1. Go to [resend.com](https://resend.com)
2. Sign up for free account
3. Go to API Keys section
4. Create new API key
5. Copy key (starts with `re_`)

#### Application Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Application URL | `http://localhost:3000` |
| `NEXT_PUBLIC_ENABLE_AI_HUMOR` | Enable humorous AI commentary | `true` |
| `NEXT_PUBLIC_ENABLE_EMAIL_NOTIFICATIONS` | Enable email notifications | `false` |
| `NEXT_PUBLIC_ENABLE_SCHEDULED_TESTS` | Enable scheduled test feature | `true` |

---

## Database Setup

### Schema Overview

The application uses the following tables:

- **user_profiles** - User profiles with roles
- **test_suites** - Test suite collections
- **test_requests** - Individual requests within suites
- **test_executions** - Test execution history
- **execution_results** - Individual request results
- **api_mocks** - Mock endpoint definitions
- **scheduled_tests** - Cron-scheduled test configurations
- **bugs** - Bug reports
- **bug_comments** - Comments on bugs
- **bug_activities** - Bug activity log
- **activity_feed** - Team activity logs
- **notifications** - User notifications

### Running the SQL Script

1. **Open Supabase SQL Editor**:
   - Go to your Supabase project
   - Click **SQL Editor** in the sidebar

2. **Run the Setup Script**:
   - Open `scripts/init.sql` or `scripts/MASTER_SETUP.sql`
   - Copy the entire contents
   - Paste into SQL Editor
   - Click **Run**

3. **Verify Tables**:
   - Go to **Table Editor** in Supabase
   - You should see all tables listed
   - Verify Row-Level Security (RLS) is enabled

### Row-Level Security (RLS)

All tables have RLS enabled for data protection:
- Users can only see their own data
- Team members can see shared resources
- Admins have full access

---

## Email Configuration

### Setup Resend (Recommended)

**Resend** is a modern email API with a generous free tier (3,000 emails/month).

#### Step 1: Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Click "Sign Up"
3. Verify your email address

#### Step 2: Get API Key

1. Log in to Resend dashboard
2. Navigate to **API Keys** in the sidebar
3. Click **Create API Key**
4. Give it a name (e.g., "Platypus QA Lab")
5. Copy the API key (starts with `re_`)

#### Step 3: Add to Environment Variables

Add to your `.env.local`:

```env
RESEND_API_KEY=re_your_actual_api_key_here
NOTIFICATION_EMAIL_FROM=noreply@yourdomain.com
```

**In - (Recommended)**:
- Open the left sidebar
- Click on **Vars** (Variables section)
- Click **Add Variable**
- Name: `RESEND_API_KEY`
- Value: Paste your Resend API key
- Click **Save**

#### Step 4: Configure Domain (Optional)

For production use, verify your domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `platypuslab.dev`)
4. Add the DNS records provided by Resend
5. Wait for verification (usually takes a few minutes)

### Test Email Sending

1. Create a test suite in the Playground
2. Go to Monitoring and create a scheduled test
3. Add your email address in "Notification Email"
4. Set the schedule to run soon
5. Wait for the test to run and check your inbox

### Resend Free Tier

- **3,000 emails per month**
- **100 emails per day**
- All features included
- No credit card required

---

## Running the Application

### Development Mode

```bash
# Start development server
pnpm dev
# or
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Docker (Recommended)

#### Using Docker Compose

```bash
# Start all services (PostgreSQL, PostgREST, Next.js app)
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

#### Verify Services

```bash
# Check service status
docker-compose ps

# Check health
curl http://localhost:3000/api/health
```

The Docker setup includes:
- **PostgreSQL**: Database server
- **PostgREST**: REST API for PostgreSQL (Supabase-compatible)
- **Next.js App**: Application server

---

## Running Tests

### Unit Tests (Jest)

```bash
# Run all unit tests
pnpm run test:unit

# Run tests in watch mode
pnpm run test:watch

# Run with coverage
pnpm run test:unit -- --coverage
```

**Expected Results**:
- **132 unit tests** passing
- **~26 seconds** execution time
- **100% pass rate**

### E2E Tests (Playwright)

**Prerequisites**: The application must be running (via Docker or `pnpm dev`)

```bash
# Install Playwright browsers (first time only)
pnpm exec playwright install --with-deps chromium

# Run all E2E tests
pnpm run test:e2e

# Run with UI (see browser)
pnpm run test:ui:headed

# Debug mode
pnpm run test:ui:debug

# View test report
pnpm run test:report
```

**Expected Results**:
- **27 E2E tests** passing
- **~2.1 minutes** execution time
- **100% pass rate**

### Run All Tests

```bash
pnpm test
```

This runs both unit and E2E tests sequentially.

---

## Deployment

### Deploy to Vercel (Recommended)

#### Option 1: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Vercel will auto-detect Next.js
6. Add environment variables (see below)
7. Click "Deploy"

#### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables for Production

Add these in your Vercel project settings (**Settings → Environment Variables**):

**Required**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

**Optional**:
- `GROK_XAI_API_KEY` (for AI analysis)
- `RESEND_API_KEY` (for email notifications)
- `NEXT_PUBLIC_APP_URL` (your production URL)

### Build Configuration

Vercel will automatically:
- Detect Next.js framework
- Run `pnpm build` (or `npm run build`)
- Deploy the application
- Set up HTTPS
- Configure CDN

### Post-Deployment

1. **Verify Health Check**:
   ```bash
   curl https://your-domain.com/api/health
   ```

2. **Test Application**:
   - Visit your production URL
   - Test API playground
   - Verify database connection

3. **Set Up Cron Jobs** (Optional):
   - Use Vercel Cron for scheduled tests
   - Or use external cron service (e.g., cron-job.org)

---

## Troubleshooting

### Common Issues

#### "Supabase client not initialized"

**Solution**:
1. Verify `.env.local` has correct Supabase credentials
2. Restart the dev server after adding env vars
3. Check that variable names match exactly (case-sensitive)

```bash
# Verify environment variables
cat .env.local | grep SUPABASE
```

#### "RLS policy violation"

**Solution**:
1. Check that you're logged in
2. Verify the user has the correct role
3. Review RLS policies in Supabase dashboard
4. Ensure database tables are created

#### "Module not found" errors

**Solution**:
```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### Tests failing

**Unit Tests**:
```bash
# Clear Jest cache
pnpm jest --clearCache

# Run specific test file
pnpm run test:unit -- __tests__/lib/storage.test.ts
```

**E2E Tests**:
1. Make sure the dev server is running (or Docker containers)
2. Clear browser cache: `pnpm exec playwright clean`
3. Update Playwright browsers: `pnpm exec playwright install`
4. Check that port 3000 is available

#### Port 3000 already in use

**Windows**:
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Linux/Mac**:
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 pnpm dev
```

#### Build errors

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Check TypeScript errors
pnpm exec tsc --noEmit

# Rebuild
pnpm build
```

#### Database connection issues

**Solution**:
1. Verify Supabase project is active
2. Check database password is correct
3. Verify network connectivity
4. Check Supabase dashboard for service status

#### Email not sending

**Solution**:
1. Verify `RESEND_API_KEY` is set correctly
2. Check Resend dashboard for API key status
3. Verify you haven't hit daily limit (100 emails on free tier)
4. Check spam folder
5. Review logs: `console.log("[-] Email service error:", error)`

---

## Configuration Guide (Español)

### Configuración de Variables de Entorno

**Variables de Supabase (Ya Configuradas ✅)**:

Si estás trabajando en -, todas estas variables ya están configuradas automáticamente:
- `SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`

**No necesitas hacer nada con estas variables en -.**

### Variable de Email (Necesitas Configurar) 📧

Para enviar notificaciones por email cuando los tests fallen:

#### Paso 1: Crear Cuenta en Resend

1. Ve a [resend.com](https://resend.com)
2. Haz clic en "Sign Up" (Registrarse)
3. Crea tu cuenta con tu email
4. Verifica tu email

#### Paso 2: Obtener tu API Key

1. Inicia sesión en [resend.com](https://resend.com)
2. En el menú lateral, haz clic en **"API Keys"**
3. Haz clic en **"Create API Key"**
4. Dale un nombre (por ejemplo: "Platypus QA Lab")
5. Copia la clave que empieza con `re_`

#### Paso 3: Agregar la Variable en -

1. En -, abre el menú lateral izquierdo
2. Haz clic en **"Vars"** (Variables)
3. Haz clic en **"Add Variable"**
4. Nombre: `RESEND_API_KEY`
5. Valor: Pega tu clave de Resend
6. Haz clic en **"Save"**

### Usuarios de Prueba

He creado 5 usuarios de prueba que puedes usar:

**Contraseña para todos**: `TestPass123!`

| Email | Nombre | Rol |
|-------|--------|-----|
| `qa.lead@platypuslab.test` | Sarah Martinez | QA Lead |
| `senior.qa@platypuslab.test` | Michael Chen | Senior QA Engineer |
| `qa.engineer@platypuslab.test` | Emma Johnson | QA Engineer |
| `junior.qa@platypuslab.test` | Alex Rivera | Junior QA Engineer |
| `automation.qa@platypuslab.test` | Priya Patel | QA Automation Engineer |

**Cómo usar**:
1. Ejecutar el script `scripts/seed-test-users.js` en -
2. Iniciar sesión en `/auth/login` con cualquiera de los emails
3. Contraseña: `TestPass123!`

---

## Additional Resources

- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **Playwright Documentation**: [playwright.dev](https://playwright.dev)
- **Jest Documentation**: [jestjs.io](https://jestjs.io)
- **Resend Documentation**: [resend.com/docs](https://resend.com/docs)

---

## Support

If you encounter any issues:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Review the application logs
3. Check Supabase dashboard for database issues
4. Open a GitHub issue with:
   - Error message
   - Steps to reproduce
   - Environment details

---

**Happy Testing! 🦦**

*Last Updated: January 2025*
