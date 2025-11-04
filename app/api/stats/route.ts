import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get total test suites
    const { count: suitesCount } = await supabase.from("test_suites").select("*", { count: "exact", head: true })

    // Get total bugs
    const { count: bugsCount } = await supabase.from("bugs").select("*", { count: "exact", head: true })

    // Get total test executions
    const { count: executionsCount } = await supabase
      .from("test_executions")
      .select("*", { count: "exact", head: true })

    // Get total API mocks
    const { count: mocksCount } = await supabase.from("api_mocks").select("*", { count: "exact", head: true })

    // Get recent activity
    const { data: recentActivity } = await supabase
      .from("activity_feed")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)

    // Get bug severity breakdown
    const { data: bugsBySeverity } = await supabase.from("bugs").select("severity")

    const severityBreakdown = {
      critical: bugsBySeverity?.filter((b) => b.severity === "critical").length || 0,
      high: bugsBySeverity?.filter((b) => b.severity === "high").length || 0,
      medium: bugsBySeverity?.filter((b) => b.severity === "medium").length || 0,
      low: bugsBySeverity?.filter((b) => b.severity === "low").length || 0,
    }

    return NextResponse.json({
      stats: {
        totalSuites: suitesCount || 0,
        totalBugs: bugsCount || 0,
        totalExecutions: executionsCount || 0,
        totalMocks: mocksCount || 0,
      },
      bugsBySeverity: severityBreakdown,
      recentActivity: recentActivity || [],
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Stats API error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
