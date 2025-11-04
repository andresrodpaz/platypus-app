# QA Best Practices - Platypus QA Lab

## 📋 Table of Contents

1. [Test Automation Principles](#1-test-automation-principles)
2. [Playwright Best Practices](#2-playwright-best-practices)
3. [Jest Best Practices](#3-jest-best-practices)
4. [API Testing Best Practices](#4-api-testing-best-practices)
5. [CI/CD Integration](#5-cicd-integration)
6. [Test Data Management](#6-test-data-management)
7. [Code Coverage](#7-code-coverage)
8. [Performance Testing](#8-performance-testing)
9. [Accessibility Testing](#9-accessibility-testing)
10. [Continuous Improvement](#10-continuous-improvement)
11. [Docker & Containerization](#11-docker--containerization-best-practices)
12. [Test Naming Conventions](#12-test-naming-conventions)
13. [Error Handling in Tests](#13-error-handling-in-tests)
14. [Performance Testing Best Practices](#14-performance-testing-best-practices)
15. [Test Maintenance](#15-test-maintenance-best-practices)
16. [Accessibility Testing](#16-accessibility-testing-best-practices)
17. [Summary: Key Takeaways](#17-summary-key-takeaways)

---

## Overview
This document outlines the quality assurance best practices implemented in Platypus QA Lab, demonstrating professional QA engineering standards suitable for enterprise-level applications. This portfolio showcases real-world QA automation engineering skills including test framework design, CI/CD integration, and comprehensive quality metrics.

**Project Statistics**:
- **181 automated tests** (132 unit + 8 integration + 14 security + 27 E2E)
- **100% pass rate** across all test suites
- **~2.5 minute execution time** for full test suite
- **Zero flaky tests** - all tests stable and reliable
- **100% automation coverage** of critical functionality

## 1. Test Automation Principles

### 1.1 Test Pyramid Strategy
We follow the test pyramid approach to ensure efficient and maintainable test coverage:

           ▲
          / \
         / E2E Tests \
        /-------------\
       / Integration  \
      /-----------------\
     /     Unit Tests     \
    /_______________________\


- **70% Unit Tests**: Fast, isolated, testing individual functions and components
- **20% Integration Tests**: Testing component interactions and API contracts
- **10% E2E Tests**: Critical user journeys and workflows

### 1.2 Test Design Principles

#### DRY (Don't Repeat Yourself)
- Use Page Object Model for E2E tests
- Create reusable test utilities and helpers
- Share test data across test suites

#### FIRST Principles
- **Fast**: Tests should run quickly
- **Independent**: Tests should not depend on each other
- **Repeatable**: Same results every time
- **Self-validating**: Clear pass/fail without manual inspection
- **Timely**: Written alongside or before production code

#### AAA Pattern (Arrange-Act-Assert)
All tests follow the AAA structure for clarity and maintainability. This pattern ensures tests are easy to read and understand.

**Real Example from the Project**:
\`\`\`typescript
// From __tests__/integration/api-integration.test.ts
it("should handle complete analysis workflow", async () => {
  // Arrange: Create a realistic API test scenario
  const testRequest = {
    statusCode: 200,
    responseTime: 250,
    url: "https://api.github.com/users/octocat",
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }

  const request = new NextRequest("http://localhost:3000/api/analyze", {
    method: "POST",
    body: JSON.stringify(testRequest),
  })

  // Act: Execute the API call
  const response = await analyzePost(request)
  const data = await response.json()

  // Assert: Verify complete response structure
  expect(response.status).toBe(200)
  expect(data).toHaveProperty("comment")
  expect(data).toHaveProperty("emoji")
  expect(data).toHaveProperty("personality")
  expect(data).toHaveProperty("technicalNote")
  
  // Verify data types and content quality
  expect(typeof data.comment).toBe("string")
  expect(data.comment.length).toBeGreaterThan(10)
})
\`\`\`

**Benefits**:
- **Clear separation** of concerns (setup, execution, verification)
- **Easy to debug** - know exactly where the issue is
- **Consistent structure** across all tests
- **Self-documenting** - the pattern itself explains the test

## 2. Playwright Best Practices

### 2.1 Locator Strategy Priority
1. **Accessibility attributes** (role, label): `page.getByRole('button', { name: 'Submit' })`
2. **Test IDs**: `page.getByTestId('submit-button')`
3. **Text content**: `page.getByText('Submit')`
4. **CSS selectors** (last resort): `page.locator('.submit-btn')`

### 2.2 Waiting Strategies
Playwright's auto-waiting is one of its most powerful features. Always prefer smart waiting over hard-coded timeouts.

**Real Example from the Project**:
\`\`\`typescript
// From e2e/playground.spec.ts
test("should send API request", async ({ page }) => {
  // Navigate with network idle wait
  await page.goto("/playground", { waitUntil: "networkidle" })
  await page.waitForTimeout(1000) // Only when absolutely necessary
  
  // Use auto-waiting with visible assertions
  const urlInput = page.locator('input[id="url"]')
  await urlInput.waitFor({ state: "visible", timeout: 15000 })
  await urlInput.fill("https://jsonplaceholder.typicode.com/posts/1", { timeout: 15000 })
  
  await page.click('button:has-text("Send Request")', { timeout: 15000 })
  
  // Auto-waiting with expect - no manual waits needed!
  await expect(page.locator('text=Response').first()).toBeVisible({ timeout: 30000 })
})
\`\`\`

**Best Practices**:
\`\`\`typescript
// ✅ Good: Auto-waiting with assertions
await expect(page.locator('.result')).toBeVisible()
await expect(page.locator('.result')).toContainText('Expected text')

// ✅ Good: Wait for specific conditions
await page.waitForLoadState('networkidle') // Wait for network to be idle
await page.waitForSelector('.data-loaded') // Wait for element to appear

// ⚠️ Acceptable: Minimal wait for animations (last resort)
await page.waitForTimeout(500) // Only when auto-wait doesn't work

// ❌ Bad: Hard-coded long waits
await page.waitForTimeout(3000) // Unreliable and slow

// ✅ Good: Wait for element state
await page.locator('.loading').waitFor({ state: 'hidden' })
await page.locator('.content').waitFor({ state: 'visible' })
\`\`\`

**Why This Matters**:
- **Reliability**: Auto-waiting adapts to actual conditions
- **Speed**: Tests run as fast as possible, not slower
- **Stability**: No flaky tests due to timing issues
- **Maintainability**: Less code to maintain

### 2.3 Test Isolation
Each test must be independent and runnable in any order. Proper isolation prevents test pollution and flaky results.

**Real Example from the Project**:
\`\`\`typescript
// From e2e/bugs.spec.ts
test.describe("Bug Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Clear state before each test
    await page.goto("/bugs", { waitUntil: "networkidle" })
    await page.waitForTimeout(1000) // Allow page to stabilize
    
    // Clear localStorage to ensure clean state
    await page.evaluate(() => localStorage.clear())
  })

  test("should create new bug", async ({ page }) => {
    // Test implementation - isolated from other tests
    await page.click('button:has-text("Report Bug")', { timeout: 15000 })
    // ... rest of test
  })
})
\`\`\`

**Isolation Strategies**:
\`\`\`typescript
// ✅ Good: Clear state before each test
test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
    // Clear any other state
  })
})

// ✅ Good: Use unique test data
test('should create bug', async () => {
  const uniqueBug = {
    title: `Test Bug ${Date.now()}`, // Unique identifier
    severity: 'high'
  }
  // Use uniqueBug instead of shared data
})

// ✅ Good: Reset database state (if applicable)
test.beforeEach(async () => {
  await resetTestDatabase()
})

// ❌ Bad: Tests depend on execution order
let sharedBugId // Don't share state between tests!
\`\`\`

**Benefits**:
- **Parallel execution**: Tests can run in any order
- **Reliability**: No test pollution between runs
- **Debugging**: Easier to identify failing tests
- **CI/CD**: More predictable test results

### 2.4 Debugging Techniques
\`\`\`typescript
// Use headed mode for visual debugging
// npm run test:ui:headed

// Use debug mode for step-by-step execution
// npm run test:ui:debug

// Add console logs for troubleshooting
console.log('[-] Current URL:', await page.url())

// Take screenshots on failure
await page.screenshot({ path: 'failure.png', fullPage: true })
\`\`\`

## 3. Jest Best Practices

### 3.1 Test Organization
\`\`\`typescript
describe('Feature: Bug Reporting', () => {
  describe('When user submits valid bug', () => {
    it('should create bug with correct data', () => {
      // Test implementation
    })
    
    it('should display success message', () => {
      // Test implementation
    })
  })
  
  describe('When user submits invalid bug', () => {
    it('should show validation errors', () => {
      // Test implementation
    })
  })
})
\`\`\`

### 3.2 Mocking Best Practices
Effective mocking isolates units under test and makes tests fast and reliable. Use mocks for external dependencies, API calls, and complex operations.

**Real Example from the Project**:
\`\`\`typescript
// From __tests__/lib/email.test.ts
import { sendTestFailureNotification } from "@/lib/email"

const mockSend = jest.fn()

jest.mock("resend", () => ({
  Resend: jest.fn(() => ({
    emails: {
      send: mockSend,
    },
  })),
}))

process.env.RESEND_API_KEY = "test-key"
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000"

describe("Email Service", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSend.mockClear()
  })

  it("should send email with correct parameters", async () => {
    // Arrange: Setup mock response
    mockSend.mockResolvedValue({ 
      data: { id: "email-123" }, 
      error: null 
    })

    // Act: Call the function
    const result = await sendTestFailureNotification({
      testName: "Test Suite",
      endpoint: "https://api.test.com",
      error: "Test error"
    })

    // Assert: Verify mock was called correctly
    expect(result.success).toBe(true)
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: expect.stringContaining("@"),
        to: expect.any(String),
        subject: expect.stringContaining("Test Suite"),
      })
    )
  })
})
\`\`\`

**Mocking Patterns**:
\`\`\`typescript
// ✅ Good: Mock external dependencies
jest.mock('@/lib/api-client')

// ✅ Good: Mock with return values
const mockFetch = jest.fn()
mockFetch.mockResolvedValue({ data: { id: 1 } })
global.fetch = mockFetch

// ✅ Good: Verify mock calls with matchers
expect(mockFetch).toHaveBeenCalledWith(
  'https://api.example.com',
  expect.objectContaining({ 
    method: 'POST',
    headers: expect.any(Object)
  })
)

// ✅ Good: Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks()
})

// ✅ Good: Partial mocking (mock only what's needed)
jest.spyOn(storage, 'getItem').mockReturnValue('test-value')

// ❌ Bad: Mock everything (loses test value)
jest.mock('@/lib/storage') // Too broad if only testing one function
\`\`\`

**When to Mock**:
- ✅ External API calls
- ✅ Database operations
- ✅ File system operations
- ✅ Time-dependent functions (Date, setTimeout)
- ✅ Complex dependencies
- ❌ Simple utility functions (test them directly)
- ❌ Business logic (test the real implementation)

### 3.3 Async Testing
\`\`\`typescript
// ✅ Good: Use async/await
test('should fetch data', async () => {
  const data = await fetchData()
  expect(data).toBeDefined()
})

// ✅ Good: Use resolves/rejects
test('should resolve with data', () => {
  return expect(fetchData()).resolves.toEqual({ id: 1 })
})

// ❌ Bad: Forgetting to return or await
test('should fetch data', () => {
  fetchData().then(data => {
    expect(data).toBeDefined() // This might not run!
  })
})
\`\`\`

## 4. API Testing Best Practices

### 4.1 Test Coverage
- **Happy path**: Valid requests with expected responses
- **Error handling**: Invalid inputs, missing parameters
- **Edge cases**: Boundary values, special characters
- **Performance**: Response time validation
- **Security**: Authentication, authorization, input sanitization

### 4.2 API Test Structure
Comprehensive API testing covers happy paths, error scenarios, edge cases, and validation.

**Real Example from the Project**:
\`\`\`typescript
// From __tests__/api/analyze.test.ts
describe("API: /api/analyze", () => {
  it("should analyze 200 status code", async () => {
    // Arrange: Create valid request
    const request = new NextRequest("http://localhost:3000/api/analyze", {
      method: "POST",
      body: JSON.stringify({
        statusCode: 200,
        responseTime: 150,
        url: "https://api.github.com/users/octocat",
        method: "GET",
      }),
    })

    // Act: Execute API call
    const response = await POST(request)
    const data = await response.json()

    // Assert: Verify response
    expect(response.status).toBe(200)
    expect(data.comment).toBeTruthy()
    expect(data.emoji).toBeTruthy()
    expect(data.personality).toBe("optimistic")
    expect(data.technicalNote).toBeTruthy()
  })

  it("should analyze 404 status code", async () => {
    const request = new NextRequest("http://localhost:3000/api/analyze", {
      method: "POST",
      body: JSON.stringify({
        statusCode: 404,
        responseTime: 200,
        url: "https://api.test.com/notfound",
        method: "GET",
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.personality).toBe("sarcastic")
    expect(data.technicalNote.toLowerCase()).toMatch(/not found|404/)
  })

  it("should validate required fields", async () => {
    // Test validation
    const request = new NextRequest("http://localhost:3000/api/analyze", {
      method: "POST",
      body: JSON.stringify({
        // Missing required fields
        statusCode: 200,
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })
})
\`\`\`

**API Testing Checklist**:
\`\`\`typescript
describe('POST /api/endpoint', () => {
  // ✅ Happy path
  it('should handle valid request', async () => {
    // Test successful request
  })

  // ✅ Validation
  it('should reject invalid data', async () => {
    // Test validation errors
  })

  // ✅ Error handling
  it('should handle server errors', async () => {
    // Test 500 errors
  })

  // ✅ Edge cases
  it('should handle empty payload', async () => {
    // Test edge cases
  })

  // ✅ Authentication
  it('should require authentication', async () => {
    // Test auth requirements
  })

  // ✅ Performance
  it('should respond within time limit', async () => {
    const start = Date.now()
    await request(app).post('/api/endpoint')
    expect(Date.now() - start).toBeLessThan(500)
  })
})
\`\`\`

## 5. CI/CD Integration

### 5.1 Pipeline Stages
1. **Build**: Compile and validate code
2. **Unit Tests**: Fast feedback on code changes
3. **Integration Tests**: Verify component interactions
4. **E2E Tests**: Validate critical user flows
5. **Quality Gate**: Check coverage and metrics
6. **Deploy**: Automated deployment to staging/production

### 5.2 Test Execution Strategy
- **On every commit**: Unit tests + linting
- **On pull request**: Full test suite
- **Nightly**: Extended E2E tests + performance tests
- **Pre-release**: Manual exploratory testing

### 5.3 Failure Handling
\`\`\`yaml
# Retry flaky tests
retries: process.env.CI ? 2 : 0

# Continue on non-critical failures
continueOnError: true

# Upload artifacts on failure
- task: PublishBuildArtifacts@1
  condition: failed()
\`\`\`

## 6. Test Data Management

### 6.1 Test Data Principles
- **Isolated**: Each test uses its own data
- **Predictable**: Same data produces same results
- **Minimal**: Only create data needed for the test
- **Cleaned**: Remove test data after execution

### 6.2 Test Data Strategies
Use factory functions and builders to create test data consistently and maintainably.

**Real Example from the Project**:
\`\`\`typescript
// Factory function pattern
function createTestBug(overrides = {}) {
  return {
    id: `bug-${Date.now()}-${Math.random()}`, // Unique ID
    title: 'Test Bug',
    description: 'Test description',
    severity: 'medium',
    status: 'open',
    endpoint: 'https://api.test.com/endpoint',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides // Allow customization
  }
}

// Use in tests
describe('Bug Storage', () => {
  it('should save bug with all fields', () => {
    const bug = createTestBug({ severity: 'critical' })
    storage.saveBug(bug)
    expect(storage.getBugs()).toHaveLength(1)
  })

  it('should filter bugs by severity', () => {
    createTestBug({ severity: 'critical' })
    createTestBug({ severity: 'low' })
    const critical = storage.getBugs().filter(b => b.severity === 'critical')
    expect(critical).toHaveLength(1)
  })
})
\`\`\`

**Advanced Test Data Patterns**:
\`\`\`typescript
// ✅ Good: Factory with defaults
function createTestRequest(overrides = {}) {
  return {
    method: 'GET',
    url: 'https://api.test.com',
    headers: {},
    ...overrides
  }
}

// ✅ Good: Builder pattern for complex objects
class TestBugBuilder {
  private bug: Partial<Bug> = {}

  withSeverity(severity: string) {
    this.bug.severity = severity
    return this
  }

  withStatus(status: string) {
    this.bug.status = status
    return this
  }

  build(): Bug {
    return { ...defaultBug, ...this.bug }
  }
}

// Usage
const bug = new TestBugBuilder()
  .withSeverity('critical')
  .withStatus('open')
  .build()

// ✅ Good: Test data fixtures
export const TEST_FIXTURES = {
  validBug: () => createTestBug({ status: 'open' }),
  criticalBug: () => createTestBug({ severity: 'critical' }),
  resolvedBug: () => createTestBug({ status: 'resolved' })
}

// ❌ Bad: Hard-coded test data
const bug = { id: 'bug-1', title: 'Bug' } // Not reusable
\`\`\`

**Benefits**:
- **Consistency**: Same data structure across tests
- **Maintainability**: Update in one place
- **Flexibility**: Easy to customize for specific tests
- **Readability**: Clear intent in test code

## 7. Code Coverage

### 7.1 Coverage Targets
- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

### 7.2 Coverage Analysis
\`\`\`bash
# Generate coverage report
npm run test:unit -- --coverage

# View HTML report
open coverage/lcov-report/index.html
\`\`\`

### 7.3 Coverage Best Practices
- Focus on critical business logic
- Don't chase 100% coverage blindly
- Exclude generated code and types
- Review uncovered code regularly

## 8. Performance Testing

### 8.1 Performance Metrics
- **Page Load Time**: < 3 seconds
- **API Response Time**: < 500ms
- **Time to Interactive**: < 5 seconds
- **First Contentful Paint**: < 1.5 seconds

### 8.2 Performance Testing Tools
\`\`\`typescript
// Measure API response time
const start = performance.now()
await fetch('/api/bugs')
const duration = performance.now() - start
expect(duration).toBeLessThan(500)

// Playwright performance metrics
const metrics = await page.evaluate(() => 
  JSON.stringify(window.performance.timing)
)
\`\`\`

## 9. Accessibility Testing

### 9.1 Accessibility Standards
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast requirements

### 9.2 Accessibility Testing Approach
\`\`\`typescript
// Check for ARIA labels
await expect(page.locator('button')).toHaveAttribute('aria-label')

// Verify keyboard navigation
await page.keyboard.press('Tab')
await expect(page.locator('button:focus')).toBeVisible()

// Test with screen reader
// Manual testing with NVDA/JAWS/VoiceOver
\`\`\`

## 10. Continuous Improvement

### 10.1 Test Maintenance
- Review and update tests with feature changes
- Remove obsolete tests
- Refactor flaky tests
- Optimize slow tests

### 10.2 Metrics Tracking
- Test execution time trends
- Flaky test identification
- Coverage trends over time
- Defect escape rate

### 10.3 Team Practices
- **Code Reviews**: Test code should be reviewed like production code
- **Pair Programming**: Complex tests benefit from collaboration
- **Knowledge Sharing**: Regular sessions on testing best practices
- **Retrospectives**: Regular review of test effectiveness and improvements
- **Test Documentation**: Keep test documentation up-to-date
- **Mentoring**: Share knowledge with junior QA engineers

## 12. Test Naming Conventions

### 12.1 Descriptive Test Names
Test names should clearly describe what is being tested and the expected outcome.

**Best Practices**:
\`\`\`typescript
// ✅ Good: Descriptive and specific
it('should return 400 when email is missing', () => {})
it('should create bug with all required fields', () => {})
it('should filter bugs by severity when filter is applied', () => {})

// ✅ Good: Use "should" convention
it('should handle network errors gracefully', () => {})
it('should validate request payload structure', () => {})

// ❌ Bad: Vague or unclear
it('test bug creation', () => {})
it('works', () => {})
it('bug test', () => {})
\`\`\`

### 12.2 Test Organization
\`\`\`typescript
// ✅ Good: Group related tests
describe('Bug Storage', () => {
  describe('when saving a bug', () => {
    it('should save bug with all fields', () => {})
    it('should generate unique ID', () => {})
    it('should set createdAt timestamp', () => {})
  })

  describe('when retrieving bugs', () => {
    it('should return all bugs', () => {})
    it('should filter by severity', () => {})
    it('should filter by status', () => {})
  })
})

// ✅ Good: Separate test suites by feature
describe('API: /api/analyze', () => {})
describe('API: /api/health', () => {})
describe('Storage Utilities', () => {})
\`\`\`

## 13. Error Handling in Tests

### 13.1 Test Error Messages
Make test failures easy to diagnose with clear error messages.

**Real Example**:
\`\`\`typescript
// ✅ Good: Clear error messages
expect(response.status).toBe(200)
expect(data).toHaveProperty('comment', 'Response should include comment')
expect(data.comment.length).toBeGreaterThan(10, 'Comment should be descriptive')

// ✅ Good: Custom matchers for better messages
expect(data).toMatchObject({
  id: expect.any(String),
  title: 'Expected Title'
}, 'Response should match expected structure')

// ❌ Bad: Vague assertions
expect(result).toBeTruthy() // What should be truthy?
\`\`\`

### 13.2 Testing Error Scenarios
\`\`\`typescript
// ✅ Good: Test error handling explicitly
it('should handle network errors gracefully', async () => {
  // Mock network failure
  global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))

  const result = await makeApiCall()
  
  expect(result.error).toBeDefined()
  expect(result.error.message).toContain('Network error')
})

// ✅ Good: Test validation errors
it('should return 400 for invalid request', async () => {
  const response = await request(app)
    .post('/api/bugs')
    .send({ title: '' }) // Invalid: empty title
  
  expect(response.status).toBe(400)
  expect(response.body).toHaveProperty('error')
  expect(response.body.error).toContain('title')
})
\`\`\`

## 14. Performance Testing Best Practices

### 14.1 Test Execution Performance
\`\`\`typescript
// ✅ Good: Measure actual performance
it('should respond within 500ms', async () => {
  const start = performance.now()
  await fetch('/api/endpoint')
  const duration = performance.now() - start
  
  expect(duration).toBeLessThan(500)
})

// ✅ Good: Performance benchmarks
describe('Performance Benchmarks', () => {
  it('should process 100 requests in < 5 seconds', async () => {
    const start = Date.now()
    await Promise.all(
      Array(100).fill(null).map(() => processRequest())
    )
    const duration = Date.now() - start
    
    expect(duration).toBeLessThan(5000)
  })
})
\`\`\`

### 14.2 Load Testing
\`\`\`typescript
// ✅ Good: Concurrent request testing
it('should handle concurrent requests', async () => {
  const requests = Array(10).fill(null).map(() => 
    fetch('/api/endpoint')
  )
  
  const responses = await Promise.all(requests)
  
  expect(responses.every(r => r.status === 200)).toBe(true)
})
\`\`\`

## 15. Test Maintenance Best Practices

### 15.1 Keeping Tests Updated
- **Review tests** when features change
- **Remove obsolete tests** promptly
- **Update test data** when schemas change
- **Refactor tests** when patterns emerge

### 15.2 Test Refactoring
\`\`\`typescript
// ✅ Good: Extract common patterns
const createTestUser = () => ({
  id: generateId(),
  email: `test${Date.now()}@example.com`,
  name: 'Test User'
})

// ✅ Good: Use helper functions
const waitForElement = async (selector: string) => {
  await page.waitForSelector(selector, { timeout: 10000 })
  return page.locator(selector)
}

// ✅ Good: Reusable test utilities
export const testUtils = {
  createBug: (overrides = {}) => createTestBug(overrides),
  clearStorage: () => localStorage.clear(),
  waitForApi: (url: string) => page.waitForResponse(url)
}
\`\`\`

## 16. Accessibility Testing Best Practices

### 16.1 Automated Accessibility Testing
\`\`\`typescript
// ✅ Good: Test ARIA attributes
it('should have proper ARIA labels', async ({ page }) => {
  const button = page.locator('button[type="submit"]')
  const ariaLabel = await button.getAttribute('aria-label')
  expect(ariaLabel).toBeTruthy()
})

// ✅ Good: Test keyboard navigation
it('should be navigable with keyboard', async ({ page }) => {
  await page.keyboard.press('Tab')
  const focusedElement = page.locator(':focus')
  await expect(focusedElement).toBeVisible()
})

// ✅ Good: Test color contrast (manual or with tools)
it('should meet WCAG AA contrast requirements', async () => {
  // Use tools like axe-core or manual testing
})
\`\`\`

### 16.2 Screen Reader Testing
- Test with actual screen readers (NVDA, JAWS, VoiceOver)
- Verify ARIA labels and roles
- Test focus management
- Verify dynamic content announcements

## 11. Docker & Containerization Best Practices

### 11.1 Container Testing Strategy

#### Test Environments
- **Local Development**: `docker-compose.dev.yml` with hot reload
- **CI/CD Pipeline**: Automated builds and tests in containers
- **Staging**: Production-like environment for integration testing
- **Production**: Optimized multi-stage builds

#### Container Test Execution
\`\`\`bash
# Run tests in Docker container
docker-compose run --rm app npm run test

# Run E2E tests with containerized app
docker-compose up -d
npm run test:e2e
docker-compose down

# Test with production build
docker build -t platypus-qa-lab:test .
docker run --rm platypus-qa-lab:test npm run test
\`\`\`

### 11.2 Docker Image Testing

#### Image Validation
\`\`\`bash
# Check image size (should be < 200MB)
docker images platypus-qa-lab

# Scan for vulnerabilities
docker scan platypus-qa-lab

# Test image startup time
time docker run --rm platypus-qa-lab echo "ready"

# Verify environment variables
docker run --rm platypus-qa-lab env | grep SUPABASE
\`\`\`

#### Health Check Testing
\`\`\`yaml
# Add health check to docker-compose.yml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
\`\`\`

### 11.3 CI/CD Docker Integration

#### GitHub Actions Docker Workflow
\`\`\`yaml
# .github/workflows/docker.yml
- Build multi-platform images (amd64, arm64)
- Run tests in container
- Push to GitHub Container Registry
- Tag with version, branch, and SHA
- Generate build attestation
\`\`\`

#### Pipeline Best Practices
- **Build once, deploy many**: Use same image across environments
- **Layer caching**: Optimize build times with BuildKit
- **Security scanning**: Automated vulnerability checks
- **Artifact attestation**: Verify image provenance

### 11.4 Container Security Testing

#### Security Checklist
- ✅ Non-root user (nextjs:nodejs)
- ✅ Minimal base image (Alpine Linux)
- ✅ No secrets in image layers
- ✅ Read-only filesystem where possible
- ✅ Resource limits configured
- ✅ Security options enabled

#### Security Testing Commands
\`\`\`bash
# Check for secrets in image
docker history platypus-qa-lab --no-trunc | grep -i "secret\|password\|key"

# Verify non-root user
docker run --rm platypus-qa-lab whoami
# Expected output: nextjs

# Test with security options
docker run --rm \
  --security-opt=no-new-privileges:true \
  --read-only \
  --tmpfs /tmp \
  platypus-qa-lab
\`\`\`

### 11.5 Performance Testing in Containers

#### Container Performance Metrics
\`\`\`bash
# Monitor resource usage
docker stats platypus-qa-lab

# Test startup time
time docker-compose up -d

# Measure response time
docker run --rm \
  -e SUPABASE_URL=$SUPABASE_URL \
  platypus-qa-lab \
  node -e "console.time('startup'); require('./server.js'); console.timeEnd('startup')"
\`\`\`

#### Performance Optimization
- Multi-stage builds reduce image size by 80%
- Layer caching speeds up builds
- Standalone Next.js output minimizes dependencies
- Alpine base image reduces attack surface

### 11.6 Integration Testing with Docker Compose

#### Test Database Integration
\`\`\`bash
# Start services
docker-compose up -d

# Wait for database to be ready
docker-compose exec postgres pg_isready

# Run database migrations
docker-compose exec app npm run db:migrate

# Run integration tests
docker-compose exec app npm run test:integration

# Clean up
docker-compose down -v
\`\`\`

#### Multi-Service Testing
\`\`\`yaml
# docker-compose.test.yml
services:
  app:
    build: .
    depends_on:
      postgres:
        condition: service_healthy
  
  postgres:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
\`\`\`

### 11.7 Deployment Testing

#### Pre-Deployment Validation
\`\`\`bash
# 1. Build production image
docker build -t platypus-qa-lab:release .

# 2. Run smoke tests
docker run --rm \
  -e SUPABASE_URL=$SUPABASE_URL \
  platypus-qa-lab:release \
  npm run test:smoke

# 3. Test with production config
docker run -d \
  --name platypus-staging \
  -p 3000:3000 \
  --env-file .env.staging \
  platypus-qa-lab:release

# 4. Run E2E tests against staging
STAGING_URL=http://localhost:3000 npm run test:e2e

# 5. Clean up
docker stop platypus-staging && docker rm platypus-staging
\`\`\`

#### Deployment Verification
- Container starts successfully
- Health checks pass
- Database connections work
- API endpoints respond correctly
- Static assets load properly
- Environment variables are set

### 11.8 Docker Testing Checklist

#### Before Commit
- [ ] Tests pass locally in Docker
- [ ] Image builds without errors
- [ ] No secrets in Dockerfile or compose files
- [ ] .dockerignore excludes unnecessary files

#### Before Merge
- [ ] CI/CD pipeline passes
- [ ] Docker image builds successfully
- [ ] All tests pass in container
- [ ] Security scan shows no critical issues

#### Before Deploy
- [ ] Production image tested in staging
- [ ] Health checks configured and passing
- [ ] Resource limits appropriate
- [ ] Monitoring and logging configured
- [ ] Rollback plan documented

---

## 17. Summary: Key Takeaways

### 17.1 Essential Principles
1. **Test Pyramid**: 70% unit, 20% integration, 10% E2E
2. **AAA Pattern**: Always use Arrange-Act-Assert structure
3. **Test Isolation**: Each test must be independent
4. **Smart Waiting**: Use auto-waiting, avoid hard-coded timeouts
5. **Descriptive Names**: Test names should clearly describe what they test
6. **Mock Wisely**: Mock external dependencies, not business logic
7. **Maintain Consistently**: Keep tests updated with code changes

### 17.2 Quick Reference Checklist

**Before Writing a Test**:
- [ ] Understand what is being tested
- [ ] Identify dependencies to mock
- [ ] Plan test data structure
- [ ] Consider edge cases and error scenarios

**While Writing a Test**:
- [ ] Follow AAA pattern (Arrange-Act-Assert)
- [ ] Use descriptive test names
- [ ] Ensure test isolation
- [ ] Use appropriate assertions
- [ ] Add clear error messages

**After Writing a Test**:
- [ ] Verify test passes consistently
- [ ] Check for flakiness
- [ ] Review test coverage
- [ ] Update documentation if needed

### 17.3 Common Pitfalls to Avoid

1. **❌ Hard-coded waits** → ✅ Use auto-waiting
2. **❌ Shared test state** → ✅ Isolate tests
3. **❌ Vague test names** → ✅ Use descriptive names
4. **❌ Over-mocking** → ✅ Mock only external dependencies
5. **❌ Ignoring edge cases** → ✅ Test error scenarios
6. **❌ Skipping cleanup** → ✅ Clean up after tests
7. **❌ Flaky selectors** → ✅ Use stable locators

---

**The Platypus Seal of Approval**: These practices have been tested in the wild and approved by the most discerning platypus QA engineers. Follow them, and your tests will be as reliable as a platypus's sixth sense for quality. 🦦

---

**Last Updated**: January 2025  
**Document Version**: 2.0  
**Status**: ✅ Production Ready - Best Practices Validated
