import { jest } from "@jest/globals"

export const mockApiHandlers = {
  githubUser: {
    getUser: jest.fn<any>().mockResolvedValue({
      login: "octocat",
      id: 1,
      avatar_url: "https://github.com/images/error/octocat_happy.gif",
      followers: 3938,
      public_repos: 2,
    }),
    listRepos: jest.fn<any>().mockResolvedValue([
      {
        id: 1296269,
        name: "Hello-World",
        description: "This your first repo!",
        language: "JavaScript",
      },
    ]),
  },

  pokeApi: {
    getPokemon: jest.fn<any>().mockResolvedValue({
      id: 132,
      name: "ditto",
      base_experience: 101,
      height: 3,
      weight: 40,
      types: [{ type: { name: "normal" } }],
    }),
  },

  customApi: {
    login: jest.fn<any>().mockResolvedValue({
      token: "jwt-eyJhbGc...",
      user: { id: "1", email: "user@example.com" },
    }),
    getUser: jest.fn<any>().mockResolvedValue({
      id: "1",
      email: "user@example.com",
      name: "John Doe",
    }),
    updateUser: jest.fn<any>().mockResolvedValue({
      success: true,
      message: "User updated",
    }),
    deleteUser: jest.fn<any>().mockResolvedValue({
      success: true,
      message: "User deleted",
    }),
  },

  errorScenarios: {
    notFound: jest.fn<any>().mockRejectedValue(new Error("404 Not Found")),
    unauthorized: jest.fn<any>().mockRejectedValue(new Error("401 Unauthorized")),
    serverError: jest.fn<any>().mockRejectedValue(new Error("500 Server Error")),
    timeout: jest.fn<any>().mockRejectedValue(new Error("Request timeout")),
  },
}
