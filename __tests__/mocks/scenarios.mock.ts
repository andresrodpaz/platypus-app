/**
 * Complex Testing Scenarios
 * Multi-step flows and edge cases
 */

export const TEST_SCENARIOS = {
  // Complete User Journey
  userJourney: {
    name: "Complete User Journey",
    steps: [
      {
        name: "User Registration",
        request: {
          method: "POST",
          url: "https://api.example.com/auth/register",
          body: { email: "newuser@test.com", password: "Pass123!", name: "New User" },
        },
        expectedStatus: 201,
        captures: { userId: "data.user.id", token: "data.access_token" },
      },
      {
        name: "Email Verification",
        request: {
          method: "POST",
          url: "https://api.example.com/auth/verify-email",
          body: { code: "123456" },
          headers: { Authorization: "Bearer ${token}" },
        },
        expectedStatus: 200,
      },
      {
        name: "Complete Profile",
        request: {
          method: "PUT",
          url: "https://api.example.com/users/${userId}",
          body: { avatar: "https://...", bio: "Test user" },
          headers: { Authorization: "Bearer ${token}" },
        },
        expectedStatus: 200,
      },
      {
        name: "Follow Recommendations",
        request: {
          method: "POST",
          url: "https://api.example.com/users/follow",
          body: { followUserId: 5 },
          headers: { Authorization: "Bearer ${token}" },
        },
        expectedStatus: 201,
      },
    ],
  },

  // Pagination Scenario
  paginationScenario: {
    name: "Paginated Data Retrieval",
    steps: [
      {
        name: "Get First Page",
        request: { method: "GET", url: "https://api.example.com/items?page=1&limit=10" },
        expectedStatus: 200,
        captures: { totalPages: "data.pagination.total_pages" },
      },
      {
        name: "Get All Pages",
        request: { method: "GET", url: "https://api.example.com/items?page=${pageNum}&limit=10" },
        loop: { variable: "pageNum", from: 2, to: "${totalPages}" },
        expectedStatus: 200,
      },
    ],
  },

  // Error Recovery Scenario
  errorRecovery: {
    name: "Error Recovery & Retry",
    steps: [
      {
        name: "Request with Retry",
        request: { method: "GET", url: "https://api.example.com/unstable" },
        retry: { maxAttempts: 3, backoff: "exponential", delay: 1000 },
        expectedStatus: 200,
      },
    ],
  },

  // Concurrent Requests
  concurrentRequests: {
    name: "Concurrent Request Handling",
    parallel: [
      { request: { method: "GET", url: "https://api.example.com/users" }, expectedStatus: 200 },
      { request: { method: "GET", url: "https://api.example.com/posts" }, expectedStatus: 200 },
      { request: { method: "GET", url: "https://api.example.com/comments" }, expectedStatus: 200 },
    ],
  },
}

export const PERFORMANCE_SCENARIOS = {
  // Slow Response Simulation
  slowResponse: {
    delay: 5000, // 5 second delay
    response: { status: 200, body: { data: "slow" } },
  },

  // Degraded Performance
  degradedPerformance: {
    responses: [
      { delay: 100, response: { status: 200 } },
      { delay: 500, response: { status: 200 } },
      { delay: 1000, response: { status: 200 } },
      { delay: 2000, response: { status: 200 } },
    ],
  },

  // Intermittent Failures
  intermittentFailures: {
    pattern: "every-third",
    responses: [
      { response: { status: 200 } },
      { response: { status: 200 } },
      { response: { status: 500 } }, // Fail every 3rd request
    ],
  },

  // Connection Timeout
  connectionTimeout: {
    timeout: true,
    delay: 30000,
  },
}
