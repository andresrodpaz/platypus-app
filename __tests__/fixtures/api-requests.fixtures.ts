import type { ApiRequest } from "@/lib/types"

export const mockApiRequests = {
  successGet: {
    id: "req-1",
    url: "https://api.github.com/users/octocat",
    method: "GET",
    status: 200,
    responseTime: 145,
    timestamp: Date.now(),
    response: {
      login: "octocat",
      id: 1,
      avatar_url: "https://github.com/images/error/octocat_happy.gif",
      followers: 3938,
      following: 9,
      repositories: 8,
    },
    humorousComment: "GitHub is feeling generous today! 🎉",
    headers: {
      "content-type": "application/json",
      "x-ratelimit-limit": "60",
      "x-ratelimit-remaining": "59",
    },
  } as ApiRequest,

  successPost: {
    id: "req-2",
    url: "https://api.example.com/data",
    method: "POST",
    status: 201,
    responseTime: 234,
    timestamp: Date.now() - 5000,
    response: {
      id: "obj-123",
      created: true,
      message: "Data created successfully",
    },
    humorousComment: "Created! Fresh data hot off the press 🔥",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ name: "Test", value: 100 }),
  } as ApiRequest,

  clientError400: {
    id: "req-3",
    url: "https://api.example.com/invalid",
    method: "POST",
    status: 400,
    responseTime: 89,
    timestamp: Date.now() - 10000,
    response: {
      error: "Bad Request",
      message: "Missing required field: name",
      code: "VALIDATION_ERROR",
    },
    humorousComment: "Bad request detected! Double-check your params... 🤔",
    headers: {
      "content-type": "application/json",
    },
  } as ApiRequest,

  unauthorizedError401: {
    id: "req-4",
    url: "https://api.example.com/protected",
    method: "GET",
    status: 401,
    responseTime: 56,
    timestamp: Date.now() - 15000,
    response: {
      error: "Unauthorized",
      message: "Invalid or missing authentication token",
    },
    humorousComment: "Access denied! Time to authenticate, friend 🔐",
    headers: {
      "content-type": "application/json",
    },
  } as ApiRequest,

  notFoundError404: {
    id: "req-5",
    url: "https://api.example.com/users/nonexistent",
    method: "GET",
    status: 404,
    responseTime: 67,
    timestamp: Date.now() - 20000,
    response: {
      error: "Not Found",
      message: "User not found",
    },
    humorousComment: "Looks like that resource went on vacation without telling you... 👻",
    headers: {
      "content-type": "application/json",
    },
  } as ApiRequest,

  serverError500: {
    id: "req-6",
    url: "https://api.example.com/critical",
    method: "GET",
    status: 500,
    responseTime: 3421,
    timestamp: Date.now() - 25000,
    response: {
      error: "Internal Server Error",
      message: "Something went terribly wrong",
      requestId: "err-abc123",
    },
    humorousComment: "Oh no! The server just experienced an existential crisis! 💥",
    headers: {
      "content-type": "application/json",
    },
  } as ApiRequest,

  slowResponse: {
    id: "req-7",
    url: "https://api.example.com/slow-endpoint",
    method: "GET",
    status: 200,
    responseTime: 5234,
    timestamp: Date.now() - 30000,
    response: { data: "slow data" },
    humorousComment: "That was slower than a sleepy platypus... 🐢",
    headers: {
      "content-type": "application/json",
    },
  } as ApiRequest,

  fastResponse: {
    id: "req-8",
    url: "https://api.example.com/fast-endpoint",
    method: "GET",
    status: 200,
    responseTime: 12,
    timestamp: Date.now() - 35000,
    response: { data: "fast data" },
    humorousComment: "⚡ Lightning fast response! The speed gods are pleased!",
    headers: {
      "content-type": "application/json",
    },
  } as ApiRequest,

  complexJsonResponse: {
    id: "req-9",
    url: "https://api.pokeapi.co/v2/pokemon/ditto",
    method: "GET",
    status: 200,
    responseTime: 245,
    timestamp: Date.now() - 40000,
    response: {
      id: 132,
      name: "ditto",
      base_experience: 101,
      height: 3,
      weight: 40,
      abilities: [{ ability: { name: "imposter" }, is_hidden: true, slot: 3 }],
      stats: [
        { stat: { name: "hp" }, base_stat: 48 },
        { stat: { name: "attack" }, base_stat: 48 },
        { stat: { name: "defense" }, base_stat: 48 },
      ],
      types: [{ type: { name: "normal" }, slot: 1 }],
    },
    humorousComment: "Pokémon API is working perfectly! Ditto ready for battle 🎮",
    headers: {
      "content-type": "application/json",
    },
  } as ApiRequest,
}

export const createApiRequest = (overrides?: Partial<ApiRequest>): ApiRequest => ({
  id: `req-${Math.random().toString(36).substr(2, 9)}`,
  url: "https://api.example.com/test",
  method: "GET",
  status: 200,
  responseTime: 100,
  timestamp: Date.now(),
  response: { test: "data" },
  humorousComment: "Test request comment",
  ...overrides,
})
