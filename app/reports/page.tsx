"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

interface ExecutionSummary {
  id: string
  suite_id: string
  status: string
  total_requests: number
  passed_requests: number
  failed_requests: number
  avg_response_time: number
  started_at: string
  completed_at: string
  test_suites: {
    name: string
  }
}

export default function ReportsPage() {
  const [executions, setExecutions] = useState<ExecutionSummary[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState("7")
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    loadExecutions()

    const executionsChannel = supabase
      .channel("test_executions_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "test_executions",
        },
        (payload) => {
          console.log("New test execution:", payload)
          loadSingleExecution(payload.new.id)
          toast({
            title: "New test execution",
            description: "A test suite just completed running",
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(executionsChannel)
    }
  }, [selectedPeriod])

  const loadSingleExecution = async (executionId: string) => {
    try {
      const { data, error } = await supabase
        .from("test_executions")
        .select("*, test_suites(name)")
        .eq("id", executionId)
        .single()

      if (error) throw error
      if (data) {
        setExecutions((prev) => [data as ExecutionSummary, ...prev])
      }
    } catch (error) {
      console.error("Failed to load execution:", error)
    }
  }

  const loadExecutions = async () => {
    try {
      const daysAgo = new Date()
      daysAgo.setDate(daysAgo.getDate() - Number.parseInt(selectedPeriod))

      const { data, error } = await supabase
        .from("test_executions")
        .select("*, test_suites(name)")
        .gte("started_at", daysAgo.toISOString())
        .order("started_at", { ascending: false })

      if (error) throw error
      setExecutions(data || [])
    } catch (error) {
      console.error("Failed to load executions:", error)
      toast({
        title: "Error loading reports",
        description: "The platypus couldn't fetch execution data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateHTMLReport = () => {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Platypus QA Lab - Test Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #333; }
    .header { text-align: center; margin-bottom: 40px; }
    .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .metric { display: inline-block; margin: 10px 20px; }
    .metric-label { font-size: 12px; color: #666; }
    .metric-value { font-size: 24px; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #333; color: white; }
    .passed { color: green; }
    .failed { color: red; }
    .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🦦 Platypus QA Lab</h1>
    <h2>Test Execution Report</h2>
    <p>Generated: ${new Date().toLocaleString()}</p>
  </div>
  
  <div class="summary">
    <h3>Summary</h3>
    <div class="metric">
      <div class="metric-label">Total Executions</div>
      <div class="metric-value">${executions.length}</div>
    </div>
    <div class="metric">
      <div class="metric-label">Total Tests</div>
      <div class="metric-value">${executions.reduce((sum, e) => sum + e.total_requests, 0)}</div>
    </div>
    <div class="metric">
      <div class="metric-label">Passed</div>
      <div class="metric-value passed">${executions.reduce((sum, e) => sum + e.passed_requests, 0)}</div>
    </div>
    <div class="metric">
      <div class="metric-label">Failed</div>
      <div class="metric-value failed">${executions.reduce((sum, e) => sum + e.failed_requests, 0)}</div>
    </div>
  </div>
  
  <h3>Execution Details</h3>
  <table>
    <thead>
      <tr>
        <th>Suite</th>
        <th>Date</th>
        <th>Total</th>
        <th>Passed</th>
        <th>Failed</th>
        <th>Avg Response Time</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${executions
        .map(
          (exec) => `
        <tr>
          <td>${exec.test_suites.name}</td>
          <td>${new Date(exec.started_at).toLocaleString()}</td>
          <td>${exec.total_requests}</td>
          <td class="passed">${exec.passed_requests}</td>
          <td class="failed">${exec.failed_requests}</td>
          <td>${Math.round(exec.avg_response_time || 0)}ms</td>
          <td>${exec.status}</td>
        </tr>
      `,
        )
        .join("")}
    </tbody>
  </table>
  
  <div class="footer">
    <p>The platypus has spoken. This report is certified accurate (probably).</p>
    <p>Platypus QA Lab - Making APIs testable since today</p>
  </div>
</body>
</html>
    `

    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `platypus-qa-report-${new Date().toISOString().split("T")[0]}.html`
    a.click()

    toast({
      title: "Report generated",
      description: "The platypus created your HTML report",
    })
  }

  const totalTests = executions.reduce((sum, e) => sum + e.total_requests, 0)
  const totalPassed = executions.reduce((sum, e) => sum + e.passed_requests, 0)
  const totalFailed = executions.reduce((sum, e) => sum + e.failed_requests, 0)
  const passRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0
  const avgResponseTime =
    executions.length > 0
      ? Math.round(executions.reduce((sum, e) => sum + (e.avg_response_time || 0), 0) / executions.length)
      : 0

  // Calculate trend (compare first half vs second half of period)
  const midpoint = Math.floor(executions.length / 2)
  const recentExecutions = executions.slice(0, midpoint)
  const olderExecutions = executions.slice(midpoint)

  const recentPassRate =
    recentExecutions.length > 0
      ? (recentExecutions.reduce((sum, e) => sum + e.passed_requests, 0) /
          recentExecutions.reduce((sum, e) => sum + e.total_requests, 0)) *
        100
      : 0

  const olderPassRate =
    olderExecutions.length > 0
      ? (olderExecutions.reduce((sum, e) => sum + e.passed_requests, 0) /
          olderExecutions.reduce((sum, e) => sum + e.total_requests, 0)) *
        100
      : 0

  const trend = recentPassRate - olderPassRate

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Test Reports</h1>
          <p className="text-muted-foreground">Comprehensive testing analytics and exports • Real-time updates 🔴</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateHTMLReport}>
            <Download className="mr-2 h-4 w-4" />
            Export HTML
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{executions.length}</div>
            <p className="text-xs text-muted-foreground">Test suite runs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            {trend > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : trend < 0 ? (
              <TrendingDown className="h-4 w-4 text-red-500" />
            ) : (
              <Minus className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{passRate}%</div>
            <p className="text-xs text-muted-foreground">
              {trend > 0 ? `+${trend.toFixed(1)}%` : trend < 0 ? `${trend.toFixed(1)}%` : "No change"} from previous
              period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests}</div>
            <p className="text-xs text-green-600">{totalPassed} passed</p>
            <p className="text-xs text-red-600">{totalFailed} failed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResponseTime}ms</div>
            <p className="text-xs text-muted-foreground">Across all tests</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Execution History</CardTitle>
          <CardDescription>Recent test suite executions</CardDescription>
        </CardHeader>
        <CardContent>
          {executions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🦦</div>
              <h3 className="text-lg font-semibold mb-2">No executions yet</h3>
              <p className="text-sm text-muted-foreground">Run some test suites to see reports here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {executions.map((execution) => (
                <div key={execution.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{execution.test_suites.name}</h4>
                    <p className="text-sm text-muted-foreground">{new Date(execution.started_at).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {execution.passed_requests}/{execution.total_requests} passed
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round(execution.avg_response_time || 0)}ms avg
                      </p>
                    </div>
                    <Badge variant={execution.status === "completed" ? "default" : "secondary"}>
                      {execution.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="text-6xl">🦦</div>
            <p className="text-lg font-medium">
              {passRate >= 90
                ? "Excellent work! The platypus is impressed."
                : passRate >= 70
                  ? "Not bad. The platypus has seen worse."
                  : "Room for improvement. The platypus believes in you."}
            </p>
            <p className="text-sm text-muted-foreground">
              Keep testing, keep improving. The platypus is always watching.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
