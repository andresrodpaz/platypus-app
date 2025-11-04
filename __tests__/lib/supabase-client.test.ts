import { createClient } from "@/lib/supabase/client"

describe("Supabase Client", () => {
  it("should create a Supabase client", () => {
    const client = createClient()
    expect(client).toBeDefined()
    expect(typeof client).toBe("object")
  })

  it("should have auth methods", () => {
    const client = createClient()
    expect(client.auth).toBeDefined()
    expect(typeof client.auth.signInWithPassword).toBe("function")
    expect(typeof client.auth.signUp).toBe("function")
    expect(typeof client.auth.signOut).toBe("function")
  })

  it("should have database methods", () => {
    const client = createClient()
    expect(client.from).toBeDefined()
    expect(typeof client.from).toBe("function")
  })

  it("should have realtime methods", () => {
    const client = createClient()
    expect(client.channel).toBeDefined()
    expect(typeof client.channel).toBe("function")
  })
})
