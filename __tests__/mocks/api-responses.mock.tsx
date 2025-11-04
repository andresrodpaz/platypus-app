/**
 * Comprehensive API Response Mocks
 * Real-world response examples for various APIs
 */

export const MOCK_RESPONSES = {
  // Success Responses
  success: {
    // GitHub API Response
    github: {
      status: 200,
      headers: { "content-type": "application/json", "x-ratelimit-remaining": "59" },
      body: {
        id: 123456,
        login: "octocat",
        avatar_url: "https://github.com/images/error/octocat_happy.gif",
        repos_url: "https://api.github.com/users/octocat/repos",
        public_repos: 45,
        followers: 1234,
      },
    },

    // PokéAPI Response
    pokemon: {
      status: 200,
      headers: { "content-type": "application/json" },
      body: {
        id: 1,
        name: "bulbasaur",
        base_experience: 64,
        height: 7,
        is_main_series: true,
        abilities: [
          { ability: { name: "chlorophyll" }, is_hidden: true },
          { ability: { name: "overgrow" }, is_hidden: false },
        ],
        types: [{ type: { name: "grass" } }, { type: { name: "poison" } }],
      },
    },

    // E-Commerce Product
    product: {
      status: 200,
      headers: { "content-type": "application/json" },
      body: {
        id: "prod-12345",
        name: "Laptop",
        price: 999.99,
        currency: "USD",
        stock: 50,
        rating: 4.5,
        reviews: 234,
        description: "High-performance laptop",
      },
    },

    // User List
    userList: {
      status: 200,
      headers: { "content-type": "application/json", "x-total-count": "150" },
      body: {
        data: [
          { id: 1, email: "user1@test.com", name: "Alice", role: "admin" },
          { id: 2, email: "user2@test.com", name: "Bob", role: "user" },
          { id: 3, email: "user3@test.com", name: "Charlie", role: "user" },
        ],
        pagination: { page: 1, limit: 10, total: 150 },
      },
    },

    // JWT Auth Response
    auth: {
      status: 200,
      headers: { "content-type": "application/json" },
      body: {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        expires_in: 3600,
        token_type: "Bearer",
        user: { id: 1, email: "user@test.com" },
      },
    },

    // Bulk Import Response
    bulkOperation: {
      status: 202, // Accepted
      headers: { "content-type": "application/json" },
      body: {
        id: "bulk-op-123",
        status: "processing",
        progress: 0,
        estimated_completion: "2024-01-15T10:30:00Z",
      },
    },
  },

  // Error Responses
  errors: {
    // 400 Bad Request
    badRequest: {
      status: 400,
      headers: { "content-type": "application/json" },
      body: {
        error: "Bad Request",
        message: "Missing required field: email",
        code: "MISSING_FIELD",
        details: {
          field: "email",
          reason: "required",
        },
      },
    },

    // 401 Unauthorized
    unauthorized: {
      status: 401,
      headers: { "content-type": "application/json" },
      body: {
        error: "Unauthorized",
        message: "Invalid or expired token",
        code: "INVALID_TOKEN",
      },
    },

    // 403 Forbidden
    forbidden: {
      status: 403,
      headers: { "content-type": "application/json" },
      body: {
        error: "Forbidden",
        message: "You do not have permission to access this resource",
        code: "INSUFFICIENT_PERMISSIONS",
      },
    },

    // 404 Not Found
    notFound: {
      status: 404,
      headers: { "content-type": "application/json" },
      body: {
        error: "Not Found",
        message: "Resource not found",
        code: "RESOURCE_NOT_FOUND",
        resource: "User",
        id: "12345",
      },
    },

    // 409 Conflict
    conflict: {
      status: 409,
      headers: { "content-type": "application/json" },
      body: {
        error: "Conflict",
        message: "Email already exists",
        code: "DUPLICATE_EMAIL",
      },
    },

    // 429 Too Many Requests
    tooManyRequests: {
      status: 429,
      headers: {
        "content-type": "application/json",
        "x-ratelimit-limit": "1000",
        "x-ratelimit-remaining": "0",
        "x-ratelimit-reset": "1705318800",
      },
      body: {
        error: "Too Many Requests",
        message: "Rate limit exceeded",
        code: "RATE_LIMIT_EXCEEDED",
        retry_after: 60,
      },
    },

    // 500 Internal Server Error
    internalServerError: {
      status: 500,
      headers: { "content-type": "application/json" },
      body: {
        error: "Internal Server Error",
        message: "Something went wrong",
        code: "INTERNAL_ERROR",
        request_id: "req-12345",
      },
    },

    // 503 Service Unavailable
    serviceUnavailable: {
      status: 503,
      headers: { "content-type": "application/json", "retry-after": "300" },
      body: {
        error: "Service Unavailable",
        message: "Service is under maintenance",
        code: "SERVICE_UNAVAILABLE",
        maintenance_until: "2024-01-15T12:00:00Z",
      },
    },
  },

  // Response with Different Content Types
  contentTypes: {
    json: {
      status: 200,
      headers: { "content-type": "application/json" },
      body: { data: "example" },
    },
    xml: {
      status: 200,
      headers: { "content-type": "application/xml" },
      body: '<?xml version="1.0"?><root><data>example</data></root>',
    },
    html: {
      status: 200,
      headers: { "content-type": "text/html" },
      body: "<html><body><h1>Example</h1></body></html>",
    },
    plaintext: {
      status: 200,
      headers: { "content-type": "text/plain" },
      body: "Plain text response",
    },
    csv: {
      status: 200,
      headers: { "content-type": "text/csv" },
      body: "id,name,email\n1,John,john@test.com",
    },
  },

  // Large Response
  largeResponse: {
    status: 200,
    headers: { "content-type": "application/json" },
    body: {
      data: Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        value: Math.random() * 1000,
      })),
    },
  },

  // Empty Response (204 No Content)
  empty: {
    status: 204,
    headers: {},
    body: null,
  },
}

export const createMockResponse = (status: number, body: any, headers: Record<string, string> = {}) => ({
  status,
  headers: { "content-type": "application/json", ...headers },
  body,
})
