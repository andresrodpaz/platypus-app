"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { createClient } from "@/lib/supabase/client"
import type { Bug } from "@/lib/storage"
import { TrendingUp, TrendingDown, Activity, BugIcon, Clock, CheckCircle2 } from "lucide-react"

interface TestExecution {
  id: string
  status: string
  total_requests: number
  passed_requests: number
  failed_requests: number
  avg_response_time: number
  started_at: string
}

export default function AnalyticsPage() {
  const [executions, setExecutions] = useState<TestExecution[]>([])
  const [bugs, setBugs] = useState<Bug[]>([])
  const [humorMessage, setHumorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: executionsData, error: execError } = await supabase
        .from("test_executions")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(50)

      if (execError) throw execError

      const { data: bugsData, error: bugsError } = await supabase
        .from("bugs")
        .select("*")
        .order("created_at", { ascending: false })

      if (bugsError) throw bugsError

      setExecutions(executionsData || [])
      setBugs(bugsData || [])
      generateHumorMessage(executionsData || [], bugsData || [])
    } catch (error) {
      console.error("Failed to load analytics data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateHumorMessage = (execs: TestExecution[], bugsData: Bug[]) => {
    const successRate = calculateSuccessRate(execs)
    const totalBugs = bugsData.length

    if (execs.length === 0) {
      setHumorMessage("No tests yet? The platypus is waiting patiently...")
      return
    }

    if (successRate >= 90) {
      setHumorMessage(`${successRate}% success rate! The platypus approves of your API choices.`)
    } else if (successRate >= 70) {
      setHumorMessage(`${successRate}% success rate. Not bad, but the platypus has seen better.`)
    } else if (successRate >= 50) {
      setHumorMessage(`${successRate}% success rate. Are you testing production APIs?`)
    } else {
      setHumorMessage(`${successRate}% success rate. The platypus is concerned about your API selection.`)
    }

    if (totalBugs > 10) {
      setHumorMessage((prev) => `${prev} Also, ${totalBugs} bugs? You're either thorough or unlucky.`)
    }
  }

  const calculateSuccessRate = (execs: TestExecution[]) => {
    if (execs.length === 0) return 0
    const totalPassed = execs.reduce((sum, e) => sum + e.passed_requests, 0)
    const totalTests = execs.reduce((sum, e) => sum + e.total_requests, 0)
    return totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0
  }

  const getStatusDistribution = () => {
    const distribution = {
      "Passed Tests": 0,
      "Failed Tests": 0,
    }

    executions.forEach((exec) => {
      distribution["Passed Tests"] += exec.passed_requests
      distribution["Failed Tests"] += exec.failed_requests
    })

    return Object.entries(distribution).map(([name, value]) => ({ name, value }))
  }

  const getResponseTimeData = () => {
    return executions
      .slice(0, 10)
      .reverse()
      .map((exec, index) => ({
        name: `Test ${index + 1}`,
        time: Math.round(exec.avg_response_time || 0),
      }))
  }

  const getBugSeverityData = () => {
    const severityCounts = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    }

    bugs.forEach((bug) => {
      severityCounts[bug.severity]++
    })

    return Object.entries(severityCounts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }))
  }

  const getBugStatusData = () => {
    const statusCounts = {
      open: 0,
      "in-progress": 0,
      fixed: 0,
      "wont-fix": 0,
    }

    bugs.forEach((bug) => {
      statusCounts[bug.status]++
    })

    return Object.entries(statusCounts)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({
        name: name
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
        value,
      }))
  }

  const totalTests = executions.reduce((sum, e) => sum + e.total_requests, 0)
  const avgResponseTime =
    executions.length > 0
      ? Math.round(executions.reduce((sum, e) => sum + (e.avg_response_time || 0), 0) / executions.length)
      : 0

  const successRate = calculateSuccessRate(executions)

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">QA Analytics</h1>
          <p className="text-muted-foreground text-lg">Visualize your testing prowess. The platypus is taking notes.</p>
        </div>

        {/* Humor Message */}
        {humorMessage && (
          <Alert className="bg-primary/5 border-primary/20">
            <Activity className="h-4 w-4" />
            <AlertDescription className="text-base font-medium">{humorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Total Tests
              </CardDescription>
              <CardTitle className="text-3xl">{totalTests}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                {successRate >= 70 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                Success Rate
              </CardDescription>
              <CardTitle
                className={`text-3xl ${successRate >= 70 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
              >
                {successRate}%
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Avg Response Time
              </CardDescription>
              <CardTitle className="text-3xl">{avgResponseTime}ms</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <BugIcon className="h-4 w-4" />
                Total Bugs
              </CardDescription>
              <CardTitle className="text-3xl">{bugs.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Test Results Distribution</CardTitle>
              <CardDescription>Passed vs Failed tests</CardDescription>
            </CardHeader>
            <CardContent>
              {executions.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No data yet. Start testing some APIs!
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={getStatusDistribution()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getStatusDistribution().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Response Time Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Response Time Trend</CardTitle>
              <CardDescription>Last 10 test executions</CardDescription>
            </CardHeader>
            <CardContent>
              {executions.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No data yet. Start testing some APIs!
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={getResponseTimeData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="time" stroke="hsl(var(--chart-1))" name="Response Time (ms)" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Bug Severity */}
          <Card>
            <CardHeader>
              <CardTitle>Bug Severity Distribution</CardTitle>
              <CardDescription>Breakdown by severity level</CardDescription>
            </CardHeader>
            <CardContent>
              {bugs.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No bugs reported yet. Either you're amazing or not testing hard enough.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getBugSeverityData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="hsl(var(--chart-2))" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Bug Status */}
          <Card>
            <CardHeader>
              <CardTitle>Bug Status Overview</CardTitle>
              <CardDescription>Current state of reported bugs</CardDescription>
            </CardHeader>
            <CardContent>
              {bugs.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground">No bugs reported yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={getBugStatusData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getBugStatusData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>The platypus's observations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {avgResponseTime < 200 && executions.length > 0 && (
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Lightning Fast Responses</p>
                    <p className="text-sm text-muted-foreground">
                      Average response time under 200ms. These APIs are well-optimized!
                    </p>
                  </div>
                </div>
              )}
              {avgResponseTime > 1000 && executions.length > 0 && (
                <div className="flex items-start gap-3">
                  <TrendingDown className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Slow Response Times</p>
                    <p className="text-sm text-muted-foreground">
                      Average response time over 1 second. Consider caching or optimization.
                    </p>
                  </div>
                </div>
              )}
              {bugs.filter((b) => b.severity === "critical").length > 0 && (
                <div className="flex items-start gap-3">
                  <BugIcon className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Critical Bugs Detected</p>
                    <p className="text-sm text-muted-foreground">
                      You have {bugs.filter((b) => b.severity === "critical").length} critical bug(s). The platypus
                      suggests addressing these immediately.
                    </p>
                  </div>
                </div>
              )}
              {executions.length === 0 && bugs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Start testing APIs and reporting bugs to see insights here.</p>
                  <p className="text-sm mt-2">The platypus is ready when you are.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
