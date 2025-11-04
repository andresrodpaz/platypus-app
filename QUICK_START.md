# 🚀 Platypus QA Lab - Quick Start Guide

## Database Setup

Execute these SQL scripts **in order** in your Supabase SQL Editor:

### 1. Initial Setup (Required)
\`\`\`sql
-- Run MASTER_SETUP.sql first
-- This creates all tables, policies, and seed data
\`\`\`

### 2. Make Suite ID Nullable (Required for Playground)
\`\`\`sql
-- Run 006_make_suite_id_nullable.sql
-- This allows playground tests to save without a suite
\`\`\`

### 3. Enable Real-time (Optional)
\`\`\`sql
-- Run 005_enable_realtime.sql
-- This enables live updates for team and reports pages
\`\`\`

## Environment Variables

Add these to your Vercel/v0 project:

### Required (Already configured in v0)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `NEXT_PUBLIC_SUPABASE_URL` - Same as SUPABASE_URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Same as SUPABASE_ANON_KEY

### Optional (For AI Features)
- `OPENAI_API_KEY` - For AI-powered API analysis
  - Get it from: https://platform.openai.com/api-keys
  - Without this, the app uses intelligent fallback responses

## Features Overview

### 🎮 Playground
- Test 50+ public APIs instantly
- Support for GET, POST, PUT, PATCH, DELETE
- AI-powered response analysis
- Request history tracking
- Real-time saving to database

### 📋 Test Suites
- Create organized test collections
- Run multiple tests sequentially
- Track execution history
- Share suites with team

### 🐛 Bug Tracking
- Report and track API bugs
- Severity levels (Critical, High, Medium, Low)
- Status tracking (Open, In Progress, Resolved, Closed)
- Comments and collaboration

### 📊 Analytics
- Visual charts and graphs
- Test execution trends
- Bug severity breakdown
- Response time analysis

### 📈 Reports
- Detailed test execution reports
- Real-time updates
- Export functionality
- Historical data

### 👥 Team
- Team member management
- Activity feed
- Real-time collaboration
- Role-based access

### 🎭 API Mocks
- Create mock API responses
- Simulate different scenarios
- Test error handling
- Control latency

### ⏰ Monitoring
- Schedule automated tests
- Cron-based execution
- Email/Slack notifications
- Uptime monitoring

## Troubleshooting

### "Foreign key constraint violation" error
**Solution:** Run `006_make_suite_id_nullable.sql` script

### Tests don't appear in reports
**Solution:** Make sure you've run the database setup scripts in order

### Charts not loading
**Solution:** Verify Supabase connection and check browser console for errors

### AI analysis not working
**Solution:** Add `OPENAI_API_KEY` environment variable (optional - fallback works without it)

## Support

For issues or questions:
1. Check the `COMPONENT_GUIDE.md` for detailed component documentation
2. Review `ENV_SETUP.md` for environment variable setup
3. Check browser console for error messages
4. Verify all database scripts have been executed

---

**Built with ❤️ by the Platypus QA Team** 🦫
