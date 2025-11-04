import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if Supabase is configured
    const hasSupabaseConfig = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (hasSupabaseConfig) {
      // If Supabase is configured, test the connection
      const { createClient } = await import("@/lib/supabase/server")
      const supabase = await createClient()

      // Check database connection
      const { data, error } = await supabase.from("user_profiles").select("count").limit(1)

      if (error) {
        return NextResponse.json(
          {
            status: "unhealthy",
            database: "disconnected",
            error: error.message,
            timestamp: new Date().toISOString(),
          },
          { status: 503 },
        )
      }

      return NextResponse.json({
        status: "healthy",
        database: "connected",
        databaseType: "supabase",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      })
    } else {
      // If Supabase is not configured, assume local PostgreSQL and return healthy
      // The app can work with localStorage fallback
      return NextResponse.json({
        status: "healthy",
        database: "not_configured",
        databaseType: "local",
        message: "Running without Supabase (using local storage or direct PostgreSQL)",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      })
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    )
  }
}
