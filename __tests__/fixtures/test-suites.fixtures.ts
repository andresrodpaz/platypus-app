import type { TestSuite } from "@/lib/types"

export const mockTestSuites = {
  basicUserApi: {
    id: "suite-1",
    name: "GitHub User API Tests",
    description: "Complete test suite for GitHub user endpoints",
    requests: [
      {
        id: "sreq-1",
        url: "https://api.github.com/users/octocat",
        method: "GET",
        headers: { Authorization: "Bearer token" },
        assertions: [
          {
            id: "assert-1",
            type: "status",
            operator: "equals",
            value: 200,
            enabled: true,
          },
          {
            id: "assert-2",
            type: "json_schema",
            field: "login",
            operator: "contains",
            value: "octocat",
            enabled: true,
          },
          {
            id: "assert-3",
            type: "response_time",
            operator: "less_than",
            value: 1000,
            enabled: true,
          },
        ],
        order: 1,
      },
      {
        id: "sreq-2",
        url: "https://api.github.com/users/octocat/repos",
        method: "GET",
        headers: { Authorization: "Bearer token" },
        assertions: [
          {
            id: "assert-4",
            type: "status",
            operator: "equals",
            value: 200,
            enabled: true,
          },
          {
            id: "assert-5",
            type: "json_schema",
            field: "0.name",
            operator: "contains",
            value: "repo",
            enabled: true,
          },
        ],
        order: 2,
      },
    ],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 3600000,
    userId: "user-1",
    isPublic: true,
    tags: ["github", "users", "api", "production"],
  } as TestSuite,

  authenticationWorkflow: {
    id: "suite-2",
    name: "Authentication Workflow",
    description: "Test complete auth flow: login, verify token, logout",
    requests: [
      {
        id: "sreq-3",
        url: "https://api.example.com/auth/login",
        method: "POST",
        body: JSON.stringify({ email: "test@example.com", password: "pass123" }),
        headers: { "Content-Type": "application/json" },
        assertions: [
          {
            id: "assert-6",
            type: "status",
            operator: "equals",
            value: 200,
            enabled: true,
          },
          {
            id: "assert-7",
            type: "json_schema",
            field: "token",
            operator: "contains",
            value: "jwt",
            enabled: true,
          },
        ],
        order: 1,
      },
      {
        id: "sreq-4",
        url: "https://api.example.com/auth/verify",
        method: "GET",
        headers: { Authorization: "Bearer ${token}" },
        assertions: [
          {
            id: "assert-8",
            type: "status",
            operator: "equals",
            value: 200,
            enabled: true,
          },
        ],
        order: 2,
      },
    ],
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 7200000,
    userId: "user-2",
    isPublic: false,
    tags: ["auth", "security", "critical"],
  } as TestSuite,

  errorHandlingTests: {
    id: "suite-3",
    name: "Error Handling Coverage",
    description: "Comprehensive error scenario testing",
    requests: [
      {
        id: "sreq-5",
        url: "https://api.example.com/users/invalid",
        method: "GET",
        assertions: [
          {
            id: "assert-9",
            type: "status",
            operator: "equals",
            value: 404,
            enabled: true,
          },
        ],
        order: 1,
      },
      {
        id: "sreq-6",
        url: "https://api.example.com/protected",
        method: "GET",
        assertions: [
          {
            id: "assert-10",
            type: "status",
            operator: "equals",
            value: 401,
            enabled: true,
          },
        ],
        order: 2,
      },
      {
        id: "sreq-7",
        url: "https://api.example.com/critical",
        method: "POST",
        body: JSON.stringify({ malformed: "data" }),
        assertions: [
          {
            id: "assert-11",
            type: "status",
            operator: "equals",
            value: 400,
            enabled: true,
          },
        ],
        order: 3,
      },
    ],
    createdAt: Date.now() - 259200000,
    updatedAt: Date.now() - 10800000,
    userId: "user-1",
    isPublic: true,
    tags: ["error-handling", "edge-cases", "testing"],
  } as TestSuite,

  performanceTests: {
    id: "suite-4",
    name: "Performance & Load Testing",
    description: "Validate response times and load handling",
    requests: [
      {
        id: "sreq-8",
        url: "https://api.example.com/heavy-data",
        method: "GET",
        assertions: [
          {
            id: "assert-12",
            type: "response_time",
            operator: "less_than",
            value: 2000,
            enabled: true,
          },
        ],
        order: 1,
      },
      {
        id: "sreq-9",
        url: "https://api.example.com/cache",
        method: "GET",
        assertions: [
          {
            id: "assert-13",
            type: "response_time",
            operator: "less_than",
            value: 500,
            enabled: true,
          },
        ],
        order: 2,
      },
    ],
    createdAt: Date.now() - 345600000,
    updatedAt: Date.now() - 14400000,
    userId: "user-3",
    isPublic: true,
    tags: ["performance", "load", "optimization"],
  } as TestSuite,
}

export const createTestSuite = (overrides?: Partial<TestSuite>): TestSuite => ({
  id: `suite-${Math.random().toString(36).substr(2, 9)}`,
  name: "Test Suite",
  description: "Test suite description",
  requests: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  userId: "user-1",
  isPublic: false,
  tags: [],
  ...overrides,
})
