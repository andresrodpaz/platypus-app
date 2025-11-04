# API Documentation - Platypus QA Lab

## 📋 Table of Contents

1. [Overview](#overview)
2. [Base URL & Authentication](#base-url--authentication)
3. [Endpoints](#endpoints)
   - [POST /api/analyze](#post-apianalyze)
   - [GET /api/health](#get-apihealth)
   - [GET /api/stats](#get-apistats)
   - [GET /api/public-apis](#get-apipublic-apis)
   - [Mock API Endpoints](#mock-api-endpoints)
   - [GET /api/cron/run-scheduled-tests](#get-apicronrun-scheduled-tests)
4. [Response Formats](#response-formats)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Best Practices](#best-practices)
8. [Examples](#examples)

---

## Overview

Platypus QA Lab provides a comprehensive REST API for analyzing API responses, managing test data, monitoring health, and accessing public APIs. All endpoints are designed to work seamlessly with the frontend application while also being accessible for external integrations.

**API Version**: 1.0.0  
**Base URL**: `http://localhost:3000/api` (development)  
**Production URL**: `https://your-domain.com/api`

---

## Base URL & Authentication

### Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

### Authentication

Currently, the API endpoints do not require authentication for basic operations. However, some endpoints that interact with Supabase will use Row-Level Security (RLS) policies based on user sessions.

**Future**: API key authentication may be added for external integrations.

---

## Endpoints

### POST /api/analyze

Analyzes an API response and returns humorous, contextual commentary with technical insights. Uses Grok AI when available, falls back to rule-based analysis.

#### Request

**Method**: `POST`  
**Content-Type**: `application/json`

**Request Body**:
```json
{
  "statusCode": 200,
  "responseTime": 145,
  "url": "https://api.github.com/users/octocat",
  "method": "GET",
  "responseBody": { "login": "octocat", "id": 1 }
}
```

**Required Fields**:
- `statusCode` (number): HTTP status code received
- `responseTime` (number): Response time in milliseconds
- `url` (string): The API endpoint that was tested
- `method` (string): HTTP method used (GET, POST, PUT, DELETE, PATCH)

**Optional Fields**:
- `responseBody` (any): The response body from the API

#### Response

**Success (200 OK)**:
```json
{
  "comment": "Smooth as butter! This API is having a great day. GitHub's servers must have had their morning coffee.",
  "emoji": "✅",
  "personality": "optimistic",
  "technicalNote": "Status 200: Success. Response time: 145ms",
  "statusCode": 200,
  "responseTime": 145,
  "timestamp": 1706198400000,
  "usingFallback": false,
  "aiModel": "grok-3"
}
```

**Response Fields**:
- `comment` (string): Humorous, contextual commentary about the API response
- `emoji` (string): Emoji representing the status/response quality
- `personality` (string): The platypus's mood/personality (`optimistic`, `sarcastic`, `dramatic`, `confused`)
- `technicalNote` (string): Technical insight or recommendation
- `statusCode` (number): Echo of the input status code
- `responseTime` (number): Echo of the input response time
- `timestamp` (number): Unix timestamp of analysis
- `usingFallback` (boolean): Whether fallback analysis was used
- `aiModel` (string, optional): AI model used (`grok-3` if Grok API key is configured)
- `reason` (string, optional): Reason for fallback if `usingFallback` is true

**Error (400 Bad Request)**:
```json
{
  "error": "Missing required fields: statusCode, responseTime, url, method"
}
```

**Error (500 Internal Server Error)**:
```json
{
  "error": "Analysis failed",
  "details": "Error message details"
}
```

#### Analysis Logic

The endpoint uses sophisticated logic to generate contextual feedback:

1. **AI Analysis (Primary)**: If `GROK_XAI_API_KEY` is configured, uses Grok AI for intelligent analysis
2. **Fallback Analysis**: Rule-based analysis based on:
   - Status code ranges (2xx, 3xx, 4xx, 5xx)
   - Response time thresholds (<100ms: fast, >3000ms: slow)
   - URL patterns (recognizes GitHub, Pokemon, NASA, etc.)
   - HTTP method context

**Personality Assignment**:
- `optimistic`: 2xx status codes
- `sarcastic`: 4xx status codes (client errors)
- `dramatic`: 5xx status codes (server errors)
- `confused`: 404 or unknown status codes

#### Examples

**Example 1: Successful API Call (200)**
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "statusCode": 200,
    "responseTime": 145,
    "url": "https://api.github.com/users/octocat",
    "method": "GET",
    "responseBody": {"login": "octocat", "id": 1}
  }'
```

**Example 2: Slow Response (200 but slow)**
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "statusCode": 200,
    "responseTime": 3500,
    "url": "https://api.example.com/slow",
    "method": "GET"
  }'
```

**Example 3: Not Found Error (404)**
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "statusCode": 404,
    "responseTime": 89,
    "url": "https://api.example.com/missing",
    "method": "GET"
  }'
```

**Example 4: Server Error (500)**
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "statusCode": 500,
    "responseTime": 234,
    "url": "https://api.example.com/broken",
    "method": "POST"
  }'
```

---

### GET /api/health

Health check endpoint for monitoring application status and database connectivity.

#### Request

**Method**: `GET`  
**No authentication required**

#### Response

**Healthy (200 OK) - With Supabase**:
```json
{
  "status": "healthy",
  "database": "connected",
  "databaseType": "supabase",
  "timestamp": "2025-01-25T10:30:00.000Z",
  "version": "1.0.0"
}
```

**Healthy (200 OK) - Without Supabase**:
```json
{
  "status": "healthy",
  "database": "not_configured",
  "databaseType": "local",
  "message": "Running without Supabase (using local storage or direct PostgreSQL)",
  "timestamp": "2025-01-25T10:30:00.000Z",
  "version": "1.0.0"
}
```

**Unhealthy (503 Service Unavailable)**:
```json
{
  "status": "unhealthy",
  "database": "disconnected",
  "error": "Connection timeout",
  "timestamp": "2025-01-25T10:30:00.000Z"
}
```

#### Use Cases

- **Load Balancer Health Checks**: Configure load balancers to check `/api/health`
- **Monitoring Systems**: Set up alerts based on health status
- **CI/CD Pipelines**: Verify deployment success
- **Docker Health Checks**: Use in Docker Compose health checks

#### Example

```bash
curl http://localhost:3000/api/health
```

---

### GET /api/stats

Retrieves application statistics including test suites, bugs, executions, and activity feed.

#### Request

**Method**: `GET`  
**Authentication**: Requires valid Supabase session (via RLS)

#### Response

**Success (200 OK)**:
```json
{
  "stats": {
    "totalSuites": 15,
    "totalBugs": 42,
    "totalExecutions": 128,
    "totalMocks": 8
  },
  "bugsBySeverity": {
    "critical": 2,
    "high": 8,
    "medium": 15,
    "low": 17
  },
  "recentActivity": [
    {
      "id": "act-123",
      "type": "test_execution",
      "user_id": "user-456",
      "description": "Suite 'API Tests' executed",
      "created_at": "2025-01-25T10:30:00.000Z"
    }
  ],
  "timestamp": "2025-01-25T10:30:00.000Z"
}
```

**Response Fields**:
- `stats.totalSuites` (number): Total number of test suites
- `stats.totalBugs` (number): Total number of bug reports
- `stats.totalExecutions` (number): Total test executions
- `stats.totalMocks` (number): Total mock endpoints
- `bugsBySeverity` (object): Breakdown of bugs by severity level
- `recentActivity` (array): Last 10 activity feed items
- `timestamp` (string): ISO timestamp of the response

#### Example

```bash
curl http://localhost:3000/api/stats \
  -H "Cookie: your-session-cookie"
```

---

### GET /api/public-apis

Returns a curated list of 50+ public APIs organized by category for testing purposes.

#### Request

**Method**: `GET`  
**No authentication required**

#### Response

**Success (200 OK)**:
```json
{
  "total": 50,
  "categories": [
    "Development",
    "Social",
    "Entertainment",
    "Animals",
    "Science",
    "Location",
    "Finance",
    "Text"
  ],
  "methods": {
    "GET": 45,
    "POST": 3,
    "PUT": 1,
    "DELETE": 1
  },
  "apis": [
    {
      "name": "GitHub - User Profile",
      "description": "Get GitHub user information",
      "url": "https://api.github.com/users/octocat",
      "method": "GET",
      "category": "Development",
      "requiresAuth": false,
      "documentation": "https://docs.github.com/en/rest"
    }
  ]
}
```

**Response Fields**:
- `total` (number): Total number of APIs
- `categories` (array): List of all categories
- `methods` (object): Count of APIs by HTTP method
- `apis` (array): Array of API objects with:
  - `name` (string): API name
  - `description` (string): Brief description
  - `url` (string): API endpoint URL
  - `method` (string): HTTP method
  - `category` (string): Category classification
  - `requiresAuth` (boolean): Whether authentication is needed
  - `documentation` (string, optional): Link to API documentation
  - `sampleBody` (string, optional): Sample request body for POST/PUT requests

#### Example

```bash
curl http://localhost:3000/api/public-apis
```

#### Categories

1. **Development**: JSONPlaceholder, HTTPBin, ReqRes
2. **Social**: GitHub, GitLab, Twitter (X)
3. **Entertainment**: Pokemon, Random User, Dad Jokes
4. **Animals**: Dog CEO, Cat Facts
5. **Science**: NASA APOD, Space APIs
6. **Location**: REST Countries, GeoNames
7. **Finance**: Exchange Rates, Bitcoin Price
8. **Text**: Lorem Ipsum, Quote APIs

---

### Mock API Endpoints

#### GET /api/mock/[...path]
#### POST /api/mock/[...path]
#### PUT /api/mock/[...path]
#### PATCH /api/mock/[...path]
#### DELETE /api/mock/[...path]

Dynamic mock API endpoint that serves configured mock responses. The path is captured dynamically and matched against active mocks in the database.

#### Request

**Method**: Any HTTP method (GET, POST, PUT, PATCH, DELETE)  
**Path**: `/api/mock/{your-path}` where `{your-path}` matches a configured mock

#### Response

**Success (200-599) - Mock Found**:
```json
{
  "data": {
    "id": 123,
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

**Response Headers**:
- `X-Mock-Server`: `Platypus-QA-Lab`
- `X-Mock-Name`: Name of the mock endpoint
- `X-Mock-Latency`: Configured latency in milliseconds

**Error (404 Not Found) - Mock Not Found**:
```json
{
  "error": "Mock not found",
  "message": "The platypus couldn't find an active mock for this endpoint",
  "path": "/users/123",
  "method": "GET"
}
```

#### Features

- **Dynamic Path Matching**: Any path can be mocked
- **Configurable Latency**: Simulate slow network responses
- **Custom Status Codes**: Return any HTTP status code (200, 404, 500, etc.)
- **Custom Response Bodies**: JSON responses defined in mock configuration
- **Active/Inactive Toggle**: Enable/disable mocks without deletion

#### Example

If you create a mock with:
- Path: `/users/123`
- Method: `GET`
- Status: `200`
- Response: `{"id": 123, "name": "Test User"}`

Then call:
```bash
curl http://localhost:3000/api/mock/users/123
```

Returns:
```json
{
  "id": 123,
  "name": "Test User"
}
```

---

### GET /api/cron/run-scheduled-tests

Cron job endpoint for executing scheduled test suites. Designed to be called by external cron services (e.g., Vercel Cron, GitHub Actions).

#### Request

**Method**: `GET`  
**Authentication**: Requires `CRON_SECRET` environment variable match

**Headers**:
```
Authorization: Bearer {CRON_SECRET}
```

#### Response

**Success (200 OK)**:
```json
{
  "success": true,
  "executions": [
    {
      "scheduleId": "sched-123",
      "suiteId": "suite-456",
      "status": "completed",
      "passed": 5,
      "failed": 1,
      "executionTime": 2340
    }
  ],
  "totalExecutions": 3,
  "timestamp": "2025-01-25T10:30:00.000Z"
}
```

**Error (401 Unauthorized)**:
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing CRON_SECRET"
}
```

#### Security

- Requires `CRON_SECRET` environment variable to be set
- Must match the `Authorization: Bearer {CRON_SECRET}` header
- Should only be called by trusted cron services

#### Setup

**Vercel Cron**:
```json
{
  "crons": [{
    "path": "/api/cron/run-scheduled-tests",
    "schedule": "*/5 * * * *"
  }]
}
```

**GitHub Actions**:
```yaml
- name: Run Scheduled Tests
  run: |
    curl -X GET https://your-domain.com/api/cron/run-scheduled-tests \
      -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

---

## Response Formats

### Success Response
All successful responses follow this structure:
```json
{
  "data": { ... },
  "timestamp": "ISO-8601-timestamp"
}
```

### Error Response
All error responses follow this structure:
```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": "Additional error details (optional)"
}
```

### HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful request |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Authentication required |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error occurred |
| 503 | Service Unavailable | Service temporarily unavailable |

---

## Error Handling

### Common Errors

**400 Bad Request - Missing Required Fields**:
```json
{
  "error": "Missing required fields: statusCode, responseTime, url, method"
}
```

**404 Not Found - Mock Not Found**:
```json
{
  "error": "Mock not found",
  "message": "The platypus couldn't find an active mock for this endpoint",
  "path": "/users/123",
  "method": "GET"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred",
  "details": "Error stack trace (development only)"
}
```

**503 Service Unavailable - Database Disconnected**:
```json
{
  "status": "unhealthy",
  "database": "disconnected",
  "error": "Connection timeout",
  "timestamp": "2025-01-25T10:30:00.000Z"
}
```

---

## Rate Limiting

Currently, there are **no rate limits** on API endpoints. However, it's recommended to:

- **Batch requests** when possible
- **Implement client-side caching** for repeated calls
- **Avoid excessive polling** (use webhooks or scheduled tests instead)
- **Respect response times** and implement appropriate timeouts

**Future**: Rate limiting may be implemented based on usage patterns.

---

## Best Practices

### 1. Always Include Required Fields
```javascript
// ✅ Good
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    statusCode: 200,
    responseTime: 145,
    url: 'https://api.example.com',
    method: 'GET'
  })
})

// ❌ Bad - Missing required fields
const response = await fetch('/api/analyze', {
  method: 'POST',
  body: JSON.stringify({ statusCode: 200 })
})
```

### 2. Handle Errors Gracefully
```javascript
try {
  const response = await fetch('/api/analyze', { ... })
  const data = await response.json()
  
  if (!response.ok) {
    console.error('API Error:', data.error)
    // Handle error appropriately
  }
} catch (error) {
  console.error('Network error:', error)
  // Handle network error
}
```

### 3. Cache Results When Appropriate
```javascript
// Cache analysis results for repeated API calls
const cacheKey = `analyze-${url}-${statusCode}`
const cached = localStorage.getItem(cacheKey)
if (cached) {
  return JSON.parse(cached)
}

const result = await fetch('/api/analyze', { ... })
localStorage.setItem(cacheKey, JSON.stringify(result))
```

### 4. Implement Timeouts
```javascript
const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), 10000) // 10s timeout

try {
  const response = await fetch('/api/analyze', {
    signal: controller.signal,
    ...
  })
  clearTimeout(timeout)
} catch (error) {
  if (error.name === 'AbortError') {
    console.error('Request timeout')
  }
}
```

### 5. Log Requests for Debugging
```javascript
console.log('[API] Request:', {
  endpoint: '/api/analyze',
  method: 'POST',
  body: requestBody,
  timestamp: new Date().toISOString()
})
```

---

## Examples

### Complete Integration Example

```typescript
// Example: Analyzing multiple API responses
async function analyzeAPIs(apiCalls: Array<{url: string, method: string}>) {
  const results = []
  
  for (const apiCall of apiCalls) {
    // 1. Make the API call
    const startTime = performance.now()
    const response = await fetch(apiCall.url, {
      method: apiCall.method
    })
    const responseTime = performance.now() - startTime
    const responseBody = await response.json()
    
    // 2. Get AI analysis
    const analysisResponse = await fetch('http://localhost:3000/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        statusCode: response.status,
        responseTime: Math.round(responseTime),
        url: apiCall.url,
        method: apiCall.method,
        responseBody
      })
    })
    
    const analysis = await analysisResponse.json()
    
    results.push({
      apiCall,
      response: {
        status: response.status,
        responseTime: Math.round(responseTime),
        body: responseBody
      },
      analysis
    })
  }
  
  return results
}

// Usage
const results = await analyzeAPIs([
  { url: 'https://api.github.com/users/octocat', method: 'GET' },
  { url: 'https://jsonplaceholder.typicode.com/posts/1', method: 'GET' }
])

console.log('Analysis Results:', results)
```

---

## Future Enhancements

Planned API improvements:

- **API Key Authentication**: For external integrations
- **Rate Limiting**: Per-IP and per-API-key limits
- **Webhooks**: Subscribe to test execution events
- **Batch Analysis**: Analyze multiple responses in one request
- **GraphQL Endpoint**: Alternative query interface
- **OpenAPI Specification**: Auto-generated OpenAPI 3.0 spec
- **API Versioning**: Support for multiple API versions

---

## Support & Resources

- **Documentation**: See `/docs` in the application
- **GitHub Issues**: Report bugs or request features
- **API Health**: Check `/api/health` for system status

---

**Last Updated**: January 2025  
**API Version**: 1.0.0  
**Status**: ✅ Production Ready

*The platypus guarantees this API will make you smile while you test. Probably.* 🦦
