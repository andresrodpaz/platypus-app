# QA Best Practices - Platypus QA Lab

## Overview
This document outlines the quality assurance best practices implemented in Platypus QA Lab, demonstrating professional QA engineering standards suitable for enterprise-level applications.

## 1. Test Automation Principles

### 1.1 Test Pyramid Strategy
We follow the test pyramid approach to ensure efficient and maintainable test coverage:

\`\`\`
           /\
          /  \
         / E2E \
        /--------\
       /          \
      / Integration \
     /--------------\
    /                \
   /   Unit Tests     \
  /____________________\
\`\`\`

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

#### AAA Pattern
All tests follow Arrange-Act-Assert structure:
\`\`\`typescript
test('should create a bug report', async () => {
  // Arrange: Set up test data and preconditions
  const bugData = { title: 'Test Bug', severity: 'high' }
  
  // Act: Perform the action being tested
  await createBug(bugData)
  
  // Assert: Verify the expected outcome
  expect(getBugCount()).toBe(1)
})
\`\`\`

## 2. Playwright Best Practices

### 2.1 Locator Strategy Priority
1. **Accessibility attributes** (role, label): `page.getByRole('button', { name: 'Submit' })`
2. **Test IDs**: `page.getByTestId('submit-button')`
3. **Text content**: `page.getByText('Submit')`
4. **CSS selectors** (last resort): `page.locator('.submit-btn')`

### 2.2 Waiting Strategies
\`\`\`typescript
// ✅ Good: Auto-waiting with assertions
await expect(page.locator('.result')).toBeVisible()

// ❌ Bad: Hard-coded waits
await page.waitForTimeout(3000)

// ✅ Good: Wait for specific conditions
await page.waitForLoadState('networkidle')
await page.waitForSelector('.data-loaded')
\`\`\`

### 2.3 Test Isolation
\`\`\`typescript
test.beforeEach(async ({ page }) => {
  // Clear state before each test
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
})

test.afterEach(async ({ page }) => {
  // Clean up after test
  await page.close()
})
\`\`\`

### 2.4 Debugging Techniques
\`\`\`typescript
// Use headed mode for visual debugging
// npm run test:ui:headed

// Use debug mode for step-by-step execution
// npm run test:ui:debug

// Add console logs for troubleshooting
console.log('[v0] Current URL:', await page.url())

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
\`\`\`typescript
// Mock external dependencies
jest.mock('@/lib/api-client')

// Use jest.fn() for function mocks
const mockFetch = jest.fn()
global.fetch = mockFetch

// Verify mock calls
expect(mockFetch).toHaveBeenCalledWith(
  'https://api.example.com',
  expect.objectContaining({ method: 'POST' })
)
\`\`\`

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
\`\`\`typescript
describe('POST /api/bugs', () => {
  it('should create bug with valid data', async () => {
    const response = await request(app)
      .post('/api/bugs')
      .send({ title: 'Bug', severity: 'high' })
      .expect(201)
    
    expect(response.body).toMatchObject({
      id: expect.any(String),
      title: 'Bug',
      severity: 'high'
    })
  })
  
  it('should return 400 for invalid data', async () => {
    await request(app)
      .post('/api/bugs')
      .send({ title: '' })
      .expect(400)
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
\`\`\`typescript
// Factory functions for test data
function createTestBug(overrides = {}) {
  return {
    id: generateId(),
    title: 'Test Bug',
    severity: 'medium',
    status: 'open',
    createdAt: new Date().toISOString(),
    ...overrides
  }
}

// Use in tests
const criticalBug = createTestBug({ severity: 'critical' })
\`\`\`

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
- Code reviews for test code
- Pair programming on complex tests
- Knowledge sharing sessions
- Retrospectives on test effectiveness

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

**The Platypus Seal of Approval**: These practices have been tested in the wild and approved by the most discerning platypus QA engineers. Follow them, and your tests will be as reliable as a platypus's sixth sense for quality.
