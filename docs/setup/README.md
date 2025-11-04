# Setup Documentation

Welcome to the setup documentation for Platypus QA Lab! This folder contains all guides for setting up and configuring the application.

## 📚 Documentation Index

### Main Setup Guide

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup guide (unified from multiple guides)

### Individual Guides (Legacy)

- **[HOW_TO_RUN.md](./HOW_TO_RUN.md)** - How to run the application (now part of SETUP_GUIDE.md)
- **[CONFIGURACION_ES.md](./CONFIGURACION_ES.md)** - Configuration guide in Spanish (now part of SETUP_GUIDE.md)
- **[EMAIL_SETUP.md](./EMAIL_SETUP.md)** - Email configuration (now part of SETUP_GUIDE.md)
- **[BUG_REPORTS.md](./BUG_REPORTS.md)** - Bug reporting format (moved to app_docs)

---

## 🚀 Quick Start

**For complete setup instructions, read [SETUP_GUIDE.md](./SETUP_GUIDE.md)**

### Quick Setup (5 minutes)

1. **Clone the repository**
   ```bash
   git clone https://github.com/andresrodpaz/platypus-app.git
   cd platypus-qa
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Setup database**
   - Run `scripts/init.sql` in Supabase SQL Editor

5. **Start development server**
   ```bash
   pnpm dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

---

## 📖 Document Descriptions

### SETUP_GUIDE.md
Complete setup guide covering:
- Prerequisites
- Quick start (5 minutes)
- Detailed setup instructions
- Environment variables configuration
- Database setup
- Email configuration (Resend)
- Running the application
- Running tests
- Deployment (Vercel, Docker)
- Troubleshooting
- Configuration guide in Spanish

### HOW_TO_RUN.md (Legacy)
Legacy guide for running the application. Now integrated into SETUP_GUIDE.md.

### CONFIGURACION_ES.md (Legacy)
Legacy Spanish configuration guide. Now integrated into SETUP_GUIDE.md as a bilingual section.

### EMAIL_SETUP.md (Legacy)
Legacy email setup guide. Now integrated into SETUP_GUIDE.md.

---

## 🎯 Which Document Should I Read?

| I want to... | Read this... |
|--------------|--------------|
| Set up the application | [SETUP_GUIDE.md](./SETUP_GUIDE.md) |
| Configure email notifications | [SETUP_GUIDE.md](./SETUP_GUIDE.md#email-configuration) |
| Run tests | [SETUP_GUIDE.md](./SETUP_GUIDE.md#running-tests) |
| Deploy to production | [SETUP_GUIDE.md](./SETUP_GUIDE.md#deployment) |
| Troubleshoot issues | [SETUP_GUIDE.md](./SETUP_GUIDE.md#troubleshooting) |

---

## 📋 Setup Checklist

- [ ] Node.js 18+ installed
- [ ] pnpm installed
- [ ] Git repository cloned
- [ ] Dependencies installed (`pnpm install`)
- [ ] Environment variables configured (`.env.local`)
- [ ] Supabase project created
- [ ] Database tables created (run `scripts/init.sql`)
- [ ] Development server running (`pnpm dev`)
- [ ] Health check passing (`http://localhost:3000/api/health`)
- [ ] (Optional) Resend API key configured for emails
- [ ] (Optional) Grok API key configured for AI analysis

---

## 🔧 Common Setup Tasks

### Install Dependencies
```bash
pnpm install
```

### Setup Environment Variables
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### Run Database Setup
1. Go to Supabase SQL Editor
2. Run `scripts/init.sql` or `scripts/MASTER_SETUP.sql`

### Start Development Server
```bash
pnpm dev
```

### Run Tests
```bash
# Unit tests
pnpm run test:unit

# E2E tests
pnpm run test:e2e

# All tests
pnpm test
```

---

## 📝 Documentation Status

- ✅ **SETUP_GUIDE.md** - Complete (unified from multiple guides)
- 📝 **HOW_TO_RUN.md** - Legacy (refer to SETUP_GUIDE.md)
- 📝 **CONFIGURACION_ES.md** - Legacy (integrated into SETUP_GUIDE.md)
- 📝 **EMAIL_SETUP.md** - Legacy (integrated into SETUP_GUIDE.md)

---

## 🆘 Need Help?

1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md#troubleshooting) for troubleshooting
2. Review environment variables in `.env.example`
3. Check Supabase dashboard for database issues
4. Open a GitHub issue with error details

---

**Last Updated**: January 2025

