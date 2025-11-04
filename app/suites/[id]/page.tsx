"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, GripVertical, ArrowLeft, Play } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { AssertionBuilder } from "@/components/assertion-builder"
import type { Assertion } from "@/lib/assertions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TestRequest {
  id?: string
  name: string
  url: string
  method: string
  headers: Record<string, string>
  body: string
  order_index: number
  assertions?: Assertion[]
}

export default function SuiteEditorPage() {
  const params = useParams()
  const suiteId = params.id as string
  const [suiteName, setSuiteName] = useState("")
  const [suiteDescription, setSuiteDescription] = useState("")
  const [requests, setRequests] = useState<TestRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    loadSuite()
  }, [suiteId])

  const loadSuite = async () => {
    try {
      const { data: suite, error: suiteError } = await supabase
        .from("test_suites")
        .select("*")
        .eq("id", suiteId)
        .single()

      if (suiteError) throw suiteError

      setSuiteName(suite.name)
      setSuiteDescription(suite.description || "")

      const { data: requestsData, error: requestsError } = await supabase
        .from("test_requests")
        .select("*, assertions(*)")
        .eq("suite_id", suiteId)
        .order("order_index")

      if (requestsError) throw requestsError

      setRequests(
        requestsData.map((r) => ({
          ...r,
          headers: r.headers || {},
          assertions: r.assertions || [],
        })),
      )
    } catch (error) {
      console.error("Failed to load suite:", error)
      toast({
        title: "Error loading suite",
        description: "The platypus couldn't find your suite",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addRequest = () => {
    setRequests([
      ...requests,
      {
        name: `Request ${requests.length + 1}`,
        url: "",
        method: "GET",
        headers: {},
        body: "",
        order_index: requests.length,
        assertions: [],
      },
    ])
  }

  const updateRequest = (index: number, field: keyof TestRequest, value: any) => {
    const updated = [...requests]
    updated[index] = { ...updated[index], [field]: value }
    setRequests(updated)
  }

  const removeRequest = (index: number) => {
    setRequests(requests.filter((_, i) => i !== index))
  }

  const saveSuite = async () => {
    setIsSaving(true)
    try {
      const { error: suiteError } = await supabase
        .from("test_suites")
        .update({
          name: suiteName,
          description: suiteDescription,
        })
        .eq("id", suiteId)

      if (suiteError) throw suiteError

      await supabase.from("test_requests").delete().eq("suite_id", suiteId)

      if (requests.length > 0) {
        for (const [index, r] of requests.entries()) {
          const { data: insertedRequest, error: requestError } = await supabase
            .from("test_requests")
            .insert({
              suite_id: suiteId,
              name: r.name,
              url: r.url,
              method: r.method,
              headers: r.headers,
              body: r.body,
              order_index: index,
            })
            .select()
            .single()

          if (requestError) throw requestError

          // Insert assertions for this request
          if (r.assertions && r.assertions.length > 0) {
            const { error: assertionsError } = await supabase.from("assertions").insert(
              r.assertions.map((a) => ({
                request_id: insertedRequest.id,
                type: a.type,
                expected_value: a.expected_value,
                operator: a.operator,
                field_path: a.field_path,
              })),
            )

            if (assertionsError) throw assertionsError
          }
        }
      }

      toast({
        title: "Suite saved",
        description: "The platypus stored your changes safely",
      })
    } catch (error) {
      console.error("Failed to save suite:", error)
      toast({
        title: "Save failed",
        description: "The platypus dropped your changes",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading suite...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/suites")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Test Suite</h1>
            <p className="text-muted-foreground">Configure your API test collection</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/suites/${suiteId}/run`)}>
            <Play className="mr-2 h-4 w-4" />
            Run Suite
          </Button>
          <Button onClick={saveSuite} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suite Information</CardTitle>
          <CardDescription>Basic details about your test suite</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="suite-name">Suite Name</Label>
            <Input id="suite-name" value={suiteName} onChange={(e) => setSuiteName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="suite-description">Description</Label>
            <Textarea
              id="suite-description"
              value={suiteDescription}
              onChange={(e) => setSuiteDescription(e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Requests ({requests.length})</h2>
        <Button onClick={addRequest}>
          <Plus className="mr-2 h-4 w-4" />
          Add Request
        </Button>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">🦦</div>
            <h3 className="text-lg font-semibold mb-2">No requests yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Add your first API request to this suite</p>
            <Button onClick={addRequest}>
              <Plus className="mr-2 h-4 w-4" />
              Add Request
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                  <div className="flex-1">
                    <Input
                      value={request.name}
                      onChange={(e) => updateRequest(index, "name", e.target.value)}
                      placeholder="Request name"
                      className="font-semibold"
                    />
                  </div>
                  <Badge variant="outline">{index + 1}</Badge>
                  <Button variant="ghost" size="icon" onClick={() => removeRequest(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="request" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="request">Request</TabsTrigger>
                    <TabsTrigger value="assertions">
                      Assertions{" "}
                      {request.assertions && request.assertions.length > 0 && `(${request.assertions.length})`}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="request" className="space-y-4 mt-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-1">
                        <Label>Method</Label>
                        <Select value={request.method} onValueChange={(value) => updateRequest(index, "method", value)}>
                          <SelectTrigger>
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
                      <div className="col-span-3">
                        <Label>URL</Label>
                        <Input
                          value={request.url}
                          onChange={(e) => updateRequest(index, "url", e.target.value)}
                          placeholder="https://api.example.com/endpoint"
                        />
                      </div>
                    </div>
                    {(request.method === "POST" || request.method === "PUT" || request.method === "PATCH") && (
                      <div>
                        <Label>Request Body (JSON)</Label>
                        <Textarea
                          value={request.body}
                          onChange={(e) => updateRequest(index, "body", e.target.value)}
                          placeholder='{"key": "value"}'
                          rows={4}
                          className="font-mono text-sm"
                        />
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="assertions" className="mt-4">
                    <AssertionBuilder
                      assertions={request.assertions || []}
                      onChange={(assertions) => updateRequest(index, "assertions", assertions)}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
