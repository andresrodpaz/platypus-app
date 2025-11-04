# Platypus QA Lab - Complete Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Supabase account (free tier works great)
- Git installed

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/platypus-qa-lab.git
cd platypus-qa-lab
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set Up Supabase

#### Option A: Using v0 (Recommended)
1. Open the project in v0
2. Click "Connect" in the sidebar
3. Select "Supabase" and follow the prompts
4. The integration will automatically set up environment variables

#### Option B: Manual Setup
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key from Settings > API
3. Create a `.env.local` file:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
\`\`\`

### 4. Run Database Migrations

The project includes SQL scripts in the `scripts/` folder. Run them in order:

\`\`\`bash
# If using v0, it can run these automatically
# Otherwise, copy the contents of scripts/001_create_tables.sql
# and run it in the Supabase SQL Editor
\`\`\`

Or use the Supabase CLI:

\`\`\`bash
npx supabase db push
\`\`\`

### 5. Start the Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see your app!

## 🗄️ Database Schema

The application uses the following tables:

- **profiles**: User profiles with roles
- **test_suites**: Test suite collections
- **suite_requests**: Individual requests in suites
- **suite_executions**: Test execution history
- **bugs**: Bug reports
- **bug_comments**: Comments on bugs
- **mock_endpoints**: Mock API endpoints
- **schedules**: Scheduled test configurations
- **team_activities**: Team action logs
- **notifications**: User notifications

All tables have Row-Level Security (RLS) enabled for data protection.

## 🧪 Running Tests

### Unit Tests (Jest)

\`\`\`bash
npm run test:unit
\`\`\`

### E2E Tests (Playwright)

\`\`\`bash
# Install Playwright browsers (first time only)
npx playwright install

# Run tests
npm run test:e2e

# Run with UI
npm run test:ui:headed

# Debug mode
npm run test:ui:debug
\`\`\`

### All Tests

\`\`\`bash
npm test
\`\`\`

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Next.js
5. Add your Supabase environment variables
6. Deploy!

Or use the Vercel CLI:

\`\`\`bash
npm i -g vercel
vercel
\`\`\`

### Environment Variables for Production

Make sure to set these in your Vercel project settings:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
\`\`\`

## 🔧 Configuration

### Customizing the Platypus Personality

Edit `lib/humor-engine.ts` to customize the humorous responses:

\`\`\`typescript
export function getHumorousComment(status: number, responseTime: number): string {
  // Add your own witty comments here!
}
\`\`\`

### Adding New Preset APIs

Edit `app/playground/page.tsx` and add to the `presetApis` array:

\`\`\`typescript
const presetApis = [
  // ... existing presets
  {
    name: "Your API",
    url: "https://api.example.com/endpoint",
    method: "GET",
  },
]
\`\`\`

### Customizing Cron Schedules

Edit `components/create-schedule-dialog.tsx` to add preset schedules:

\`\`\`typescript
const presetSchedules = [
  // ... existing presets
  { label: "Every 30 minutes", value: "*/30 * * * *" },
]
\`\`\`

## 📚 Project Structure

\`\`\`
platypus-qa-lab/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── playground/        # API testing playground
│   ├── bugs/              # Bug tracking
│   ├── analytics/         # Analytics dashboard
│   ├── suites/            # Test suites
│   ├── mocks/             # API mocking
│   ├── monitoring/        # Scheduled tests
│   ├── team/              # Team collaboration
│   ├── reports/           # Reporting
│   └── docs/              # API documentation
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                   # Utility functions
│   ├── supabase/         # Supabase clients
│   ├── humor-engine.ts   # Humorous comments
│   ├── assertions.ts     # Assertion engine
│   ├── code-generator.ts # Code generation
│   └── ...
├── docs/                  # QA documentation
├── scripts/               # Database migrations
├── __tests__/            # Unit tests
├── e2e/                   # E2E tests
└── public/                # Static assets
\`\`\`

## 🐛 Troubleshooting

### "Supabase client not initialized"
- Make sure your environment variables are set correctly
- Restart the dev server after adding env vars

### "RLS policy violation"
- Check that you're logged in
- Verify the user has the correct role
- Review RLS policies in Supabase dashboard

### Tests failing
- Make sure the dev server is running for E2E tests
- Clear localStorage if tests are interfering with each other
- Check that all dependencies are installed

### Build errors
- Run `npm install` to ensure all dependencies are present
- Clear `.next` folder: `rm -rf .next`
- Check for TypeScript errors: `npx tsc --noEmit`

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Playwright Documentation](https://playwright.dev)
- [Jest Documentation](https://jestjs.io)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🦦 Support

If you encounter any issues:

1. Check the [GitHub Issues](https://github.com/yourusername/platypus-qa-lab/issues)
2. Review the QA documentation in `/docs`
3. Ask the platypus (he's surprisingly helpful)

---

**Happy Testing! 🦦**

*"Serious testing, funny results."*
