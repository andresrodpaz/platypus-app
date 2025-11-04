"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  History,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { storage } from "@/lib/storage"
import { generateHumorousComment } from "@/lib/humor-engine"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { ApiRequest } from "@/lib/storage"

interface PublicAPI {
  name: string
  description: string
  url: string
  method: string
  category: string
  requiresAuth: boolean
  documentation?: string
  sampleBody?: string
}

export default function PlaygroundPage() {
  const [url, setUrl] = useState("")
  const [method, setMethod] = useState("GET")
  const [body, setBody] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ApiRequest | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [aiAnalyzing, setAiAnalyzing] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [publicApis, setPublicApis] = useState<PublicAPI[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [categories, setCategories] = useState<string[]>([])
  const [selectedMethod, setSelectedMethod] = useState<string>("all")
  const [methods, setMethods] = useState<string[]>([])
  const [showAllApis, setShowAllApis] = useState(false)
  const [requestHistory, setRequestHistory] = useState<ApiRequest[]>([])

  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    fetch("/api/public-apis")
      .then((res) => res.json())
      .then((data) => {
        setPublicApis(data.apis)
        setCategories(["all", ...data.categories])
        const availableMethods = Object.keys(data.methods || {})
        setMethods(["all", ...availableMethods])
      })
      .catch((err) => console.error("Failed to load public APIs:", err))

    setRequestHistory(storage.getRequests())
  }, [])

  const filteredApis = publicApis.filter((api) => {
    const categoryMatch = selectedCategory === "all" || api.category === selectedCategory
    const methodMatch = selectedMethod === "all" || api.method === selectedMethod
    return categoryMatch && methodMatch
  })

  const displayedApis = showAllApis ? filteredApis : filteredApis.slice(0, 12)

  const handlePresetSelect = (preset: PublicAPI) => {
    setUrl(preset.url)
    setMethod(preset.method)
    setBody(preset.sampleBody || "")
    setResult(null)
    setError(null)
    setAiAnalysis(null)
  }

  const copySampleBody = (sampleBody: string) => {
    navigator.clipboard.writeText(sampleBody)
  }

  const handleSendRequest = async () => {
    if (!url) {
      setError("Please enter a URL")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)
    setAiAnalysis(null)

    const startTime = performance.now()

    try {
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(url.includes("icanhazdadjoke.com") && { Accept: "application/json" }),
        },
      }

      if (method !== "GET" && body) {
        options.body = body
      }

      const response = await fetch(url, options)
      const endTime = performance.now()
      const responseTime = Math.round(endTime - startTime)

      let responseData
      const contentType = response.headers.get("content-type")
      if (contentType?.includes("application/json")) {
        responseData = await response.json()
      } else {
        responseData = await response.text()
      }

      const humor = generateHumorousComment(response.status, responseTime)

      const request: ApiRequest = {
        id: Date.now().toString(),
        url,
        method,
        status: response.status,
        responseTime,
        timestamp: Date.now(),
        response: responseData,
        humorousComment: `${humor.emoji} ${humor.comment}`,
      }

      setResult(request)
      storage.saveRequest(request)
      setRequestHistory([request, ...requestHistory.slice(0, 9)])

      try {
        // Also add user_id for the public demo user
        const { error: dbError } = await supabase.from("test_executions").insert({
          suite_id: null, // Playground tests don't belong to a suite
          user_id: "00000000-0000-0000-0000-000000000000", // Public demo user
          status: response.status >= 200 && response.status < 300 ? "completed" : "failed",
          total_requests: 1,
          passed_requests: response.status >= 200 && response.status < 300 ? 1 : 0,
          failed_requests: response.status >= 200 && response.status < 300 ? 0 : 1,
          avg_response_time: responseTime,
          started_at: new Date(startTime).toISOString(),
          completed_at: new Date(endTime).toISOString(),
        })

        if (dbError) {
          console.error("Failed to save to database:", dbError.message)
          toast({
            title: "Database Error",
            description: "Test executed successfully but couldn't save to database. Check console for details.",
            variant: "destructive",
          })
        } else {
          console.log("Test execution saved to database successfully")
        }
      } catch (dbError) {
        console.error("Database error:", dbError)
      }

      getAIAnalysis(response.status, responseTime, url, method, responseData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send request")
    } finally {
      setLoading(false)
    }
  }

  const getAIAnalysis = async (
    statusCode: number,
    responseTime: number,
    apiUrl: string,
    apiMethod: string,
    responseBody: any,
  ) => {
    setAiAnalyzing(true)
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          statusCode,
          responseTime,
          url: apiUrl,
          method: apiMethod,
          responseBody,
        }),
      })

      if (response.ok) {
        const analysis = await response.json()
        setAiAnalysis(analysis)
      }
    } catch (err) {
      console.error("AI analysis failed:", err)
    } finally {
      setAiAnalyzing(false)
    }
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-green-600 dark:text-green-400"
    if (status >= 400 && status < 500) return "text-yellow-600 dark:text-yellow-400"
    if (status >= 500) return "text-red-600 dark:text-red-400"
    return "text-blue-600 dark:text-blue-400"
  }

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300) return <CheckCircle2 className="h-5 w-5" />
    if (status >= 400 && status < 500) return <AlertCircle className="h-5 w-5" />
    if (status >= 500) return <XCircle className="h-5 w-5" />
    return <CheckCircle2 className="h-5 w-5" />
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
      case "POST":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
      case "PUT":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"
      case "PATCH":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
      case "DELETE":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">API Playground</h1>
          <p className="text-muted-foreground text-lg">
            Test {publicApis.length}+ public APIs with GET, POST, PUT, PATCH, DELETE and get AI-powered feedback
          </p>
        </div>

        {/* Preset APIs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle>Public APIs - Try These</CardTitle>
                <CardDescription>
                  Showing {displayedApis.length} of {filteredApis.length} APIs
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    {methods.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m === "all" ? "All Methods" : m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat === "all" ? "All Categories" : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
              {displayedApis.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  className="h-auto py-3 px-4 flex flex-col items-start gap-1 bg-transparent"
                  onClick={() => handlePresetSelect(preset)}
                >
                  <div className="font-semibold text-sm">{preset.name}</div>
                  <div className="text-xs text-muted-foreground text-left">{preset.description}</div>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className={`text-xs ${getMethodColor(preset.method)}`}>
                      {preset.method}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {preset.category}
                    </Badge>
                  </div>
                </Button>
              ))}
            </div>
            {filteredApis.length > 12 && (
              <div className="flex justify-center pt-2">
                <Button variant="ghost" onClick={() => setShowAllApis(!showAllApis)} className="gap-2">
                  {showAllApis ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Show All {filteredApis.length} APIs
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Request Form */}
        <Card>
          <CardHeader>
            <CardTitle>Configure Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="w-32">
                <Label htmlFor="method">Method</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger id="method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  placeholder="https://api.example.com/endpoint"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendRequest()}
                />
              </div>
            </div>

            {method !== "GET" && (
              <div>
                <Label htmlFor="body">Request Body (JSON)</Label>
                <Textarea
                  id="body"
                  placeholder='{"key": "value"}'
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>
            )}

            <Button onClick={handleSendRequest} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Request...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Request
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Result Display */}
        {result && (
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Response</CardTitle>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="gap-1">
                    <Clock className="h-3 w-3" />
                    {result.responseTime}ms
                  </Badge>
                  <Badge className={`gap-1 ${getStatusColor(result.status)}`} variant="outline">
                    {getStatusIcon(result.status)}
                    {result.status}
                  </Badge>
                </div>
              </div>
              {result.humorousComment && (
                <Alert className="mt-4 bg-primary/5 border-primary/20">
                  <AlertDescription className="text-base font-medium">{result.humorousComment}</AlertDescription>
                </Alert>
              )}
              {aiAnalyzing && (
                <Alert className="mt-4 bg-chart-1/10 border-chart-1/30">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <AlertDescription>The platypus AI is analyzing your response...</AlertDescription>
                </Alert>
              )}
              {aiAnalysis && !aiAnalyzing && (
                <Alert className="mt-4 bg-chart-1/10 border-chart-1/30">
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="text-base font-medium">{aiAnalysis.comment}</p>
                      <p className="text-xs text-muted-foreground">
                        {aiAnalysis.emoji} Personality: {aiAnalysis.personality}
                        {aiAnalysis.usingFallback && " (Using fallback - add GROK_XAI_API_KEY to .env for AI analysis)"}
                        {aiAnalysis.error && ` | Error: ${aiAnalysis.error}`}
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="formatted">
                <TabsList>
                  <TabsTrigger value="formatted">Formatted</TabsTrigger>
                  <TabsTrigger value="raw">Raw</TabsTrigger>
                </TabsList>
                <TabsContent value="formatted" className="mt-4">
                  <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-sm">
                    <code>{JSON.stringify(result.response, null, 2)}</code>
                  </pre>
                </TabsContent>
                <TabsContent value="raw" className="mt-4">
                  <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-sm">
                    <code>{JSON.stringify(result.response)}</code>
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Request History Section */}
        {requestHistory.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <History className="h-5 w-5" />
                <CardTitle>Recent Requests</CardTitle>
              </div>
              <CardDescription>Your last {requestHistory.length} API requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {requestHistory.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => {
                      setUrl(req.url)
                      setMethod(req.method)
                      setResult(req)
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Badge variant="outline" className={`text-xs ${getMethodColor(req.method)}`}>
                        {req.method}
                      </Badge>
                      <span className="text-sm truncate flex-1">{req.url}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        {req.responseTime}ms
                      </Badge>
                      <Badge className={`gap-1 ${getStatusColor(req.status)}`} variant="outline">
                        {req.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(req.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
