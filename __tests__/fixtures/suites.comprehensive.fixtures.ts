/**
 * Comprehensive Test Suite Fixtures
 * Real-world examples for various testing scenarios
 */

export const COMPREHENSIVE_SUITES = {
  // E-Commerce API Suite
  ecommerceApiSuite: {
    id: "suite-ecom-001",
    name: "E-Commerce API Complete Flow",
    description: "Full e-commerce workflow: products, cart, checkout, orders",
    requests: [
      {
        id: "req-ecom-1",
        name: "List Products",
        method: "GET",
        url: "https://api.example-ecom.com/v1/products",
        headers: { Authorization: "Bearer token123", "Content-Type": "application/json" },
        queryParams: { limit: "50", offset: "0", category: "electronics" },
        expectedStatus: 200,
        expectedResponseTime: 500,
      },
      {
        id: "req-ecom-2",
        name: "Get Product Details",
        method: "GET",
        url: "https://api.example-ecom.com/v1/products/prod-12345",
        headers: { Authorization: "Bearer token123" },
        expectedStatus: 200,
        expectedResponseTime: 300,
      },
      {
        id: "req-ecom-3",
        name: "Add to Cart",
        method: "POST",
        url: "https://api.example-ecom.com/v1/cart/items",
        headers: { Authorization: "Bearer token123", "Content-Type": "application/json" },
        body: { productId: "prod-12345", quantity: 2 },
        expectedStatus: 201,
        expectedResponseTime: 400,
      },
      {
        id: "req-ecom-4",
        name: "Checkout",
        method: "POST",
        url: "https://api.example-ecom.com/v1/orders",
        headers: { Authorization: "Bearer token123", "Content-Type": "application/json" },
        body: { cartId: "cart-abc", shippingAddress: { country: "US", zip: "10001" } },
        expectedStatus: 201,
        expectedResponseTime: 800,
      },
    ],
    assertions: [
      { type: "status_code", operator: "equals", value: 200, requestId: "req-ecom-1" },
      { type: "response_time", operator: "less_than", value: 500, requestId: "req-ecom-1" },
      { type: "json_schema", path: "data.products", requestId: "req-ecom-1" },
      { type: "contains", value: "product", requestId: "req-ecom-2" },
    ],
  },

  // Authentication Flow Suite
  authFlowSuite: {
    id: "suite-auth-001",
    name: "Authentication & Authorization Flow",
    description: "Complete auth workflow: register, login, refresh, logout",
    requests: [
      {
        id: "req-auth-1",
        name: "User Registration",
        method: "POST",
        url: "https://api.auth.example.com/auth/register",
        headers: { "Content-Type": "application/json" },
        body: { email: "user@test.com", password: "SecurePass123!", name: "Test User" },
        expectedStatus: 201,
      },
      {
        id: "req-auth-2",
        name: "User Login",
        method: "POST",
        url: "https://api.auth.example.com/auth/login",
        headers: { "Content-Type": "application/json" },
        body: { email: "user@test.com", password: "SecurePass123!" },
        expectedStatus: 200,
      },
      {
        id: "req-auth-3",
        name: "Refresh Token",
        method: "POST",
        url: "https://api.auth.example.com/auth/refresh",
        headers: { Authorization: "Bearer refresh_token" },
        expectedStatus: 200,
      },
      {
        id: "req-auth-4",
        name: "Get Current User",
        method: "GET",
        url: "https://api.auth.example.com/auth/me",
        headers: { Authorization: "Bearer access_token" },
        expectedStatus: 200,
      },
      {
        id: "req-auth-5",
        name: "Logout",
        method: "POST",
        url: "https://api.auth.example.com/auth/logout",
        headers: { Authorization: "Bearer access_token" },
        expectedStatus: 204,
      },
    ],
    assertions: [
      { type: "status_code", operator: "equals", value: 201, requestId: "req-auth-1" },
      { type: "status_code", operator: "equals", value: 200, requestId: "req-auth-2" },
      { type: "contains", value: "access_token", requestId: "req-auth-2" },
      { type: "contains", value: "refresh_token", requestId: "req-auth-2" },
    ],
  },

  // GraphQL API Suite
  graphqlApiSuite: {
    id: "suite-gql-001",
    name: "GraphQL API Suite",
    description: "GraphQL queries and mutations",
    requests: [
      {
        id: "req-gql-1",
        name: "Query Users",
        method: "POST",
        url: "https://api.graphql.example.com/graphql",
        headers: { "Content-Type": "application/json", Authorization: "Bearer token" },
        body: { query: "{ users { id name email } }" },
        expectedStatus: 200,
      },
      {
        id: "req-gql-2",
        name: "Mutation: Create User",
        method: "POST",
        url: "https://api.graphql.example.com/graphql",
        headers: { "Content-Type": "application/json" },
        body: { query: 'mutation { createUser(name: "John") { id name } }' },
        expectedStatus: 200,
      },
    ],
  },

  // Real-time WebSocket Suite
  websocketSuite: {
    id: "suite-ws-001",
    name: "WebSocket Real-time Testing",
    description: "WebSocket connection and messaging",
    requests: [
      {
        id: "req-ws-1",
        name: "Connect WebSocket",
        method: "WS",
        url: "wss://api.realtime.example.com/socket",
        headers: { Authorization: "Bearer token" },
        expectedStatus: 101, // WebSocket upgrade
      },
    ],
  },

  // Microservices Suite
  microservicesSuite: {
    id: "suite-micro-001",
    name: "Microservices Integration",
    description: "Testing multiple microservices",
    requests: [
      {
        id: "req-micro-1",
        name: "User Service: Get User",
        method: "GET",
        url: "https://users-service.example.com/users/123",
        expectedStatus: 200,
      },
      {
        id: "req-micro-2",
        name: "Order Service: Create Order",
        method: "POST",
        url: "https://orders-service.example.com/orders",
        body: { userId: "123", items: [] },
        expectedStatus: 201,
      },
      {
        id: "req-micro-3",
        name: "Notification Service: Send Email",
        method: "POST",
        url: "https://notifications-service.example.com/send",
        body: { email: "user@test.com", type: "order_confirmation" },
        expectedStatus: 202,
      },
    ],
  },

  // Rate Limit & Throttling Suite
  rateLimitSuite: {
    id: "suite-rate-001",
    name: "Rate Limiting & Throttling Tests",
    description: "Test API rate limit behavior",
    requests: [
      {
        id: "req-rate-1",
        name: "Normal Request",
        method: "GET",
        url: "https://api.example.com/data",
        expectedStatus: 200,
      },
      {
        id: "req-rate-2",
        name: "Rapid Fire Requests (10x)",
        method: "GET",
        url: "https://api.example.com/data",
        repeat: 10,
        expectedStatus: 429, // After limit exceeded
      },
    ],
  },

  // Error Handling Suite
  errorHandlingSuite: {
    id: "suite-error-001",
    name: "Error Handling & Edge Cases",
    description: "Test various error scenarios",
    requests: [
      {
        id: "req-err-1",
        name: "Bad Request - Missing Field",
        method: "POST",
        url: "https://api.example.com/users",
        body: { name: "John" }, // Missing email
        expectedStatus: 400,
      },
      {
        id: "req-err-2",
        name: "Unauthorized - Invalid Token",
        method: "GET",
        url: "https://api.example.com/secure",
        headers: { Authorization: "Bearer invalid" },
        expectedStatus: 401,
      },
      {
        id: "req-err-3",
        name: "Forbidden - Insufficient Permissions",
        method: "DELETE",
        url: "https://api.example.com/admin/users/123",
        headers: { Authorization: "Bearer user_token" },
        expectedStatus: 403,
      },
      {
        id: "req-err-4",
        name: "Not Found - Non-existent Resource",
        method: "GET",
        url: "https://api.example.com/users/nonexistent",
        expectedStatus: 404,
      },
      {
        id: "req-err-5",
        name: "Server Error - 500",
        method: "GET",
        url: "https://api.example.com/broken",
        expectedStatus: 500,
      },
      {
        id: "req-err-6",
        name: "Service Unavailable - 503",
        method: "GET",
        url: "https://api.example.com/maintenance",
        expectedStatus: 503,
      },
    ],
  },

  // Performance & Load Testing Suite
  performanceSuite: {
    id: "suite-perf-001",
    name: "Performance & Load Testing",
    description: "Test response times and throughput",
    requests: [
      {
        id: "req-perf-1",
        name: "Light Payload",
        method: "GET",
        url: "https://api.example.com/light",
        expectedStatus: 200,
        expectedResponseTime: 100,
      },
      {
        id: "req-perf-2",
        name: "Heavy Payload",
        method: "GET",
        url: "https://api.example.com/heavy",
        expectedStatus: 200,
        expectedResponseTime: 2000,
      },
      {
        id: "req-perf-3",
        name: "Concurrent Load (100 requests)",
        method: "GET",
        url: "https://api.example.com/data",
        concurrent: 100,
        expectedStatus: 200,
      },
    ],
  },

  // Payment Integration Suite
  paymentSuite: {
    id: "suite-pay-001",
    name: "Payment Processing",
    description: "Credit card and payment flows",
    requests: [
      {
        id: "req-pay-1",
        name: "Create Payment Intent",
        method: "POST",
        url: "https://api.stripe.example.com/payment-intents",
        headers: { Authorization: "Bearer sk_live_key" },
        body: { amount: 9999, currency: "usd" },
        expectedStatus: 201,
      },
      {
        id: "req-pay-2",
        name: "Confirm Payment",
        method: "POST",
        url: "https://api.stripe.example.com/payment-intents/pi_123/confirm",
        body: { payment_method: "pm_456" },
        expectedStatus: 200,
      },
      {
        id: "req-pay-3",
        name: "Refund Payment",
        method: "POST",
        url: "https://api.stripe.example.com/refunds",
        body: { charge: "ch_789", amount: 5000 },
        expectedStatus: 201,
      },
    ],
  },
}

export const createCustomSuite = (overrides: Partial<typeof COMPREHENSIVE_SUITES.ecommerceApiSuite>) => ({
  ...COMPREHENSIVE_SUITES.ecommerceApiSuite,
  ...overrides,
})
