"use client"

import { useState } from "react"
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
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

interface CreateSuiteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateSuiteDialog({ open, onOpenChange, onSuccess }: CreateSuiteDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isShared, setIsShared] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  const handleCreate = async () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "The platypus needs a name for your suite",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.from("test_suites").insert({
        user_id: "00000000-0000-0000-0000-000000000000", // Default public user
        name: name.trim(),
        description: description.trim(),
        is_shared: isShared,
      })

      if (error) throw error

      toast({
        title: "Suite created",
        description: "The platypus is proud of your new test suite",
      })

      setName("")
      setDescription("")
      setIsShared(false)
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      console.error("[-] Failed to create suite:", error)
      toast({
        title: "Creation failed",
        description: "The platypus couldn't create your suite",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Test Suite</DialogTitle>
          <DialogDescription>Group multiple API requests into a reusable test suite</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Suite Name</Label>
            <Input
              id="name"
              placeholder="User Authentication Flow"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Tests login, signup, and password reset endpoints"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="shared">Share with team</Label>
              <p className="text-sm text-muted-foreground">Allow other team members to view and run this suite</p>
            </div>
            <Switch id="shared" checked={isShared} onCheckedChange={setIsShared} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Suite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
