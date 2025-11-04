"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download, FileJson, FileCode, BookOpen, Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RequestDoc {
  id: string
  url: string
  method: string
  headers?: Record<string, string>
  body?: string
  description?: string
}

export default function DocsPage() {
  const [requests, setRequests] = useState<RequestDoc[]>([])
  const [selectedRequest, setSelectedRequest] = useState<RequestDoc | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      const { data, error } = await supabase.from("test_requests").select("*").limit(50)

      if (error) throw error

      const formattedRequests = (data || []).map((req: any) => ({
        id: req.id,
        url: req.url,
        method: req.method,
        headers: req.headers || {},
        body: req.body,
        description: `${req.method} ${req.url}`,
      }))

      setRequests(formattedRequests)
      if (formattedRequests.length > 0) {
        setSelectedRequest(formattedRequests[0])
      }
    } catch (error) {
      console.error("Failed to load requests:", error)
      toast({
        title: "Error loading requests",
        description: "The platypus couldn't fetch test requests",
        variant: "destructive",
      })
    }
  }

  const generateOpenAPI = () => {
    const openapi = {
      openapi: "3.0.0",
      info: {
        title: "Platypus QA Lab API Collection",
        version: "1.0.0",
        description: "Auto-generated API documentation from your test requests. The platypus approves.",
      },
      servers: [
        {
          url: "https://api.example.com",
          description: "Production server",
        },
      ],
      paths: {} as Record<string, any>,
    }

    requests.forEach((req) => {
      try {
        const url = new URL(req.url)
        const path = url.pathname
        const method = req.method.toLowerCase()

        if (!openapi.paths[path]) {
          openapi.paths[path] = {}
        }

        openapi.paths[path][method] = {
          summary: req.description || `${req.method} ${path}`,
          description: `Endpoint tested in Platypus QA Lab`,
          parameters: [],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                  },
                },
              },
            },
          },
        }

        if (req.body) {
          openapi.paths[path][method].requestBody = {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  example: JSON.parse(req.body),
                },
              },
            },
          }
        }
      } catch (error) {
        console.error("Error parsing request:", error)
      }
    })

    return openapi
  }

  const generatePostmanCollection = () => {
    return {
      info: {
        name: "Platypus QA Lab Collection",
        description: "Exported from Platypus QA Lab. Test with confidence, debug with humor.",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
      },
      item: requests.map((req) => ({
        name: req.description || `${req.method} ${req.url}`,
        request: {
          method: req.method,
          header: Object.entries(req.headers || {}).map(([key, value]) => ({
            key,
            value,
          })),
          body: req.body
            ? {
                mode: "raw",
                raw: req.body,
                options: {
                  raw: {
                    language: "json",
                  },
                },
              }
            : undefined,
          url: {
            raw: req.url,
            protocol: new URL(req.url).protocol.replace(":", ""),
            host: new URL(req.url).hostname.split("."),
            path: new URL(req.url).pathname.split("/").filter(Boolean),
          },
        },
      })),
    }
  }

  const downloadJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    toast({
      title: "Downloaded",
      description: `Successfully downloaded ${filename}! The platypus is proud of your documentation skills.`,
    })
  }

  const generateCodeExample = (request: RequestDoc, language: string) => {
    const headers = request.headers || {}
    const body = request.body

    switch (language) {
      case "javascript":
        return `// JavaScript (Fetch API)
const response = await fetch('${request.url}', {
  method: '${request.method}',
  headers: ${JSON.stringify(headers, null, 2)},${
    body
      ? `
  body: JSON.stringify(${body})`
      : ""
  }
});

const data = await response.json();
console.log(data);`

      case "python":
        return `# Python (requests library)
import requests
import json

response = requests.${request.method.toLowerCase()}(
    '${request.url}',
    headers=${JSON.stringify(headers, null, 4).replace(/"/g, "'")},${
      body
        ? `
    json=${body}`
        : ""
    }
)

data = response.json()
print(data)`

      case "curl":
        const curlHeaders = Object.entries(headers)
          .map(([key, value]) => `-H "${key}: ${value}"`)
          .join(" \\\n  ")
        return `# cURL
curl -X ${request.method} '${request.url}' \\
  ${curlHeaders}${
    body
      ? ` \\
  -d '${body}'`
      : ""
  }`

      case "go":
        return `// Go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
)

func main() {
    ${body ? `body := []byte(\`${body}\`)` : ""}
    req, _ := http.NewRequest("${request.method}", "${request.url}", ${body ? "bytes.NewBuffer(body)" : "nil"})
    ${Object.entries(headers)
      .map(([key, value]) => `req.Header.Set("${key}", "${value}")`)
      .join("\n    ")}
    
    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()
    
    var result map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&result)
    fmt.Println(result)
}`

      default:
        return "// Select a language to see code example"
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(label)
    setTimeout(() => setCopiedCode(null), 2000)
    toast({
      title: "Copied",
      description: "Code copied to clipboard! The platypus salutes your efficiency.",
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">API Documentation Generator</h1>
          <p className="text-muted-foreground mt-2">
            Auto-generate docs from your test requests. Because documentation shouldn't be painful.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              OpenAPI/Swagger
            </CardTitle>
            <CardDescription>Industry-standard API specification</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => downloadJSON(generateOpenAPI(), "openapi-spec.json")}
              className="w-full"
              disabled={requests.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export OpenAPI 3.0
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              Postman Collection
            </CardTitle>
            <CardDescription>Import directly into Postman</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => downloadJSON(generatePostmanCollection(), "postman-collection.json")}
              className="w-full"
              disabled={requests.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Postman
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Code Examples
            </CardTitle>
            <CardDescription>Ready-to-use code snippets</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {requests.length} endpoint{requests.length !== 1 ? "s" : ""} documented
            </p>
          </CardContent>
        </Card>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No API requests yet</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Test some APIs in the Playground first. The platypus will then generate beautiful documentation for you.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Endpoints</CardTitle>
              <CardDescription>Select an endpoint to view code examples</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {requests.map((req) => (
                <button
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedRequest?.id === req.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={req.method === "GET" ? "default" : "secondary"}>{req.method}</Badge>
                  </div>
                  <p className="text-sm font-mono truncate">{req.url}</p>
                </button>
              ))}
            </CardContent>
          </Card>

          {selectedRequest && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Badge>{selectedRequest.method}</Badge>
                      <span className="font-mono text-base">{selectedRequest.url}</span>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {selectedRequest.description || "No description provided"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="javascript" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                    <TabsTrigger value="go">Go</TabsTrigger>
                  </TabsList>
                  {["javascript", "python", "curl", "go"].map((lang) => (
                    <TabsContent key={lang} value={lang} className="mt-4">
                      <div className="relative">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute right-2 top-2 z-10"
                          onClick={() => copyToClipboard(generateCodeExample(selectedRequest, lang), lang)}
                        >
                          {copiedCode === lang ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                          <code className="text-sm">{generateCodeExample(selectedRequest, lang)}</code>
                        </pre>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
