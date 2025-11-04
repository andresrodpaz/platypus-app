"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, CheckCircle2, XCircle, Clock, Zap } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface TestRequest {
  id: string
  name: string
  url: string
  method: string
  body?: string
}

interface TestResult {
  requestId: string
  status: "pending" | "running" | "passed" | "failed"
  statusCode?: number
  responseTime?: number
  error?: string
}

export default function RunSuitePage() {
  const params = useParams()
  const suiteId = params.id as string
  const [suiteName, setSuiteName] = useState("")
  const [requests, setRequests] = useState<TestRequest[]>([])
  const [results, setResults] = useState<Record<string, TestResult>>({})
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    loadSuite()
  }, [suiteId])

  const loadSuite = async () => {
    try {
      const { data: suite } = await supabase.from("test_suites").select("*").eq("id", suiteId).single()

      setSuiteName(suite?.name || "")

      const { data: requestsData } = await supabase
        .from("test_requests")
        .select("*")
        .eq("suite_id", suiteId)
        .order("order_index")

      setRequests(requestsData || [])

      const initialResults: Record<string, TestResult> = {}
      requestsData?.forEach((req) => {
        initialResults[req.id] = { requestId: req.id, status: "pending" }
      })
      setResults(initialResults)
    } catch (error) {
      console.error("Failed to load suite:", error)
    }
  }

  const runSuite = async () => {
    setIsRunning(true)
    setProgress(0)

    const totalRequests = requests.length
    let completedRequests = 0

    for (const request of requests) {
      setResults((prev) => ({
        ...prev,
        [request.id]: { ...prev[request.id], status: "running" },
      }))

      try {
        const startTime = performance.now()
        const response = await fetch(request.url, {
          method: request.method,
          headers: {
            "Content-Type": "application/json",
          },
          body: request.body || undefined,
        })
        const endTime = performance.now()

        const passed = response.ok
        setResults((prev) => ({
          ...prev,
          [request.id]: {
            requestId: request.id,
            status: passed ? "passed" : "failed",
            statusCode: response.status,
            responseTime: Math.round(endTime - startTime),
          },
        }))
      } catch (error) {
        setResults((prev) => ({
          ...prev,
          [request.id]: {
            requestId: request.id,
            status: "failed",
            error: error instanceof Error ? error.message : "Request failed",
          },
        }))
      }

      completedRequests++
      setProgress((completedRequests / totalRequests) * 100)
    }

    setIsRunning(false)

    const passedCount = Object.values(results).filter((r) => r.status === "passed").length
    const failedCount = Object.values(results).filter((r) => r.status === "failed").length

    toast({
      title: "Suite execution complete",
      description: `The platypus ran ${totalRequests} tests: ${passedCount} passed, ${failedCount} failed`,
    })
  }

  const passedCount = Object.values(results).filter((r) => r.status === "passed").length
  const failedCount = Object.values(results).filter((r) => r.status === "failed").length
  const avgResponseTime =
    Object.values(results)
      .filter((r) => r.responseTime)
      .reduce((sum, r) => sum + (r.responseTime || 0), 0) / (passedCount + failedCount || 1)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/suites")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{suiteName}</h1>
            <p className="text-muted-foreground">Run your test suite and view results</p>
          </div>
        </div>
        <Button onClick={runSuite} disabled={isRunning || requests.length === 0}>
          <Play className="mr-2 h-4 w-4" />
          {isRunning ? "Running..." : "Run Suite"}
        </Button>
      </div>

      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Execution Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{passedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{failedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
          <CardDescription>Individual request execution results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {requests.map((request, index) => {
            const result = results[request.id]
            return (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{request.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {request.method} {request.url}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {result?.responseTime && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {result.responseTime}ms
                    </div>
                  )}
                  {result?.statusCode && <Badge variant="outline">{result.statusCode}</Badge>}
                  {result?.status === "pending" && <Badge variant="secondary">Pending</Badge>}
                  {result?.status === "running" && <Badge variant="secondary">Running...</Badge>}
                  {result?.status === "passed" && (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Passed
                    </Badge>
                  )}
                  {result?.status === "failed" && (
                    <Badge variant="destructive">
                      <XCircle className="mr-1 h-3 w-3" />
                      Failed
                    </Badge>
                  )}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {!isRunning && (passedCount > 0 || failedCount > 0) && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-6xl">🦦</div>
              <p className="text-lg font-medium">
                {failedCount === 0
                  ? "Perfect score! The platypus is impressed."
                  : failedCount > passedCount
                    ? "More failures than passes. The platypus is concerned."
                    : "Not bad! The platypus has seen worse."}
              </p>
              <p className="text-sm text-muted-foreground">Average response time: {Math.round(avgResponseTime)}ms</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
