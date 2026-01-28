# Platypus QA Lab - Complete Application Guide

## 📋 Table of Contents

1. [Introduction](#introduction)
2. [Quick Start](#quick-start)
3. [Core Features](#core-features)
4. [User Guide](#user-guide)
5. [Components & Architecture](#components--architecture)
6. [Keyboard Shortcuts](#keyboard-shortcuts)
7. [Tips & Best Practices](#tips--best-practices)
8. [FAQ](#faq)

---

## Introduction

**Platypus QA Lab** is a comprehensive API testing and monitoring platform designed for QA professionals, developers, and API enthusiasts. It combines powerful testing capabilities with humorous AI-powered analysis to make API testing enjoyable and productive.

### Key Features

- 🧪 **Interactive API Testing Playground** - Test any public API with real-time feedback
- 📊 **Test Suite Management** - Organize and execute collections of API tests
- 🐛 **Bug Tracking & Reporting** - Comprehensive bug management system
- 📈 **Real-time Analytics & Monitoring** - Track performance and trends
- 🔄 **Mock API Management** - Create fake endpoints for testing
- 👥 **Team Collaboration** - Real-time team features and activity tracking
- 📑 **Comprehensive Reports** - Generate detailed test reports
- 🚀 **API Documentation Export** - Export to OpenAPI, Postman, and more
- 🤖 **AI-Powered Analysis** - Grok AI integration for intelligent insights
- ⏰ **Scheduled Tests** - Automated test execution with cron scheduling

---

## Quick Start

### 1. Home Page (`/`)

The home page provides quick access to key features:
- **Test Execution Stats**: Real-time test metrics
- **Quick Actions**: Create suite, test API, report bug
- **Recent Activity**: Last 10 actions on the platform
- **Team Members**: Current team roster

### 2. First Steps

1. **Test an API**: Go to `/playground` and click a preset API
2. **Create a Test Suite**: Go to `/suites` and create your first collection
3. **Report a Bug**: Go to `/bugs` and create a test bug
4. **View Analytics**: Go to `/analytics` to see your metrics

---

## Core Features

### 1. 🎮 API Playground (`/playground`)

**What it is**: Interactive API testing environment where you can test real public APIs and get instant feedback.

#### Features

- **50+ Preset APIs**: Quick access to popular APIs organized by category
  - Development: JSONPlaceholder, HTTPBin, ReqRes
  - Social: GitHub, GitLab
  - Entertainment: Pokemon, Random User, Dad Jokes
  - Animals: Dog CEO, Cat Facts
  - Science: NASA APOD
  - Location: REST Countries
  - Finance: Exchange Rates, Bitcoin Price
  - Text: Lorem Ipsum generators

- **Custom API Testing**: Test any HTTP endpoint
- **Multiple HTTP Methods**: GET, POST, PUT, PATCH, DELETE
- **Request Configuration**: Custom headers, body, query parameters
- **Response Visualization**: Formatted JSON, raw text, headers tabs
- **Performance Metrics**: Response time tracking and status code analysis
- **AI Analysis**: Grok AI-powered witty commentary on API responses
- **Request History**: Last 10 requests saved for quick replay

#### How to Use

**Step 1: Select or Enter API**
1. Click "Select API" to choose from 50+ public APIs
2. Or paste a custom URL in the URL field
3. APIs are grouped by category for easy browsing

**Step 2: Configure Request**
- **Method**: Select HTTP method (GET, POST, PUT, PATCH, DELETE)
- **Headers**: Add custom headers (e.g., `Authorization: Bearer token`)
- **Body**: For POST/PUT/PATCH requests, add JSON body
- **Parameters**: Add URL query parameters

**Step 3: Send Request**
- Click "Send Request" to execute the API call
- Response appears in real-time with formatted display

**Step 4: View Results**
- **Status Code**: HTTP response status with color coding
- **Response Time**: Performance metrics in milliseconds
- **Headers**: Response headers tab
- **Body**: Formatted and raw JSON views
- **AI Analysis**: Contextual humorous commentary with technical notes

#### Code Generation

Generate working code in multiple languages:
- **cURL**: Command-line requests
- **JavaScript**: Fetch API implementation
- **Python**: Requests library code
- **Go**: Go HTTP implementation
- **Node.js**: Node-fetch implementation

Click the "Generate Code" button to see code examples for your request.

---

### 2. 📋 Test Suites (`/suites`)

**What it is**: A test suite management system for organizing and running collections of API tests.

#### Features

- **Suite Management**: Create, edit, delete, and duplicate test suites
- **Request Builder**: Add multiple API requests to a suite
- **Assertion Engine**: Define expected outcomes for each request
- **Batch Execution**: Run entire suites with one click
- **Progress Tracking**: Real-time execution progress with visual feedback
- **Result Comparison**: Compare results between different executions
- **Export/Import**: JSON export for sharing and backup
- **Execution History**: Track all suite runs with detailed results
- **Scheduling**: Schedule suites to run automatically

#### Creating a Suite

**Step 1: Click "Create Suite"**
- Modal opens with fields:
  - Name: Suite identifier
  - Description: Purpose and scope
  - Sharing: Public or private

**Step 2: Add Test Requests**
1. Click "Add Request" in the suite editor
2. Configure each request:
   - URL
   - HTTP Method
   - Headers
   - Body (if needed)
   - Assertions

**Step 3: Set Assertions**

Define expected outcomes:
- **Status Code**: e.g., equals 200
- **Response Time**: Max acceptable time (e.g., less than 500ms)
- **Body Contains**: Text to find in response
- **JSON Path**: Validate specific JSON fields
- **Regex Pattern**: Pattern matching
- **Schema Validation**: JSON schema validation

#### Running Tests

1. Select suite from the list
2. Click "Run Tests" button
3. View results in real-time with pass/fail indicators
4. Export results as HTML report

#### Suite Operations

- **Edit**: Modify suite details and requests
- **Duplicate**: Copy suite with all requests
- **Export**: Postman Collection, OpenAPI Spec, JSON
- **Delete**: Remove suite and all requests
- **Schedule**: Set automated test runs via cron

---

### 3. 🧩 API Mocking (`/mocks`)

**What it is**: A mock API server that lets you create fake endpoints for testing.

#### Features

- **Mock Endpoint Creation**: Create custom mock endpoints
- **Full CRUD**: Create, read, update, delete mock endpoints
- **Custom Responses**: Define status codes and response bodies
- **Latency Simulation**: Add delays to simulate slow networks
- **Active/Inactive Toggle**: Enable/disable mocks without deletion
- **URL Generation**: Automatic mock URL generation

#### Creating a Mock

**Step 1: Click "Create Mock"**

Configure:
- **Name**: Mock identifier
- **Path**: e.g., `/users/123`
- **Method**: GET, POST, PUT, DELETE, PATCH
- **Status Code**: Response HTTP status (200, 404, 500, etc.)
- **Response Body**: JSON response
- **Headers**: Custom response headers (optional)
- **Latency**: Delay in milliseconds (0-5000ms)

**Step 2: Use in Tests**

1. In Playground, enter mock URL: `http://localhost:3000/api/mock{your-path}`
2. Mock responds with configured data
3. Test error scenarios safely
4. No external dependencies

#### Mock Use Cases

- **Error Handling**: Test 500, 404, 403 responses
- **Slow Networks**: Simulate slow API responses
- **Edge Cases**: Test with specific data structures
- **Offline Development**: Develop without external APIs
- **Training**: Demonstrations and tutorials

---

### 4. 📊 Monitoring (`/monitoring`)

**What it is**: Automated test scheduling system using cron expressions.

#### Features

- **Cron-Based Scheduling**: Run tests automatically on schedule
- **Preset Schedules**: Every 5 minutes, hourly, daily, weekly
- **Custom Cron Expressions**: Full flexibility with cron syntax
- **Email Notifications**: Get alerted when tests fail
- **Active/Pause Controls**: Temporarily disable schedules
- **Execution Tracking**: View last run and next scheduled run
- **Health Monitoring**: Continuous API uptime monitoring

#### Creating a Schedule

**Step 1: Click "Create Schedule"**

1. Select a test suite to automate
2. Enter a cron expression (e.g., `0 */6 * * *` for every 6 hours)
3. Optionally add notification email
4. Toggle active/pause as needed

**Common Cron Patterns**:
- `*/5 * * * *` - Every 5 minutes
- `0 * * * *` - Every hour
- `0 */6 * * *` - Every 6 hours
- `0 9 * * *` - Daily at 9 AM
- `0 9 * * 1` - Every Monday at 9 AM

**Step 2: Monitor Execution**

- View last run time and status
- See next scheduled run time
- Check execution history
- Get email notifications on failures

---

### 5. 🐛 Bug Dashboard (`/bugs`)

**What it is**: A comprehensive bug tracking and management system.

#### Features

- **Bug Reporting**: Create detailed bug reports
- **Severity Levels**: Critical, High, Medium, Low
- **Status Tracking**: Open, In Progress, Fixed, Closed
- **Team Assignment**: Assign bugs to team members
- **Comment System**: Threaded discussions on bugs
- **Filtering & Search**: Filter by severity, status, assignee
- **Statistics Dashboard**: Bug counts and trends
- **Activity Timeline**: Track bug history

#### Reporting a Bug

**Step 1: Click "Report Bug"**

Fill in:
- **Title**: Brief bug summary
- **Description**: Detailed explanation
- **Severity**: Critical, High, Medium, Low
- **Endpoint**: Which API has the issue
- **Steps to Reproduce**: How to trigger it

**Step 2: Submit**

Bug gets:
- Auto-assigned unique ID
- Added to dashboard
- Available for team discussion
- Tracked in analytics

#### Bug Management

**Lifecycle**:
```
Reported → In Progress → Fixed → Closed
```

**Actions**:
- **Add Comments**: Team discussion
- **Change Status**: Update progress
- **Assign**: Team member assignment
- **Link to Suite**: Associate with test suite
- **Close**: Mark as resolved

**Severity Definitions**:
- **Critical**: Application crash, data loss, security vulnerability
- **High**: Major feature broken, significant impact
- **Medium**: Feature partially broken, workaround exists
- **Low**: Minor issue, cosmetic problem

---

### 6. 👥 Team Collaboration (`/team`)

**What it is**: Team management and activity tracking system.

#### Features

- **Team Member List**: View all team members with roles
- **Role-Based Access**: Admin 🦦, Lead QA 👑, Tester 🧪
- **Activity Feed**: Real-time updates on team actions
- **Presence Indicators**: See who's online
- **Activity Timeline**: Track all team actions

#### Team Features

**Member Management**:
- View all team members
- See member status (online/offline)
- Real-time presence indicators
- Member activity timeline

**Activity Feed**:
Updates appear instantly:
- New tests created
- Bug reports filed
- Bugs resolved
- Suite executed
- Member joined
- API accessed

**Activity Types Tracked**:
- Test suite executions
- Bug creation and updates
- Comment additions
- Suite creation
- Status changes

---

### 7. 📈 Analytics Dashboard (`/analytics`)

**What it is**: Real-time analytics dashboard with charts and insights.

#### Features

- **Visual Metrics**: Interactive charts for status codes, response times, bug severity
- **Performance Insights**: Success rate, average response time, total requests
- **Trend Analysis**: Compare current vs historical performance
- **Bug Statistics**: Track bug distribution and resolution rates
- **Humorous Commentary**: Platypus provides witty insights based on metrics

#### Available Metrics

**Overview Dashboard**:
- **Total Tests Run**: Cumulative count
- **Success Rate**: % passing tests
- **Bug Count**: Open/closed breakdown
- **Average Response Time**: Across all APIs

**Charts & Visualizations**:

1. **Status Code Distribution** (Pie Chart)
   - Breakdown of 2xx, 3xx, 4xx, 5xx responses
   - Color-coded by status range

2. **Response Time Trend** (Line Chart)
   - Last 10 requests plotted
   - Performance trend visualization

3. **Bug Severity Breakdown** (Bar Chart)
   - Critical, High, Medium, Low distribution
   - Visual severity representation

4. **Bug Status Overview** (Pie Chart)
   - Open, In Progress, Fixed, Closed breakdown

#### Data Filters

- **Date Range**: Custom time periods
- **API Filter**: Specific endpoints
- **Status Filter**: Pass/Fail/All
- **Team Filter**: By team member

---

### 8. 📑 Reports (`/reports`)

**What it is**: Test execution reporting and analytics system.

#### Features

- **Execution History**: Complete log of all test runs
- **Trend Analysis**: Compare recent vs older test executions
- **Pass Rate Tracking**: Monitor test success over time
- **Performance Metrics**: Response time trends and reliability stats
- **HTML Export**: Generate beautiful HTML reports

#### Report Types

**Test Execution Reports**:
- Test suite summary
- Individual test results
- Pass/fail breakdown
- Execution timeline
- Performance metrics

**Export Options**:
- **HTML**: Interactive report with charts
- **JSON**: Raw data export
- **CSV**: Data for Excel analysis

---

### 9. 📚 API Documentation (`/docs`)

**What it is**: Auto-generated API documentation and code examples.

#### Features

- **OpenAPI 3.0**: Generate OpenAPI specifications
- **Postman Collections**: Export for Postman import
- **Code Examples**: Generate code in multiple languages
- **Interactive Explorer**: Browse API endpoints

#### Generated Formats

**OpenAPI Spec**:
```yaml
openapi: 3.0.0
info:
  title: My API
  version: 1.0.0
paths:
  /users:
    get:
      summary: Get users
```

**Postman Collection**:
- Import directly into Postman
- All requests pre-configured
- Ready to use

**Code Examples**:
- cURL commands
- JavaScript (fetch)
- Python (requests)
- Go (net/http)
- Node.js (node-fetch)

---

## Components & Architecture

### Application Structure

```
Platypus QA Lab
├── Frontend: Next.js 16 + React 19 + TypeScript
├── UI: Tailwind CSS v4 + shadcn/ui + Framer Motion
├── Backend: Next.js API Routes + Supabase
├── Database: PostgreSQL (via Supabase)
├── Auth: Supabase Auth (Email/Password)
├── Testing: Jest (Unit) + Playwright (E2E)
└── CI/CD: GitHub Actions
```

### Key Components

#### Navigation (`components/navigation.tsx`)
- Top navigation bar with links to all pages
- Responsive hamburger menu for mobile
- Theme toggle (light/dark mode)
- User profile menu

#### API Playground (`app/playground/page.tsx`)
- Interactive API testing interface
- Preset API browser
- Request/response display
- Code generation

#### Bug Dashboard (`app/bugs/page.tsx`)
- Bug list with filtering
- Bug statistics cards
- Bug creation dialog
- Bug details dialog

#### Test Suites (`app/suites/page.tsx`)
- Suite list and management
- Suite editor
- Request builder
- Execution results

#### Analytics Dashboard (`app/analytics/page.tsx`)
- Interactive charts (Recharts)
- Metrics cards
- Trend analysis
- Performance insights

### Utility Libraries

#### Storage (`lib/storage.ts`)
- LocalStorage management for requests and bugs
- Request history persistence
- Bug storage and retrieval

#### Humor Engine (`lib/humor-engine.ts`)
- Generates humorous comments based on HTTP status codes
- Response time-based commentary
- Bug severity humor

#### Assertions (`lib/assertions.ts`)
- Assertion validation engine
- Supports: status_code, response_time, json_schema, regex, contains
- Field-level validation

#### Code Generator (`lib/code-generator.ts`)
- Multi-language code generation
- cURL, JavaScript, Python, Go, Node.js

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Quick search |
| `Ctrl/Cmd + Enter` | Send request (Playground) |
| `Ctrl/Cmd + S` | Save current request |
| `Ctrl/Cmd + E` | Export |
| `Ctrl/Cmd + P` | Print report |
| `Ctrl/Cmd + Shift + D` | Toggle dark mode |
| `?` | Show help |

---

## Tips & Best Practices

### 🚀 Productivity Tips

1. **Bulk API Testing**
   - Create a suite with multiple endpoints
   - Run all at once
   - Compare results instantly

2. **Response Time Tracking**
   - Monitor same API multiple times
   - Identify performance trends
   - Set performance baselines

3. **Team Collaboration**
   - Use shared suites for team testing
   - Comment on bugs for discussion
   - @mention teammates in reports

4. **Reusable Components**
   - Duplicate working suites
   - Modify for different scenarios
   - Build test library

5. **Mock API Testing**
   - Create mocks for all error scenarios
   - Test edge cases safely
   - Validate error handling

### 🎯 Best Practices

1. **Organize by Feature**
   - Create suite per API feature
   - Keep related tests together
   - Easy to find and run

2. **Clear Test Names**
   - Use descriptive names
   - Include what's being tested
   - Indicate expected outcome

3. **Regular Monitoring**
   - Set up health checks
   - Monitor critical endpoints
   - Track performance trends

4. **Document Issues**
   - Report bugs immediately
   - Include reproduction steps
   - Add context and examples

5. **Version Control**
   - Export suites regularly
   - Version your API tests
   - Track changes over time

---

## FAQ

### General Questions

**Q: Can I test any public API?**  
A: Yes! Platypus works with any HTTP API. Use 50+ pre-configured public APIs or enter custom URLs.

**Q: Is my data saved?**  
A: Yes, test results and suites are saved to Supabase and persist between sessions.

**Q: Can I collaborate with my team?**  
A: Yes! Team features allow real-time sharing, commenting on bugs, and activity tracking.

**Q: How many tests can I run?**  
A: Unlimited! Scale from single tests to enterprise-level monitoring.

### Technical Questions

**Q: What formats can I export?**  
A: Postman, OpenAPI 3.0, JSON, HTML, CSV.

**Q: Can I use API keys with Platypus?**  
A: Yes, add headers including Authorization and custom headers for authentication.

**Q: Does Platypus store response data?**  
A: Yes, but only within your Supabase instance. No data leaves your infrastructure.

**Q: Can I schedule automated tests?**  
A: Yes, configure cron schedules for suites and get email notifications.

### Troubleshooting

**Q: Why am I getting CORS errors?**  
A: Some APIs block cross-origin requests. Use mock APIs or CORS proxies.

**Q: Response is timing out?**  
A: API might be slow or down. Check monitoring. Increase timeout in settings.

**Q: Lost my test suite?**  
A: Check Suites page - it might be archived. Use search to find it.

**Q: Export not working?**  
A: Ensure suite has valid requests with no missing fields.

---

## Getting Help

- **Documentation**: Review this guide
- **Examples**: Check sample suites in the app
- **Team**: Ask your team members
- **Support**: Open GitHub issue

---

**Happy Testing! 🎉**

*Last Updated: November 2025*

