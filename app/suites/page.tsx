"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Play, Download, Upload, Share2, Trash2, Edit } from "lucide-react"
import { CreateSuiteDialog } from "@/components/create-suite-dialog"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface TestSuite {
  id: string
  name: string
  description: string
  is_shared: boolean
  created_at: string
  request_count?: number
}

export default function SuitesPage() {
  const [suites, setSuites] = useState<TestSuite[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    loadSuites()
  }, [])

  const loadSuites = async () => {
    try {
      const { data, error } = await supabase
        .from("test_suites")
        .select(
          `
          *,
          test_requests(count)
        `,
        )
        .order("created_at", { ascending: false })

      if (error) throw error

      const suitesWithCount = data?.map((suite) => ({
        ...suite,
        request_count: suite.test_requests?.[0]?.count || 0,
      }))

      setSuites(suitesWithCount || [])
    } catch (error) {
      console.error("Failed to load suites:", error)
      toast({
        title: "Error loading suites",
        description: "The platypus couldn't fetch your test suites",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportSuite = async (suiteId: string) => {
    try {
      const { data: suite } = await supabase.from("test_suites").select("*").eq("id", suiteId).single()

      const { data: requests } = await supabase.from("test_requests").select("*").eq("suite_id", suiteId)

      const exportData = {
        suite,
        requests,
        exported_at: new Date().toISOString(),
        version: "1.0.0",
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${suite?.name.replace(/\s+/g, "-")}-suite.json`
      a.click()

      toast({
        title: "Suite exported",
        description: "The platypus packed your suite into a JSON file",
      })
    } catch (error) {
      console.error("Export failed:", error)
      toast({
        title: "Export failed",
        description: "The platypus dropped the JSON file",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSuite = async (suiteId: string) => {
    if (!confirm("Are you sure? The platypus will miss this suite.")) return

    try {
      const { error } = await supabase.from("test_suites").delete().eq("id", suiteId)

      if (error) throw error

      setSuites(suites.filter((s) => s.id !== suiteId))
      toast({
        title: "Suite deleted",
        description: "The platypus said goodbye to your test suite",
      })
    } catch (error) {
      console.error("Delete failed:", error)
      toast({
        title: "Delete failed",
        description: "The platypus couldn't delete the suite",
        variant: "destructive",
      })
    }
  }

  const handleRunSuite = (suiteId: string) => {
    router.push(`/suites/${suiteId}/run`)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading test suites...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Test Suites</h1>
          <p className="text-muted-foreground">Organize and run multiple API tests together</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => document.getElementById("import-input")?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <input
            id="import-input"
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                const reader = new FileReader()
                reader.onload = async (event) => {
                  try {
                    const data = JSON.parse(event.target?.result as string)
                    if (data.suite) {
                      const { data: newSuite, error: suiteError } = await supabase
                        .from("test_suites")
                        .insert({
                          user_id: "00000000-0000-0000-0000-000000000000",
                          name: data.suite.name,
                          description: data.suite.description,
                          is_shared: data.suite.is_shared,
                        })
                        .select()
                        .single()

                      if (suiteError) throw suiteError

                      // Insert requests if they exist
                      if (data.requests && data.requests.length > 0) {
                        const requestsToInsert = data.requests.map((req: any) => ({
                          suite_id: newSuite.id,
                          url: req.url,
                          method: req.method,
                          headers: req.headers,
                          body: req.body,
                          assertions: req.assertions,
                        }))

                        const { error: requestsError } = await supabase.from("test_requests").insert(requestsToInsert)

                        if (requestsError) throw requestsError
                      }

                      toast({
                        title: "Import successful",
                        description: `The platypus imported "${newSuite.name}" with ${data.requests?.length || 0} requests`,
                      })
                      loadSuites()
                    }
                  } catch (error) {
                    console.error("Import failed:", error)
                    toast({
                      title: "Import failed",
                      description: "The platypus couldn't read that JSON",
                      variant: "destructive",
                    })
                  }
                }
                reader.readAsText(file)
              }
            }}
          />
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Suite
          </Button>
        </div>
      </div>

      {suites.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">🦦</div>
            <h3 className="text-lg font-semibold mb-2">No test suites yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The platypus is waiting for you to create your first test suite
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Suite
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {suites.map((suite) => (
            <Card key={suite.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{suite.name}</CardTitle>
                    <CardDescription className="mt-1">{suite.description || "No description"}</CardDescription>
                  </div>
                  {suite.is_shared && (
                    <Badge variant="secondary" className="ml-2">
                      <Share2 className="h-3 w-3 mr-1" />
                      Shared
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Requests</span>
                  <span className="font-medium">{suite.request_count || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">{new Date(suite.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => handleRunSuite(suite.id)}>
                    <Play className="mr-2 h-4 w-4" />
                    Run
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => router.push(`/suites/${suite.id}`)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="flex-1" onClick={() => handleExportSuite(suite.id)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 text-destructive"
                    onClick={() => handleDeleteSuite(suite.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateSuiteDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onSuccess={loadSuites} />
    </div>
  )
}
