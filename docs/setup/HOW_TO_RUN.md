# 🦦 How to Run Platypus QA Lab

## Prerequisites

Before you start, make sure you have:

- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** for version control
- A **Supabase account** (free tier works perfectly)

---

## 🚀 Quick Start (5 minutes)

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd platypus-qa-lab
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Setup Environment Variables

Copy the example env file:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` and add your Supabase credentials:

\`\`\`bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

**Where to find these values:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy the values from there

### 4. Setup Database

The SQL script will create all necessary tables. You can run it in two ways:

**Option A: Using - (Recommended)**
- The script is already in `scripts/001_create_tables.sql`
- - can execute it directly for you

**Option B: Supabase Dashboard**
1. Go to your Supabase project
2. Click **SQL Editor**
3. Copy the contents of `scripts/001_create_tables.sql`
4. Paste and click **Run**

### 5. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

**The platypus welcomes you!** 🦦

---

## 🧪 Running Tests

### Unit Tests (Jest)

Run all unit tests:
\`\`\`bash
npm run test:unit
\`\`\`

Run tests in watch mode (for development):
\`\`\`bash
npm run test:watch
\`\`\`

### E2E Tests (Playwright)

Run all end-to-end tests:
\`\`\`bash
npm run test:e2e
\`\`\`

Run tests with UI (see browser):
\`\`\`bash
npm run test:ui:headed
\`\`\`

Debug tests step-by-step:
\`\`\`bash
npm run test:ui:debug
\`\`\`

View test report:
\`\`\`bash
npm run test:report
\`\`\`

### Run All Tests

\`\`\`bash
npm test
\`\`\`

This runs both unit and E2E tests.

---

## 📦 Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

The app will be optimized and ready for deployment.

---

## 🔧 Troubleshooting

### "Module not found" errors

\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Supabase connection issues

1. Verify your `.env.local` has the correct values
2. Check that your Supabase project is active
3. Ensure the database tables are created (run the SQL script)

### Tests failing

1. Make sure the dev server is NOT running when running E2E tests (Playwright starts its own)
2. Clear browser cache: `npx playwright clean`
3. Update Playwright browsers: `npx playwright install`

### Port 3000 already in use

\`\`\`bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
\`\`\`

---

## 🎯 What to Test First

1. **Home Page** - See the platypus welcome message
2. **API Playground** - Test a preset API (GitHub or PokeAPI)
3. **Bug Reporter** - Create a test bug and see the humor
4. **Analytics** - View your testing metrics
5. **Test Suites** - Create a collection of API tests
6. **Mocks** - Create a fake API endpoint
7. **Team** - Invite team members and collaborate

---

## 📚 Additional Resources

- [Full Documentation](./README.md)
- [QA Test Plan](./QA_PLAN.md)
- [Test Cases](./TEST_CASES.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Features Guide](./FEATURES.md)

---

## 🆘 Need Help?

If you encounter issues:

1. Check the [Setup Guide](./SETUP_GUIDE.md)
2. Review the [Troubleshooting](#troubleshooting) section above
3. Check the console for error messages
4. Verify all environment variables are set correctly

**Remember:** The platypus believes in you! 🦦✨
