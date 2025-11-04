# 🧪 Testing Guide - Platypus QA Lab

This document explains how to run the test suites for the Platypus QA Lab application.

## 📋 Prerequisites

Before running tests, ensure you have:

- **Node.js** 18+ installed
- **pnpm** installed (or use `npm install -g pnpm`)
- **Docker** and **Docker Compose** installed (for E2E tests)
- All dependencies installed: `pnpm install`

## 🎯 Test Suites

The project includes two main test suites:

1. **Unit Tests (Jest)** - Fast, isolated unit tests
2. **E2E Tests (Playwright)** - End-to-end browser tests

## 🚀 Quick Start

### Install Dependencies

```bash
# Install all npm packages
pnpm install

# Install Playwright browsers (required for E2E tests)
pnpm exec playwright install
```

### Run All Tests

```bash
# Run both unit and E2E tests
pnpm test
```

## 📦 Unit Tests (Jest)

Unit tests are located in the `__tests__` directory and test individual functions and components in isolation.

### Run Unit Tests

```bash
# Run all unit tests
pnpm run test:unit

# Run tests in watch mode (auto-rerun on file changes)
pnpm run test:watch

# Run tests with coverage
pnpm run test:unit -- --coverage
```

### Unit Test Structure

```
__tests__/
├── api/                    # API route tests
├── integration/            # Integration tests
├── lib/                    # Utility function tests
└── mocks/                  # Mock implementations
```

### Expected Results

- **Test Suites**: 15 passed
- **Tests**: 132 passed
- **Time**: ~26 seconds

### Writing Unit Tests

Unit tests use Jest with the following setup:

```typescript
import { test, expect } from "@jest/globals"

describe("Feature Name", () => {
  it("should do something", () => {
    expect(result).toBe(expected)
  })
})
```

## 🌐 E2E Tests (Playwright)

End-to-end tests simulate real user interactions in a browser environment. These tests require the application to be running.

### Prerequisites for E2E Tests

1. **Start the application** (using Docker Compose):

```bash
# Start all services (PostgreSQL, PostgREST, Next.js app)
docker-compose up -d

# Verify services are healthy
docker-compose ps
```

The E2E tests are configured to reuse the existing server at `http://localhost:3000`, so make sure:
- The app is running on port 3000
- PostgreSQL is running and accessible
- PostgREST is running on port 3001

### Run E2E Tests

```bash
# Run all E2E tests
pnpm run test:e2e

# Run tests in headed mode (see browser)
pnpm run test:ui:headed

# Run tests in debug mode
pnpm run test:ui:debug

# View test report
pnpm run test:report
```

### E2E Test Structure

```
e2e/
├── accessibility.spec.ts   # Accessibility tests
├── bugs.spec.ts            # Bug dashboard tests
├── mocks.spec.ts           # API mocking tests
├── navigation.spec.ts      # Navigation tests
├── playground.spec.ts      # API playground tests
└── suites.spec.ts          # Test suites tests
```

### Expected Results

- **Tests**: 27 passed
- **Time**: ~2-3 minutes

### E2E Test Configuration

The E2E tests are configured in `playwright.config.ts`:

- **Browser**: Chromium (Desktop Chrome)
- **Base URL**: `http://localhost:3000`
- **Timeout**: 60 seconds (global)
- **Action Timeout**: 15 seconds
- **Navigation Timeout**: 30 seconds

### Writing E2E Tests

```typescript
import { test, expect } from "@playwright/test"

test.describe("Feature Name", () => {
  test("should do something", async ({ page }) => {
    await page.goto("/path")
    await expect(page.locator("h1")).toContainText("Expected Text")
  })
})
```

## 🔧 Test Configuration

### Jest Configuration

Located in `jest.config.js`:
- Uses `ts-jest` for TypeScript support
- Includes setup file: `jest.setup.js`
- Tests files matching: `**/__tests__/**/*.test.ts`

### Playwright Configuration

Located in `playwright.config.ts`:
- Reuses existing server (Docker container)
- Takes screenshots on failure
- Generates HTML reports
- Traces on first retry

## 🐛 Troubleshooting

### Unit Tests Fail

1. **Clear Jest cache**:
   ```bash
   pnpm jest --clearCache
   ```

2. **Check for TypeScript errors**:
   ```bash
   pnpm run build
   ```

3. **Verify dependencies**:
   ```bash
   pnpm install
   ```

### E2E Tests Fail

1. **Verify Docker services are running**:
   ```bash
   docker-compose ps
   docker-compose logs app
   ```

2. **Check if port 3000 is available**:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # Linux/Mac
   lsof -i :3000
   ```

3. **Restart Docker services**:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

4. **Check Playwright browsers**:
   ```bash
   pnpm exec playwright install
   ```

5. **View test traces** (for debugging):
   ```bash
   pnpm exec playwright show-trace test-results/path-to-trace.zip
   ```

### Common Issues

#### "Port 3000 is already in use"

The E2E tests reuse the existing server. If you see this error:
- Make sure Docker Compose is running the app
- Or set `reuseExistingServer: true` in `playwright.config.ts` (already configured)

#### "Element not found" or Timeout Errors

- Increase timeouts in `playwright.config.ts`
- Check if the UI has changed (selectors may need updating)
- Verify the app is fully loaded before interacting

#### "Supabase not configured" Errors

- Ensure `.env` file has correct Supabase credentials
- For local development, PostgREST should be running
- Check `docker-compose.yml` environment variables

## 📊 Test Coverage

To generate coverage reports:

```bash
# Unit test coverage
pnpm run test:unit -- --coverage

# View coverage report
open coverage/lcov-report/index.html
```

## 🎯 Best Practices

1. **Write tests first** (TDD) when possible
2. **Keep tests isolated** - each test should be independent
3. **Use descriptive test names** - describe what the test verifies
4. **Mock external dependencies** - API calls, database, etc.
5. **Clean up after tests** - reset state, close dialogs, etc.
6. **Use appropriate timeouts** - don't make tests too slow or flaky

## 📝 Continuous Integration

The tests are configured to run in CI environments:

- Unit tests: Fast, run on every commit
- E2E tests: Slower, run on PRs and main branch

## 🔗 Related Documentation

- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## 📈 Test Statistics

### Current Status

- ✅ **Unit Tests**: 132 passing (15 test suites)
- ✅ **E2E Tests**: 27 passing
- ⏱️ **Unit Test Time**: ~26 seconds
- ⏱️ **E2E Test Time**: ~2-3 minutes

## 🆘 Need Help?

If you encounter issues:

1. Check the troubleshooting section above
2. Review test error messages and screenshots
3. Check Docker logs: `docker-compose logs`
4. Verify environment variables are set correctly
5. Ensure all dependencies are installed

---

**Happy Testing! 🦦✨**

