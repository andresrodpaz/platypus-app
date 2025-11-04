"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Power, PowerOff, Edit, Trash2, Copy } from "lucide-react"
import { CreateMockDialog } from "@/components/create-mock-dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface ApiMock {
  id: string
  name: string
  path: string
  method: string
  status_code: number
  response_body: string
  latency_ms: number
  is_active: boolean
  created_at: string
}

export default function MocksPage() {
  const [mocks, setMocks] = useState<ApiMock[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingMock, setEditingMock] = useState<ApiMock | null>(null)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    loadMocks()
  }, [])

  const loadMocks = async () => {
    try {
      const { data, error } = await supabase.from("api_mocks").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setMocks(data || [])
    } catch (error) {
      console.error("Failed to load mocks:", error)
      toast({
        title: "Error loading mocks",
        description: "The platypus couldn't fetch your API mocks",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMockStatus = async (mockId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("api_mocks").update({ is_active: !currentStatus }).eq("id", mockId)

      if (error) throw error

      setMocks(mocks.map((m) => (m.id === mockId ? { ...m, is_active: !currentStatus } : m)))

      toast({
        title: currentStatus ? "Mock disabled" : "Mock enabled",
        description: currentStatus
          ? "The platypus turned off your mock server"
          : "The platypus activated your mock server",
      })
    } catch (error) {
      console.error("Failed to toggle mock:", error)
      toast({
        title: "Toggle failed",
        description: "The platypus couldn't change the mock status",
        variant: "destructive",
      })
    }
  }

  const deleteMock = async (mockId: string) => {
    if (!confirm("Delete this mock? The platypus will miss it.")) return

    try {
      const { error } = await supabase.from("api_mocks").delete().eq("id", mockId)

      if (error) throw error

      setMocks(mocks.filter((m) => m.id !== mockId))
      toast({
        title: "Mock deleted",
        description: "The platypus removed your mock endpoint",
      })
    } catch (error) {
      console.error("Failed to delete mock:", error)
      toast({
        title: "Delete failed",
        description: "The platypus couldn't delete the mock",
        variant: "destructive",
      })
    }
  }

  const copyMockUrl = (mock: ApiMock) => {
    const mockUrl = `${window.location.origin}/api/mock${mock.path}`
    navigator.clipboard.writeText(mockUrl)
    toast({
      title: "URL copied",
      description: "The platypus copied the mock URL to your clipboard",
    })
  }

  const activeMocks = mocks.filter((m) => m.is_active).length

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading mocks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Mocking</h1>
          <p className="text-muted-foreground">Create mock API endpoints for testing</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Mock
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mocks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mocks.length}</div>
            <p className="text-xs text-muted-foreground">Mock endpoints created</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Mocks</CardTitle>
            <Power className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{activeMocks}</div>
            <p className="text-xs text-muted-foreground">Currently responding</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Mocks</CardTitle>
            <PowerOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mocks.length - activeMocks}</div>
            <p className="text-xs text-muted-foreground">Disabled endpoints</p>
          </CardContent>
        </Card>
      </div>

      {mocks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">🦦</div>
            <h3 className="text-lg font-semibold mb-2">No mocks yet</h3>
            <p className="text-sm text-muted-foreground mb-4">The platypus is ready to create fake APIs for you</p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Mock
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {mocks.map((mock) => (
            <Card key={mock.id} className={mock.is_active ? "border-green-500/50" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{mock.name}</CardTitle>
                      {mock.is_active ? (
                        <Badge variant="default" className="bg-green-500">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                    <CardDescription className="font-mono text-sm">
                      {mock.method} /api/mock{mock.path}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => toggleMockStatus(mock.id, mock.is_active)}
                      title={mock.is_active ? "Disable mock" : "Enable mock"}
                    >
                      {mock.is_active ? (
                        <PowerOff className="h-4 w-4 text-orange-500" />
                      ) : (
                        <Power className="h-4 w-4 text-green-500" />
                      )}
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => copyMockUrl(mock)} title="Copy URL">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditingMock(mock)
                        setShowCreateDialog(true)
                      }}
                      title="Edit mock"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteMock(mock.id)}
                      title="Delete mock"
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Status Code:</span>
                    <span className="ml-2 font-medium">{mock.status_code}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Latency:</span>
                    <span className="ml-2 font-medium">{mock.latency_ms}ms</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Response Body:</p>
                  <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
                    {JSON.stringify(JSON.parse(mock.response_body || "{}"), null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateMockDialog
        open={showCreateDialog}
        onOpenChange={(open) => {
          setShowCreateDialog(open)
          if (!open) setEditingMock(null)
        }}
        onSuccess={loadMocks}
        editingMock={editingMock}
      />
    </div>
  )
}
