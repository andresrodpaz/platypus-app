# Platypus QA Lab - Component Guide

Complete documentation for all components in the Platypus QA Lab application.

---

## 🦦 Overview

Platypus QA Lab is a comprehensive QA testing platform with AI-powered analysis, test automation, bug tracking, and team collaboration features.

---

## 📋 Main Components

### 1. **API Playground** (`/playground`)

**What it is:** An interactive API testing environment where you can test real public APIs and get instant feedback.

**Function:** 
- Test HTTP requests (GET, POST, PUT, PATCH, DELETE)
- Browse 50+ pre-configured public APIs
- Get AI-powered analysis of API responses
- View request/response history
- Filter APIs by category and HTTP method

**How to use:**
1. Select a preset API from the list or enter your own URL
2. Choose the HTTP method (GET, POST, etc.)
3. For POST/PUT/PATCH requests, add a JSON body
4. Click "Send Request"
5. View the response with status code, response time, and AI analysis
6. Check "Recent Requests" section to revisit previous tests

**Features:**
- 50+ public APIs across categories (Development, Social, Entertainment, Animals, Science, Location, Finance, Text)
- Real-time response analysis with humorous commentary
- AI-powered insights (requires OPENAI_API_KEY)
- Request history tracking
- Response formatting (formatted/raw JSON)
- Performance metrics (response time, status codes)

---

### 2. **Test Suites** (`/suites`)

**What it is:** A test suite management system for organizing and running collections of API tests.

**Function:**
- Create test suites with multiple API requests
- Run entire suites with one click
- Track test execution results
- Import/export suites as JSON
- Share suites with team members

**How to use:**
1. Click "Create Suite" to start a new test collection
2. Add a name and description
3. Navigate to the suite editor to add requests
4. Configure each request with URL, method, headers, body, and assertions
5. Click "Run" to execute all tests in sequence
6. View pass/fail results for each request
7. Export suites for backup or sharing

**Features:**
- Suite CRUD operations (Create, Read, Update, Delete)
- Request ordering and organization
- Assertion builder for validation
- Execution history tracking
- JSON import/export
- Public/private sharing options

---

### 3. **API Mocking** (`/mocks`)

**What it is:** A mock API server that lets you create fake endpoints for testing.

**Function:**
- Create custom mock endpoints
- Define response status codes, bodies, and latency
- Toggle mocks on/off
- Simulate slow APIs with configurable delays

**How to use:**
1. Click "Create Mock"
2. Enter mock details:
   - Name and description
   - Path (e.g., `/users/123`)
   - HTTP method
   - Status code (200, 404, 500, etc.)
   - Response body (JSON)
   - Latency in milliseconds
3. Toggle "Active" to enable the mock
4. Copy the mock URL to use in your tests
5. Access mock at `/api/mock{your-path}`

**Features:**
- Full CRUD for mock endpoints
- Custom status codes and responses
- Latency simulation
- Active/inactive toggle
- URL copy to clipboard
- Supports all HTTP methods

---

### 4. **Scheduled Tests & Monitoring** (`/monitoring`)

**What it is:** Automated test scheduling system using cron expressions.

**Function:**
- Schedule test suites to run automatically
- Monitor test execution status
- Get email notifications on failures
- Track last run and next run times

**How to use:**
1. Click "Create Schedule"
2. Select a test suite to automate
3. Enter a cron expression (e.g., `0 */6 * * *` for every 6 hours)
4. Optionally add notification email
5. Toggle active/pause as needed
6. Click "Run Now" to execute immediately

**Features:**
- Cron-based scheduling
- Email notifications
- Manual trigger option
- Active/paused status
- Last run and next run tracking
- Schedule management (edit, delete, pause)

**Common cron patterns:**
- `0 * * * *` - Every hour
- `0 */6 * * *` - Every 6 hours
- `0 9 * * *` - Daily at 9 AM
- `0 9 * * 1` - Every Monday at 9 AM

---

### 5. **Bug Dashboard** (`/bugs`)

**What it is:** A comprehensive bug tracking and management system.

**Function:**
- Report bugs with detailed information
- Track bug status and severity
- Assign bugs to team members
- Add comments and collaborate
- Filter and search bugs

**How to use:**
1. Click "Report Bug" to create a new bug
2. Fill in:
   - Title and description
   - Severity (critical, high, medium, low)
   - Affected endpoint/feature
   - Steps to reproduce
3. Assign to a team member
4. Update status as work progresses (open → in_progress → resolved → closed)
5. Add comments for collaboration
6. Filter by severity or status

**Features:**
- Bug CRUD operations
- Severity levels: critical, high, medium, low
- Status tracking: open, in_progress, resolved, closed
- Team member assignment
- Comment threads
- Filtering and search
- Bug statistics dashboard

---

### 6. **Team Collaboration** (`/team`)

**What it is:** Team management and activity tracking system.

**Function:**
- View team members and roles
- Track team activity feed
- Monitor who's doing what
- Collaborate on bugs and tests

**How to use:**
1. View "Team Members" tab to see all QA engineers
2. Check roles (Admin 🦦, Lead QA 👑, Tester 🧪)
3. Switch to "Activity Feed" to see recent actions
4. Monitor test runs, bug updates, suite creations, and comments

**Features:**
- Team member profiles with avatars
- Role-based badges
- Real-time activity feed
- Action tracking (test runs, bug updates, comments, suite creation)
- Team statistics

**Activity types tracked:**
- Test suite executions
- Bug creation and updates
- Comment additions
- Suite creation
- Status changes

---

### 7. **Reports** (`/reports`)

**What it is:** Test execution reporting and analytics system.

**Function:**
- View test execution history
- Analyze pass/fail rates
- Track performance trends
- Export reports as HTML

**How to use:**
1. Select a time range (7, 14, 30, or 90 days)
2. View key metrics:
   - Total executions
   - Pass rate percentage
   - Total tests (passed/failed)
   - Average response time
3. Analyze trend indicators
4. Click "Export HTML Report" for offline viewing

**Features:**
- Time range filtering
- Pass rate calculation
- Trend analysis (improving/declining)
- Performance metrics
- HTML export
- Execution history table
- Suite-level breakdown

---

### 8. **QA Analytics** (`/analytics`)

**What it is:** Real-time analytics dashboard with charts and insights.

**Function:**
- Visualize API testing data
- Monitor status code distribution
- Track response time trends
- Analyze bug severity and status
- Get performance recommendations

**How to use:**
1. View the dashboard for automatic insights
2. Check key metrics cards at the top
3. Analyze charts:
   - Status Code Distribution (pie chart)
   - Response Time Trend (line chart)
   - Bug Severity Distribution (bar chart)
   - Bug Status Overview (pie chart)
4. Read performance insights and recommendations

**Features:**
- Real-time data visualization
- 4 interactive charts (Recharts)
- Key metrics: total requests, avg response time, success rate, total bugs
- Performance insights with humor
- Recommendations based on data
- Color-coded status indicators

---

### 9. **API Documentation** (`/docs`)

**What it is:** Auto-generated API documentation and code examples.

**Function:**
- Generate OpenAPI 3.0 specifications
- Export Postman collections
- Generate code examples in multiple languages

**How to use:**
1. View auto-generated API documentation
2. Click "Export OpenAPI Spec" for OpenAPI 3.0 JSON
3. Click "Export Postman Collection" for Postman import
4. Click "Generate Code Examples" for:
   - cURL commands
   - JavaScript (fetch)
   - Python (requests)
   - Go (net/http)
   - Node.js (axios)

**Features:**
- OpenAPI 3.0 specification generation
- Postman collection export
- Multi-language code generation
- Request/response examples
- Authentication documentation

---

## 🛠️ Utility Components

### **Bug Report Dialog**
Modal for creating new bug reports with form validation.

### **Bug Details Dialog**
View bug details, add comments, and update status.

### **Create Suite Dialog**
Modal for creating new test suites with name, description, and sharing options.

### **Create Mock Dialog**
Modal for creating/editing mock API endpoints.

### **Create Schedule Dialog**
Modal for setting up cron-based test schedules.

### **Assertion Builder**
Build response assertions for test validation:
- Status code checks
- Response time limits
- JSON schema validation
- Regex pattern matching
- Content contains checks

### **Navigation**
Top navigation bar with links to all pages and theme toggle.

### **User Nav**
User profile menu and authentication controls.

### **Theme Toggle**
Switch between light and dark modes.

---

## 📚 Libraries & Utilities

### **Storage (`lib/storage.ts`)**
LocalStorage management for requests and bugs:
- `getRequests()` - Retrieve request history
- `saveRequest()` - Save new request
- `getBugs()` - Retrieve bugs
- `saveBug()` - Save/update bug
- `deleteBug()` - Remove bug
- `updateBugStatus()` - Change bug status

### **Humor Engine (`lib/humor-engine.ts`)**
Generates humorous comments based on HTTP status codes and response times:
- `generateHumorousComment(statusCode, responseTime)` - Returns witty commentary
- `getBugSeverityComment(severity)` - Severity-based humor

### **Assertions (`lib/assertions.ts`)**
Assertion validation engine for test suites:
- `AssertionEngine.validate()` - Validates assertions against responses
- Supports: status_code, response_time, json_schema, regex, contains

### **Code Generator (`lib/code-generator.ts`)**
Multi-language code generation:
- `generateCurlCommand()` - cURL
- `generateJavaScriptCode()` - JavaScript fetch
- `generatePythonCode()` - Python requests
- `generateGoCode()` - Go net/http
- `generateNodeCode()` - Node.js axios

### **Supabase Client (`lib/supabase/client.ts`)**
Browser-side Supabase client for database operations.

### **Supabase Server (`lib/supabase/server.ts`)**
Server-side Supabase client for API routes and server components.

---

## 🗄️ Database Schema

### Tables:
- **test_suites** - Test suite definitions
- **test_requests** - Individual requests within suites
- **test_executions** - Execution history with results
- **api_mocks** - Mock endpoint definitions
- **scheduled_tests** - Cron-scheduled tests
- **bugs** - Bug reports with status tracking
- **bug_comments** - Comments on bugs
- **user_profiles** - Team member profiles
- **activity_feed** - Team activity logs

---

## 🚀 Getting Started

1. **Run database setup:**
   - Execute `MASTER_SETUP.sql` in Supabase SQL Editor

2. **Configure environment variables:**
   - Add `OPENAI_API_KEY` for AI analysis (optional)
   - Supabase variables are auto-configured

3. **Start testing:**
   - Go to `/playground` to test APIs
   - Create test suites in `/suites`
   - Report bugs in `/bugs`
   - View analytics in `/analytics`

4. **Team collaboration:**
   - Invite team members
   - Assign bugs
   - Share test suites
   - Monitor activity feed

---

## 💡 Tips & Best Practices

1. **API Testing:**
   - Start with preset APIs to learn the interface
   - Use the request history to revisit previous tests
   - Check AI analysis for insights (add OPENAI_API_KEY)

2. **Test Suites:**
   - Group related API tests together
   - Use assertions to validate responses automatically
   - Export suites for backup

3. **Bug Tracking:**
   - Use appropriate severity levels
   - Add detailed reproduction steps
   - Update status as work progresses
   - Use comments for collaboration

4. **Mocking:**
   - Create mocks for APIs under development
   - Use latency simulation to test timeout handling
   - Toggle mocks on/off as needed

5. **Monitoring:**
   - Schedule critical tests to run regularly
   - Set up email notifications for failures
   - Review execution history in Reports

---

## 🔧 Configuration

### OpenAI API Key (Optional)
Add to environment variables for AI-powered analysis:
\`\`\`
OPENAI_API_KEY=sk-...
\`\`\`

Without this key, the app uses fallback humorous responses.

### Supabase
All Supabase environment variables are auto-configured in v0.

---

## 📞 Support

For issues or questions:
- Check the documentation in `/docs`
- Review test cases in `__tests__/`
- Open a support ticket at vercel.com/help

---

**Built with ❤️ by the Platypus QA Team 🦦**
