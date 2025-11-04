import { NextResponse } from "next/server"

export interface PublicAPI {
  name: string
  description: string
  url: string
  method: string
  category: string
  requiresAuth: boolean
  documentation?: string
  sampleBody?: string
}

const PUBLIC_APIS: PublicAPI[] = [
  // Development & Testing - GET
  {
    name: "JSONPlaceholder - Posts",
    description: "Fake REST API for testing and prototyping",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    method: "GET",
    category: "Development",
    requiresAuth: false,
    documentation: "https://jsonplaceholder.typicode.com/",
  },
  {
    name: "JSONPlaceholder - Create Post",
    description: "Create a new post (fake)",
    url: "https://jsonplaceholder.typicode.com/posts",
    method: "POST",
    category: "Development",
    requiresAuth: false,
    documentation: "https://jsonplaceholder.typicode.com/",
    sampleBody: JSON.stringify({
      title: "My Test Post",
      body: "This is a test post created from Platypus QA Lab",
      userId: 1,
    }),
  },
  {
    name: "JSONPlaceholder - Update Post",
    description: "Update an existing post (fake)",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    method: "PUT",
    category: "Development",
    requiresAuth: false,
    sampleBody: JSON.stringify({
      id: 1,
      title: "Updated Post Title",
      body: "This post has been updated",
      userId: 1,
    }),
  },
  {
    name: "JSONPlaceholder - Patch Post",
    description: "Partially update a post (fake)",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    method: "PATCH",
    category: "Development",
    requiresAuth: false,
    sampleBody: JSON.stringify({
      title: "Patched Title Only",
    }),
  },
  {
    name: "JSONPlaceholder - Delete Post",
    description: "Delete a post (fake)",
    url: "https://jsonplaceholder.typicode.com/posts/1",
    method: "DELETE",
    category: "Development",
    requiresAuth: false,
  },
  {
    name: "JSONPlaceholder - Users",
    description: "Get fake user data",
    url: "https://jsonplaceholder.typicode.com/users",
    method: "GET",
    category: "Development",
    requiresAuth: false,
  },
  {
    name: "HTTPBin - POST",
    description: "Test POST requests with echo response",
    url: "https://httpbin.org/post",
    method: "POST",
    category: "Development",
    requiresAuth: false,
    documentation: "https://httpbin.org/",
    sampleBody: JSON.stringify({
      message: "Hello from Platypus!",
      timestamp: new Date().toISOString(),
    }),
  },
  {
    name: "HTTPBin - PUT",
    description: "Test PUT requests with echo response",
    url: "https://httpbin.org/put",
    method: "PUT",
    category: "Development",
    requiresAuth: false,
    sampleBody: JSON.stringify({
      action: "update",
      data: "test data",
    }),
  },
  {
    name: "HTTPBin - DELETE",
    description: "Test DELETE requests with echo response",
    url: "https://httpbin.org/delete",
    method: "DELETE",
    category: "Development",
    requiresAuth: false,
  },
  {
    name: "HTTPBin - PATCH",
    description: "Test PATCH requests with echo response",
    url: "https://httpbin.org/patch",
    method: "PATCH",
    category: "Development",
    requiresAuth: false,
    sampleBody: JSON.stringify({
      field: "value to patch",
    }),
  },
  {
    name: "HTTPBin - GET",
    description: "Simple HTTP request & response service",
    url: "https://httpbin.org/get",
    method: "GET",
    category: "Development",
    requiresAuth: false,
    documentation: "https://httpbin.org/",
  },
  {
    name: "HTTPBin - Status 200",
    description: "Returns a 200 status code",
    url: "https://httpbin.org/status/200",
    method: "GET",
    category: "Development",
    requiresAuth: false,
  },
  {
    name: "HTTPBin - Status 404",
    description: "Returns a 404 status code",
    url: "https://httpbin.org/status/404",
    method: "GET",
    category: "Development",
    requiresAuth: false,
  },
  {
    name: "HTTPBin - Status 500",
    description: "Returns a 500 status code",
    url: "https://httpbin.org/status/500",
    method: "GET",
    category: "Development",
    requiresAuth: false,
  },
  {
    name: "HTTPBin - Delay",
    description: "Delayed response (2 seconds)",
    url: "https://httpbin.org/delay/2",
    method: "GET",
    category: "Development",
    requiresAuth: false,
  },
  {
    name: "ReqRes - List Users",
    description: "Get paginated list of users",
    url: "https://reqres.in/api/users?page=1",
    method: "GET",
    category: "Development",
    requiresAuth: false,
    documentation: "https://reqres.in/",
  },
  {
    name: "ReqRes - Get Single User",
    description: "Get a single user by ID",
    url: "https://reqres.in/api/users/2",
    method: "GET",
    category: "Development",
    requiresAuth: false,
  },
  {
    name: "ReqRes - Create User",
    description: "Create a new user",
    url: "https://reqres.in/api/users",
    method: "POST",
    category: "Development",
    requiresAuth: false,
    sampleBody: JSON.stringify({
      name: "Perry Platypus",
      job: "QA Engineer",
    }),
  },
  {
    name: "ReqRes - Update User",
    description: "Update user with PUT",
    url: "https://reqres.in/api/users/2",
    method: "PUT",
    category: "Development",
    requiresAuth: false,
    sampleBody: JSON.stringify({
      name: "Perry Updated",
      job: "Senior QA Engineer",
    }),
  },
  {
    name: "ReqRes - Patch User",
    description: "Partially update user",
    url: "https://reqres.in/api/users/2",
    method: "PATCH",
    category: "Development",
    requiresAuth: false,
    sampleBody: JSON.stringify({
      job: "Lead QA Engineer",
    }),
  },
  {
    name: "ReqRes - Delete User",
    description: "Delete a user",
    url: "https://reqres.in/api/users/2",
    method: "DELETE",
    category: "Development",
    requiresAuth: false,
  },

  // GitHub
  {
    name: "GitHub - User Profile",
    description: "Get GitHub user information",
    url: "https://api.github.com/users/octocat",
    method: "GET",
    category: "Social",
    requiresAuth: false,
    documentation: "https://docs.github.com/en/rest",
  },
  {
    name: "GitHub - Repositories",
    description: "Get user's public repositories",
    url: "https://api.github.com/users/vercel/repos",
    method: "GET",
    category: "Social",
    requiresAuth: false,
  },
  {
    name: "GitHub - Rate Limit",
    description: "Check API rate limit status",
    url: "https://api.github.com/rate_limit",
    method: "GET",
    category: "Social",
    requiresAuth: false,
  },

  // Pokemon
  {
    name: "Pokemon - Pikachu",
    description: "Get Pikachu's data",
    url: "https://pokeapi.co/api/v2/pokemon/pikachu",
    method: "GET",
    category: "Entertainment",
    requiresAuth: false,
    documentation: "https://pokeapi.co/docs/v2",
  },
  {
    name: "Pokemon - Random",
    description: "Get a random Pokemon (Ditto)",
    url: "https://pokeapi.co/api/v2/pokemon/ditto",
    method: "GET",
    category: "Entertainment",
    requiresAuth: false,
  },
  {
    name: "Pokemon - Abilities",
    description: "Get Pokemon abilities list",
    url: "https://pokeapi.co/api/v2/ability?limit=20",
    method: "GET",
    category: "Entertainment",
    requiresAuth: false,
  },

  // Animals
  {
    name: "Random Dog Image",
    description: "Get a random dog picture",
    url: "https://dog.ceo/api/breeds/image/random",
    method: "GET",
    category: "Animals",
    requiresAuth: false,
    documentation: "https://dog.ceo/dog-api/",
  },
  {
    name: "Dog Breeds List",
    description: "Get all dog breeds",
    url: "https://dog.ceo/api/breeds/list/all",
    method: "GET",
    category: "Animals",
    requiresAuth: false,
  },
  {
    name: "Random Cat Fact",
    description: "Get a random cat fact",
    url: "https://catfact.ninja/fact",
    method: "GET",
    category: "Animals",
    requiresAuth: false,
    documentation: "https://catfact.ninja/",
  },

  // NASA
  {
    name: "NASA - APOD",
    description: "Astronomy Picture of the Day",
    url: "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY",
    method: "GET",
    category: "Science",
    requiresAuth: false,
    documentation: "https://api.nasa.gov/",
  },
  {
    name: "NASA - Mars Rover Photos",
    description: "Get Mars Rover photos",
    url: "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=DEMO_KEY",
    method: "GET",
    category: "Science",
    requiresAuth: false,
  },

  // Weather & Location
  {
    name: "IP Geolocation",
    description: "Get your IP and location info",
    url: "https://ipapi.co/json/",
    method: "GET",
    category: "Location",
    requiresAuth: false,
    documentation: "https://ipapi.co/api/",
  },
  {
    name: "IP Info",
    description: "Get IP address information",
    url: "https://ipinfo.io/json",
    method: "GET",
    category: "Location",
    requiresAuth: false,
  },

  // Quotes & Text
  {
    name: "Random Quote",
    description: "Get an inspirational quote",
    url: "https://api.quotable.io/random",
    method: "GET",
    category: "Text",
    requiresAuth: false,
    documentation: "https://github.com/lukePeavey/quotable",
  },
  {
    name: "Quote of the Day",
    description: "Get today's quote",
    url: "https://api.quotable.io/quotes/random",
    method: "GET",
    category: "Text",
    requiresAuth: false,
  },
  {
    name: "Random User",
    description: "Generate random user data",
    url: "https://randomuser.me/api/",
    method: "GET",
    category: "Development",
    requiresAuth: false,
    documentation: "https://randomuser.me/",
  },

  // Cryptocurrency
  {
    name: "Bitcoin Price",
    description: "Get current Bitcoin price",
    url: "https://api.coindesk.com/v1/bpi/currentprice.json",
    method: "GET",
    category: "Finance",
    requiresAuth: false,
    documentation: "https://www.coindesk.com/coindesk-api",
  },

  // Fun APIs
  {
    name: "Bored API",
    description: "Get a random activity suggestion",
    url: "https://www.boredapi.com/api/activity",
    method: "GET",
    category: "Entertainment",
    requiresAuth: false,
    documentation: "https://www.boredapi.com/",
  },
  {
    name: "Dad Jokes",
    description: "Get a random dad joke",
    url: "https://icanhazdadjoke.com/",
    method: "GET",
    category: "Entertainment",
    requiresAuth: false,
    documentation: "https://icanhazdadjoke.com/api",
  },
  {
    name: "Advice Slip",
    description: "Get random advice",
    url: "https://api.adviceslip.com/advice",
    method: "GET",
    category: "Entertainment",
    requiresAuth: false,
    documentation: "https://api.adviceslip.com/",
  },

  // REST Countries
  {
    name: "Country Info - USA",
    description: "Get detailed country information",
    url: "https://restcountries.com/v3.1/name/united%20states",
    method: "GET",
    category: "Location",
    requiresAuth: false,
    documentation: "https://restcountries.com/",
  },
  {
    name: "All Countries",
    description: "Get all countries data",
    url: "https://restcountries.com/v3.1/all",
    method: "GET",
    category: "Location",
    requiresAuth: false,
  },
]

export async function GET() {
  const methodCounts = PUBLIC_APIS.reduce(
    (acc, api) => {
      acc[api.method] = (acc[api.method] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return NextResponse.json({
    total: PUBLIC_APIS.length,
    categories: [...new Set(PUBLIC_APIS.map((api) => api.category))],
    methods: methodCounts,
    apis: PUBLIC_APIS,
  })
}
