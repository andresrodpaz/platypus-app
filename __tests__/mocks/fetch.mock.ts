import { jest } from "@jest/globals"

type FetchMockResponse = {
  status: number
  body: any
  headers?: Record<string, string>
  delay?: number
}

const mockResponses: Record<string, FetchMockResponse> = {
  "https://api.github.com/users/octocat": {
    status: 200,
    body: {
      login: "octocat",
      id: 1,
      avatar_url: "https://github.com/images/error/octocat_happy.gif",
      followers: 3938,
      public_repos: 2,
    },
    headers: {
      "content-type": "application/json",
      "x-ratelimit-limit": "60",
    },
  },
  "https://api.example.com/data": {
    status: 201,
    body: {
      id: "obj-123",
      created: true,
      message: "Data created successfully",
    },
    headers: { "content-type": "application/json" },
  },
  "https://api.example.com/invalid": {
    status: 400,
    body: {
      error: "Bad Request",
      message: "Missing required field: name",
      code: "VALIDATION_ERROR",
    },
    headers: { "content-type": "application/json" },
  },
  "https://api.example.com/protected": {
    status: 401,
    body: {
      error: "Unauthorized",
      message: "Invalid or missing authentication token",
    },
    headers: { "content-type": "application/json" },
  },
  "https://api.example.com/users/nonexistent": {
    status: 404,
    body: {
      error: "Not Found",
      message: "User not found",
    },
    headers: { "content-type": "application/json" },
  },
  "https://api.example.com/critical": {
    status: 500,
    body: {
      error: "Internal Server Error",
      message: "Something went terribly wrong",
      requestId: "err-abc123",
    },
    headers: { "content-type": "application/json" },
  },
  "https://api.example.com/slow-endpoint": {
    status: 200,
    body: { data: "slow data" },
    headers: { "content-type": "application/json" },
    delay: 5000,
  },
  "https://api.pokeapi.co/v2/pokemon/ditto": {
    status: 200,
    body: {
      id: 132,
      name: "ditto",
      base_experience: 101,
      height: 3,
      weight: 40,
      types: [{ type: { name: "normal" }, slot: 1 }],
    },
    headers: { "content-type": "application/json" },
  },
}

export const setupFetchMock = () => {
  global.fetch = jest.fn(async (url: string, options?: RequestInit) => {
    const urlString = typeof url === "string" ? url : url.toString()
    const response = mockResponses[urlString] || {
      status: 200,
      body: { default: "mock response" },
      headers: { "content-type": "application/json" },
    }

    // Simulate network delay
    if (response.delay) {
      await new Promise((resolve) => setTimeout(resolve, response.delay))
    }

    return new Response(JSON.stringify(response.body), {
      status: response.status,
      headers: response.headers || { "content-type": "application/json" },
    })
  }) as jest.Mock
}

export const setupLocalStorageMock = () => {
  let store: Record<string, string> = {}

  const mockLocalStorage = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    key: (index: number) => {
      const keys = Object.keys(store)
      return keys[index] || null
    },
    get length() {
      return Object.keys(store).length
    },
  }

  Object.defineProperty(window, "localStorage", {
    value: mockLocalStorage,
    writable: true,
  })
}

export const resetAllMocks = () => {
  jest.clearAllMocks()
  localStorage.clear()
}
