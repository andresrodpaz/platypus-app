# Platypus QA Lab - Complete User Guide

> Your comprehensive guide to using Platypus QA Lab like a pro 🦦

## 📋 Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Core Features](#core-features)
4. [Components & Pages](#components--pages)
5. [Tips & Tricks](#tips--tricks)
6. [Keyboard Shortcuts](#keyboard-shortcuts)
7. [FAQ](#faq)

---

## Introduction

**Platypus QA Lab** is a comprehensive API testing and monitoring platform designed for QA professionals, developers, and API enthusiasts. It combines powerful testing capabilities with humorous AI-powered analysis to make API testing enjoyable and productive.

### Key Features

- 🧪 **Interactive API Testing Playground** - Test any API with instant feedback
- 📊 **Test Suite Management** - Organize and execute collections of tests
- 🐛 **Bug Tracking & Reporting** - Track issues with severity and status
- 📈 **Real-time Analytics & Monitoring** - Visualize testing metrics
- 🔄 **Mock API Management** - Create fake endpoints for testing
- 👥 **Team Collaboration** - Share tests, bugs, and activity
- 📑 **Comprehensive Reports** - Export detailed test reports
- 🚀 **API Documentation Export** - Generate OpenAPI specs and Postman collections
- 🤖 **AI-Powered Analysis** - Get witty, context-aware commentary on API responses

---

## Getting Started

### Home Page

The home page (`/`) provides quick access to key features:

- **Test Execution Stats**: Real-time test metrics and success rates
- **Quick Actions**: Create suite, test API, report bug buttons
- **Recent Activity**: Last 10 actions on the platform (test runs, bug reports, suite creations)
- **Team Members**: Current team roster with avatars and roles

### Navigation

Use the top navigation bar to access all features:

- **Home** - Dashboard overview
- **Playground** - Interactive API testing
- **Suites** - Test suite management
- **Mocks** - Mock API endpoints
- **Monitoring** - Scheduled tests and health checks
- **Bugs** - Bug tracking dashboard
- **Team** - Team collaboration
- **Reports** - Test execution reports
- **Analytics** - Data visualization
- **API Docs** - Documentation generator

---

## Core Features

### 1. 🎮 API Playground

**Location**: `/playground`

The Playground is your interactive API testing sandbox where you can test any HTTP API and get instant feedback with AI-powered analysis.

#### How to Use

**Step 1: Select or Enter API**

1. Click "Select API" to browse 50+ pre-configured public APIs
2. APIs are grouped by category:
   - **Development**: GitHub, GitLab, JSONPlaceholder
   - **Social**: Twitter, Reddit, Instagram
   - **Entertainment**: Pokemon, Star Wars, Marvel
   - **Science**: NASA, Space APIs, Weather
   - **Finance**: Exchange rates, Crypto prices
   - **Animals**: Dog, Cat, Duck facts
   - And more...
3. Or paste a custom URL in the URL field

**Step 2: Configure Request**

- **Method**: Select HTTP method (GET, POST, PUT, PATCH, DELETE)
- **Headers**: Add custom headers (e.g., `Authorization: Bearer token`)
- **Body**: For POST/PUT/PATCH requests, add JSON body
- **Parameters**: Add URL query parameters

**Step 3: Send Request**

1. Click "Send Request" to execute the API call
2. The request is sent and response is displayed instantly

**Step 4: View Results**

Response Display includes:
- **Status Code**: HTTP response status (200, 404, 500, etc.)
- **Response Time**: Performance metrics in milliseconds
- **Headers**: All response headers
- **Body**: Full response content (formatted or raw JSON)
- **AI Analysis**: Grok AI-powered insights with humorous commentary

#### Code Generation

Generate working code in multiple languages:
- **cURL**: Command-line requests
- **JavaScript**: Fetch API implementation
- **Python**: Requests library code
- **Go**: Go HTTP implementation
- **Node.js**: Node-fetch implementation

#### Request History

Last 10 requests are saved and can be:
- Replayed with one click
- Compared with other requests
- Exported for documentation

---

### 2. 📋 Test Suites

**Location**: `/suites`

Organize and manage your test collections. Test suites allow you to group related API tests and execute them together.

#### Creating a Suite

**Step 1: Click "Create Suite"**

Modal opens with fields:
- **Name**: Suite identifier (e.g., "User API Tests")
- **Description**: Purpose and scope

**Step 2: Add Test Requests**

1. After creating the suite, click "Add Request" or edit the suite
2. Configure each request:
   - **URL**: The API endpoint
   - **HTTP Method**: GET, POST, PUT, DELETE, etc.
   - **Headers**: Custom headers if needed
   - **Body**: Request body for POST/PUT requests
   - **Assertions**: Expected outcomes (see below)

**Step 3: Set Assertions**

Define expected outcomes for validation:
- **Status Code**: Expected HTTP status (e.g., 200)
- **Response Time**: Max acceptable time in milliseconds
- **Body Contains**: Text to find in response
- **JSON Schema**: Validate response structure
- **Regex Pattern**: Match response against pattern
- **Header Validation**: Expected header values

#### Running Tests

1. Select a suite from the list
2. Click "Run Tests" button
3. View results in real-time:
   - Pass/fail status for each request
   - Response times
   - Error messages (if any)
4. Export results as report (HTML, JSON, CSV)

#### Suite Operations

- **Edit**: Modify suite details and requests
- **Duplicate**: Copy suite with all requests
- **Export**: Postman collection, OpenAPI spec, JSON
- **Delete**: Remove suite and all requests
- **Schedule**: Set up automated test runs (see Monitoring)

---

### 3. 🧩 API Mocking

**Location**: `/mocks`

Create mock API endpoints for testing without depending on external services.

#### Creating a Mock

**Step 1: Click "Create Mock"**

Configure the mock:
- **Name**: Mock identifier (e.g., "User Profile Mock")
- **Path**: Endpoint path (e.g., `/api/users/123`)
- **Method**: HTTP method (GET, POST, PUT, DELETE)
- **Status Code**: Response HTTP status (200, 404, 500, etc.)
- **Response Body**: JSON response (e.g., `{"id": 123, "name": "John"}`)
- **Headers**: Custom response headers (optional)
- **Latency**: Simulate slow APIs with delay in milliseconds

**Step 2: Activate Mock**

1. Toggle "Active" switch to enable the mock
2. Copy the mock URL (e.g., `http://localhost:3000/api/mock/api/users/123`)
3. Use this URL in your tests

#### Mock Use Cases

- **Test Error Handling**: Create mocks that return 404, 500, etc.
- **Test Response Parsing**: Validate how your app handles specific response formats
- **Test Edge Cases**: Simulate unusual responses
- **Develop Without External APIs**: Build features without waiting for backend APIs
- **Training and Demonstrations**: Show API behavior without real endpoints

---

### 4. 📊 Monitoring & Scheduled Tests

**Location**: `/monitoring`

Track API health and automate test execution with cron-based scheduling.

#### Creating a Scheduled Test

**Step 1: Click "Create Schedule"**

Configure:
- **Test Suite**: Select a suite to automate
- **Cron Expression**: Schedule pattern (e.g., `0 */6 * * *` for every 6 hours)
- **Notification Email**: Email to receive failure alerts
- **Active**: Toggle to enable/disable

**Common Cron Patterns**:
- `0 * * * *` - Every hour
- `0 */6 * * *` - Every 6 hours
- `0 9 * * *` - Daily at 9 AM
- `0 9 * * 1` - Every Monday at 9 AM
- `*/15 * * * *` - Every 15 minutes

**Step 2: Monitor Execution**

- View last run time and status
- See next scheduled run time
- Check execution history
- Click "Run Now" to execute immediately

#### Email Notifications

When a scheduled test fails:
- You receive a beautiful HTML email with:
  - Test results summary
  - Pass/fail breakdown
  - Direct link to view full report
  - Humorous Platypus commentary

---

### 5. 🐛 Bug Tracking

**Location**: `/bugs`

Track and manage API issues with full lifecycle management.

#### Reporting a Bug

**Step 1: Click "Report Bug"**

Fill in the form:
- **Title**: Bug summary (e.g., "API returns 500 on invalid input")
- **Description**: Detailed explanation of the issue
- **Severity**: Critical, High, Medium, Low
- **Endpoint**: Which API has the issue (optional)
- **Steps to Reproduce**: How to trigger the bug

**Step 2: Add Evidence**

- Attach test case reference
- Include response data
- Screenshot (if applicable)
- Related test execution

**Step 3: Submit**

Bug gets:
- Auto-assigned ID
- Added to dashboard
- Available for team discussion
- Tracked in reports

#### Bug Management

**Lifecycle**:
```
Reported → In Progress → Resolved → Closed
```

**Actions**:
- **Add Comments**: Team discussion thread
- **Change Status**: Update progress (open → in_progress → resolved → closed)
- **Assign**: Assign to team member
- **Link to Suite**: Associate with test suite
- **Filter**: Filter by severity or status

**Severity Levels**:
- **Critical**: Application crash, data loss, security vulnerability
- **High**: Major feature broken, significant impact
- **Medium**: Feature partially broken, workaround exists
- **Low**: Minor issue, cosmetic problem

---

### 6. 👥 Team Collaboration

**Location**: `/team`

Real-time team collaboration with activity tracking and member management.

#### Team Features

**Member Management**:
- View all team members with avatars
- See member status (online/offline indicators)
- View member roles (Admin 🦦, Lead QA 👑, Tester 🧪)
- Member activity timeline

**Activity Feed (Real-Time)**:
Updates appear instantly:
- New tests created
- Bug reports filed
- Bugs resolved
- Suite executed
- Member joined
- Comments added

**Features**:
- Filter by activity type
- Search member names
- View member profiles
- See member contributions

---

### 7. 📈 Analytics

**Location**: `/analytics`

Data insights and performance metrics with beautiful visualizations.

#### Available Metrics

**Overview Dashboard**:
- **Total Requests**: Cumulative API requests
- **Success Rate**: Percentage of successful tests
- **Bug Count**: Open/closed breakdown
- **Average Response Time**: Across all APIs

**Charts & Visualizations**:

1. **Status Code Distribution** (Pie Chart)
   - Shows distribution of HTTP status codes
   - Color-coded by status type

2. **Response Time Trend** (Line Chart)
   - Response times over time
   - Identify performance degradation

3. **Bug Severity Distribution** (Bar Chart)
   - Bugs grouped by severity level
   - Track critical issues

4. **Bug Status Overview** (Pie Chart)
   - Open vs. Resolved bugs
   - Monitor resolution progress

#### Data Filters

- **Date Range**: Custom time periods (7, 14, 30, 90 days)
- **API Filter**: Specific endpoints
- **Status Filter**: Pass/Fail/All
- **Team Filter**: By team member

---

### 8. 📑 Reports

**Location**: `/reports`

Comprehensive test reports and documentation.

#### Report Types

**Test Execution Reports**:
Contains:
- Test suite summary
- Individual test results
- Pass/fail breakdown
- Execution timeline
- Performance metrics

**API Documentation**:
Generated from test suites:
- Endpoint descriptions
- Expected responses
- Error codes
- Example requests
- Authentication details

**Bug Reports**:
- Reported bugs
- Severity distribution
- Status breakdown
- Resolution timeline
- Trends

#### Export Options

**Formats**:
- 📄 **PDF**: Formatted document
- 📊 **HTML**: Interactive report
- 📋 **CSV**: Data for Excel
- 📦 **JSON**: Raw data export
- 📮 **Postman**: Postman collection

**How to Export**:
1. Open report
2. Click "Export" button
3. Select format
4. Download or share

---

### 9. 📚 API Documentation Generator

**Location**: `/docs`

Auto-generated API documentation and code examples.

#### Features

**Browsable API List**:
- All public APIs organized by category
- Search functionality
- API descriptions
- Example requests

**Generated Documentation**:
From your test suites:
- OpenAPI 3.0 specification
- Postman collections
- HTML documentation
- Interactive examples

**Export Documentation**:
1. Select endpoints
2. Choose format
3. Export for sharing
4. Generate interactive docs

---

## Components & Pages

### Component Details

#### Bug Report Dialog

Modal for creating new bug reports with form validation:
- Title and description fields
- Severity dropdown (Critical, High, Medium, Low)
- Endpoint input
- Steps to reproduce textarea
- Submit button with validation

#### Bug Details Dialog

View bug details, add comments, and update status:
- Bug information display
- Status change dropdown
- Assignment to team member
- Comment thread
- Activity history

#### Create Suite Dialog

Modal for creating new test suites:
- Name and description fields
- Public/private sharing options
- Save button

#### Create Mock Dialog

Modal for creating/editing mock API endpoints:
- Name, path, method fields
- Status code selector
- Response body JSON editor
- Latency slider
- Active toggle

#### Create Schedule Dialog

Modal for setting up cron-based test schedules:
- Suite selector
- Cron expression input with helper
- Notification email field
- Active toggle

#### Assertion Builder

Build response assertions for test validation:
- Status code checks
- Response time limits
- JSON schema validation
- Regex pattern matching
- Content contains checks

---

## Tips & Tricks

### 🚀 Productivity Tips

1. **Bulk API Testing**
   - Create a suite with multiple endpoints
   - Run all at once
   - Compare results instantly

2. **Response Time Tracking**
   - Monitor same API multiple times
   - Identify performance trends
   - Set performance baselines
   - Alert on degradation

3. **Team Collaboration**
   - Use shared suites for team testing
   - Comment on bugs for discussion
   - @mention teammates in reports
   - Schedule collaborative test sessions

4. **Reusable Components**
   - Duplicate working suites
   - Modify for different scenarios
   - Build test library
   - Scale testing efforts

5. **Mock API Testing**
   - Create mocks for all error scenarios
   - Test edge cases safely
   - Validate error handling
   - No external dependency risk

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

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Quick search |
| `Ctrl/Cmd + Enter` | Send request |
| `Ctrl/Cmd + S` | Save current request |
| `Ctrl/Cmd + E` | Export |
| `Ctrl/Cmd + P` | Print report |
| `Ctrl/Cmd + Shift + D` | Toggle dark mode |
| `?` | Show help |

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
A: Postman, OpenAPI 3.0, JSON, HTML, CSV, and PDF.

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

- **Documentation**: Review this guide and other docs in `docs/`
- **Examples**: Check sample suites in the app
- **Team**: Ask your team members
- **Support**: Open GitHub issue

---

**Happy Testing! 🎉**

*Last Updated: January 2026*

