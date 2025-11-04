import { jest } from "@jest/globals"

export const mockSupabaseClient = {
  auth: {
    signUp: jest.fn<any>().mockResolvedValue({
      data: {
        user: {
          id: "user-123",
          email: "test@example.com",
          user_metadata: {},
        },
        session: null,
      },
      error: null,
    }),
    signInWithPassword: jest.fn<any>().mockResolvedValue({
      data: {
        user: { id: "user-123", email: "test@example.com" },
        session: {
          access_token: "jwt-token-123",
          refresh_token: "refresh-token-123",
        },
      },
      error: null,
    }),
    signOut: jest.fn<any>().mockResolvedValue({ error: null }),
    getSession: jest.fn<any>().mockResolvedValue({
      data: {
        session: {
          access_token: "jwt-token-123",
          user: { id: "user-123" },
        },
      },
      error: null,
    }),
  },
  from: jest.fn<any>((table: string) => ({
    select: jest.fn<any>().mockReturnThis(),
    insert: jest.fn<any>().mockResolvedValue({ data: [], error: null }),
    update: jest.fn<any>().mockResolvedValue({ data: [], error: null }),
    delete: jest.fn<any>().mockResolvedValue({ data: [], error: null }),
    eq: jest.fn<any>().mockReturnThis(),
    single: jest.fn<any>().mockResolvedValue({ data: {}, error: null }),
  })),
}

export const setupSupabaseMock = () => {
  jest.mock("@/lib/supabase/client", () => ({
    supabase: mockSupabaseClient,
  }))
}
