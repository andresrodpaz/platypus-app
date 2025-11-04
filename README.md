# Platypus QA Lab 🦦

> A platypus, an API, and a QA mission walk into a bar...

**Platypus QA Lab** is a comprehensive web application for testing public APIs, managing test suites, mocking endpoints, and collaborating with your QA team. Get hilariously accurate feedback powered by AI. Because if the API fails, at least we can laugh together.

## Features

### Core Features
- **API Playground**: Test real public APIs with instant feedback and AI-powered analysis
- **Bug Reporter**: Document bugs with professional severity ratings and sarcastic commentary
- **QA Analytics**: Visualize testing metrics with beautiful interactive charts
- **AI Analysis**: Get witty, context-aware commentary on every API response

### Advanced Features
- **Test Suites & Collections**: Group multiple requests and execute them sequentially
- **API Mocking & Stubbing**: Create mock endpoints to simulate any API response with custom latency
- **Advanced Assertions**: Validate responses with schema matching, regex, and performance thresholds
- **Scheduled Tests & Monitoring**: Automate testing with cron jobs and health checks
- **Email Notifications**: Get alerted when scheduled tests fail with beautiful HTML emails
- **Team Collaboration**: Assign bugs, comment on issues, and track team activity
- **Enhanced Reporting**: Export detailed QA reports with trend analysis
- **API Documentation Generator**: Auto-generate OpenAPI specs, Postman collections, and code examples

### Authentication & Roles
- **Supabase Auth**: Secure login and signup with email/password
- **User Roles**: Tester, Lead QA, and Admin roles with different permissions
- **Personal & Team History**: Track individual and team-wide testing metrics

## Tech Stack

| Area | Technology |
|------|------------|
| Framework | Next.js 16 + TypeScript |
| UI | Tailwind CSS v4 + shadcn/ui + Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth with RLS |
| Email | Resend |
| Charts | Recharts |
| Testing (API) | Jest + Supertest |
| Testing (UI) | Playwright (TypeScript) |
| CI/CD | GitHub Actions |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account (optional, works with localStorage)
- Resend account (optional, for email notifications)

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/platypus-qa-lab.git
cd platypus-qa-lab
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables (optional for Supabase):
\`\`\`bash
cp .env.example .env.local
\`\`\`

Add your Supabase credentials:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

4. (Optional) Add Resend API key for email notifications:
\`\`\`
RESEND_API_KEY=re_your_resend_api_key
\`\`\`

See [docs/EMAIL_SETUP.md](docs/EMAIL_SETUP.md) for detailed email configuration.

5. Run database migrations (if using Supabase):
\`\`\`bash
# Execute the SQL scripts in /scripts folder in your Supabase SQL editor
# Start with: scripts/001_create_tables.sql
# Then run: scripts/create-test-auth-users.sql (for test users)
\`\`\`

6. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

7. Open [http://localhost:3000](http://localhost:3000) in your browser

### Test Users

After running the database migrations, you'll have 5 test users available:

| Email | Password | Role |
|-------|----------|------|
| qa.lead@platypuslab.test | TestPass123! | QA Lead |
| senior.qa@platypuslab.test | TestPass123! | Senior QA Engineer |
| qa.engineer@platypuslab.test | TestPass123! | QA Engineer |
| junior.qa@platypuslab.test | TestPass123! | Junior QA Engineer |
| automation.qa@platypuslab.test | TestPass123! | QA Automation Engineer |

**Spanish Guide**: See [docs/CONFIGURACION_ES.md](docs/CONFIGURACION_ES.md) for a complete guide in Spanish.

## Running Tests

### Unit & Integration Tests (Jest)
\`\`\`bash
npm test
\`\`\`

### Watch Mode
\`\`\`bash
npm run test:watch
\`\`\`

### E2E Tests (Playwright)
\`\`\`bash
npm run test:ui
\`\`\`

### E2E with UI
\`\`\`bash
npm run test:ui:headed
\`\`\`

### All Tests
\`\`\`bash
npm test && npm run test:ui
\`\`\`

## Project Structure

\`\`\`
platypus-qa-lab/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── analyze/       # AI analysis endpoint
│   │   ├── mock/          # Mock API server
│   │   └── cron/          # Scheduled test jobs
│   ├── auth/              # Authentication pages
│   │   ├── login/
│   │   └── sign-up/
│   ├── playground/        # API testing page
│   ├── suites/            # Test suites management
│   ├── mocks/             # Mock endpoint management
│   ├── monitoring/        # Scheduled tests dashboard
│   ├── bugs/              # Bug dashboard
│   ├── team/              # Team collaboration
│   ├── reports/           # Enhanced reporting
│   ├── docs/              # API documentation generator
│   ├── analytics/         # Analytics dashboard
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── navigation.tsx    # Main navigation
│   ├── user-nav.tsx      # User menu
│   ├── bug-report-dialog.tsx
│   ├── create-suite-dialog.tsx
│   ├── create-mock-dialog.tsx
│   ├── assertion-builder.tsx
│   └── bug-details-dialog.tsx
├── lib/                   # Utilities
│   ├── supabase/         # Supabase clients
│   │   ├── client.ts
│   │   └── server.ts
│   ├── storage.ts        # LocalStorage wrapper
│   ├── humor-engine.ts   # Comment generator
│   ├── assertions.ts     # Assertion engine
│   └── types.ts          # TypeScript types
├── scripts/               # Database migrations
│   └── 001_create_tables.sql
├── docs/                  # QA Documentation
│   ├── QA_PLAN.md
│   ├── TEST_CASES.md
│   ├── BUG_REPORTS.md
│   ├── TEST_EXECUTION_REPORT.md
│   ├── TEST_METRICS.md
│   ├── SEVERITY_MATRIX.md
│   ├── QA_CHECKLIST.md
│   ├── TEST_STRATEGY.md
│   ├── API_DOCUMENTATION.md
│   ├── EMAIL_SETUP.md
│   └── CONFIGURACION_ES.md
├── __tests__/            # Jest tests
├── e2e/                  # Playwright tests
├── middleware.ts         # Auth middleware
└── public/               # Static assets
\`\`\`

## QA Documentation

Comprehensive QA documentation is available in the `/docs` folder:

- **[QA Plan](docs/QA_PLAN.md)**: Complete testing strategy and approach
- **[Test Cases](docs/TEST_CASES.md)**: 27+ detailed test cases covering all features
- **[Bug Reports](docs/BUG_REPORTS.md)**: Sample bugs with humorous severity descriptions
- **[Test Execution Report](docs/TEST_EXECUTION_REPORT.md)**: Results from testing cycles
- **[Test Metrics](docs/TEST_METRICS.md)**: Quality metrics and KPIs
- **[Severity Matrix](docs/SEVERITY_MATRIX.md)**: Bug severity definitions with platypus commentary
- **[QA Checklist](docs/QA_CHECKLIST.md)**: Pre-release quality checklist
- **[Test Strategy](docs/TEST_STRATEGY.md)**: Agile testing strategy and automation approach
- **[API Documentation](docs/API_DOCUMENTATION.md)**: Complete API reference
- **[Email Setup](docs/EMAIL_SETUP.md)**: Email notification configuration guide
- **[Configuración en Español](docs/CONFIGURACION_ES.md)**: Guía completa en español

## API Endpoints

### POST /api/analyze

Analyzes API responses and returns humorous, context-aware commentary.

**Request:**
\`\`\`json
{
  "statusCode": 200,
  "responseTime": 150,
  "url": "https://api.github.com/users/octocat",
  "method": "GET",
  "responseBody": {}
}
\`\`\`

**Response:**
\`\`\`json
{
  "comment": "This API is having a great day. Lightning fast response!",
  "emoji": "✨",
  "personality": "optimistic",
  "technicalNote": "Excellent response time under 200ms",
  "statusCode": 200,
  "responseTime": 150,
  "timestamp": 1706198400000
}
\`\`\`

### GET/POST/PUT/DELETE /api/mock/[...path]

Dynamic mock API server that serves custom responses based on configured mocks.

### POST /api/cron/run-scheduled-tests

Executes scheduled test suites (triggered by cron jobs or manually). Sends email notifications if tests fail and RESEND_API_KEY is configured.

## Database Schema

The application uses Supabase with the following tables:

- **profiles**: User profiles with roles (tester, lead_qa, admin)
- **test_suites**: Test suite collections
- **suite_requests**: Individual requests within suites
- **suite_executions**: Test execution history
- **execution_results**: Individual request results
- **assertions**: Validation rules for requests
- **mock_endpoints**: Mock API configurations
- **scheduled_tests**: Cron-based test schedules
- **bugs**: Bug reports with assignments
- **bug_comments**: Comment threads on bugs
- **bug_activities**: Activity log for bugs
- **team_members**: Team membership and roles

All tables include Row Level Security (RLS) policies for data protection.

## Preset APIs

The playground comes with these public APIs ready to test:

- **GitHub User**: `https://api.github.com/users/octocat`
- **Pokemon**: `https://pokeapi.co/api/v2/pokemon/pikachu`
- **Random Dog**: `https://dog.ceo/api/breeds/image/random`
- **NASA APOD**: `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY`
- **JSONPlaceholder**: `https://jsonplaceholder.typicode.com/posts/1`

## User Roles & Permissions

### Tester
- Test APIs and create test suites
- Report and comment on bugs
- View team activity
- Export personal reports

### Lead QA
- All Tester permissions
- Assign bugs to team members
- Create scheduled tests
- Export team reports
- Manage test suites

### Admin
- All Lead QA permissions
- Manage team members
- Configure mock endpoints
- Access all analytics
- System configuration

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Testing Guidelines

- Write tests for all new features
- Maintain 80%+ code coverage
- Run all tests before submitting PR
- Include both unit and E2E tests
- Add humorous comments (the platypus insists)
- Follow the QA documentation standards

## CI/CD Pipeline

The project includes a GitHub Actions workflow that:

1. Runs on every push and pull request
2. Installs dependencies
3. Runs Jest unit tests
4. Runs Playwright E2E tests
5. Generates test reports
6. Uploads artifacts (screenshots, videos, reports)
7. Deploys to Vercel on main branch

## Known Issues

See [BUG_REPORTS.md](docs/BUG_REPORTS.md) for current known issues.

## Roadmap

- [x] User authentication (Supabase)
- [x] Supabase database integration
- [x] Test suites and collections
- [x] API mocking and stubbing
- [x] Advanced assertions engine
- [x] Scheduled tests and monitoring
- [x] Email notifications (Resend)
- [x] Team collaboration features
- [x] Enhanced reporting system
- [x] API documentation generator
- [ ] Real-time notifications (WebSockets)
- [ ] Slack/Discord integrations
- [ ] Performance testing features
- [ ] Load testing capabilities
- [ ] More AI-powered insights
- [ ] Mobile app (React Native)

## License

MIT License - See LICENSE file for details

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database and Auth by [Supabase](https://supabase.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Tested with [Playwright](https://playwright.dev/) and [Jest](https://jestjs.io/)
- Humor provided by one very opinionated platypus

## Support

If you encounter issues:

1. Check the [documentation](docs/)
2. Search existing [issues](https://github.com/yourusername/platypus-qa-lab/issues)
3. Create a new issue with details
4. Ask the platypus (results may vary)

---

**Made with love and sarcasm by QA engineers, for QA engineers**

*"Testing serious, results hilarious. Because if the API fails, at least we laugh together."* - The Platypus
