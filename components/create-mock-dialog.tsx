"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface CreateMockDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  editingMock?: any
}

export function CreateMockDialog({ open, onOpenChange, onSuccess, editingMock }: CreateMockDialogProps) {
  const [name, setName] = useState("")
  const [path, setPath] = useState("")
  const [method, setMethod] = useState("GET")
  const [statusCode, setStatusCode] = useState("200")
  const [responseBody, setResponseBody] = useState("")
  const [latency, setLatency] = useState("0")
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    if (editingMock) {
      setName(editingMock.name)
      setPath(editingMock.path)
      setMethod(editingMock.method)
      setStatusCode(editingMock.status_code.toString())
      setResponseBody(editingMock.response_body)
      setLatency(editingMock.latency_ms.toString())
    } else {
      resetForm()
    }
  }, [editingMock, open])

  const resetForm = () => {
    setName("")
    setPath("")
    setMethod("GET")
    setStatusCode("200")
    setResponseBody('{\n  "message": "Mock response"\n}')
    setLatency("0")
  }

  const handleSave = async () => {
    if (!name.trim() || !path.trim()) {
      toast({
        title: "Missing fields",
        description: "The platypus needs a name and path",
        variant: "destructive",
      })
      return
    }

    if (!path.startsWith("/")) {
      toast({
        title: "Invalid path",
        description: "Path must start with /",
        variant: "destructive",
      })
      return
    }

    try {
      JSON.parse(responseBody)
    } catch {
      toast({
        title: "Invalid JSON",
        description: "The platypus can't parse your response body",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const mockData = {
        user_id: "00000000-0000-0000-0000-000000000000", // Default public user
        name: name.trim(),
        path: path.trim(),
        method,
        status_code: Number.parseInt(statusCode),
        response_body: responseBody,
        latency_ms: Number.parseInt(latency),
        is_active: true,
      }

      if (editingMock) {
        const { error } = await supabase.from("api_mocks").update(mockData).eq("id", editingMock.id)
        if (error) throw error
        toast({
          title: "Mock updated",
          description: "The platypus updated your mock endpoint",
        })
      } else {
        const { error } = await supabase.from("api_mocks").insert(mockData)
        if (error) throw error
        toast({
          title: "Mock created",
          description: "The platypus created your fake API",
        })
      }

      resetForm()
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      console.error("[v0] Failed to save mock:", error)
      toast({
        title: "Save failed",
        description: "The platypus couldn't save your mock",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingMock ? "Edit Mock" : "Create API Mock"}</DialogTitle>
          <DialogDescription>Create a fake API endpoint that returns custom responses for testing</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Mock Name</Label>
            <Input id="name" placeholder="User API Mock" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="method">HTTP Method</Label>
              <Select value={method} onValueChange={setMethod}>
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
            <div className="space-y-2">
              <Label htmlFor="path">Path</Label>
              <Input id="path" placeholder="/users/123" value={path} onChange={(e) => setPath(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status Code</Label>
              <Select value={statusCode} onValueChange={setStatusCode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="200">200 OK</SelectItem>
                  <SelectItem value="201">201 Created</SelectItem>
                  <SelectItem value="400">400 Bad Request</SelectItem>
                  <SelectItem value="401">401 Unauthorized</SelectItem>
                  <SelectItem value="404">404 Not Found</SelectItem>
                  <SelectItem value="500">500 Internal Server Error</SelectItem>
                  <SelectItem value="503">503 Service Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="latency">Latency (ms)</Label>
              <Input
                id="latency"
                type="number"
                placeholder="0"
                value={latency}
                onChange={(e) => setLatency(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="response">Response Body (JSON)</Label>
            <Textarea
              id="response"
              placeholder='{"message": "Success"}'
              value={responseBody}
              onChange={(e) => setResponseBody(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          </div>
          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="font-medium mb-1">Mock URL:</p>
            <code className="text-xs">
              {typeof window !== "undefined" ? window.location.origin : ""}/api/mock{path || "/your-path"}
            </code>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : editingMock ? "Update Mock" : "Create Mock"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
