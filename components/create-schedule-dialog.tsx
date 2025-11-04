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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface CreateScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateScheduleDialog({ open, onOpenChange, onSuccess }: CreateScheduleDialogProps) {
  const [suiteId, setSuiteId] = useState("")
  const [cronExpression, setCronExpression] = useState("0 9 * * *")
  const [notificationEmail, setNotificationEmail] = useState("")
  const [suites, setSuites] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCustomCron, setIsCustomCron] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      loadSuites()
    }
  }, [open])

  const loadSuites = async () => {
    try {
      const { data, error } = await supabase.from("test_suites").select("id, name")

      if (error) throw error
      setSuites(data || [])
    } catch (error) {
      console.error("[v0] Failed to load suites:", error)
    }
  }

  const handleCreate = async () => {
    if (!suiteId) {
      toast({
        title: "Suite required",
        description: "The platypus needs a test suite to schedule",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.from("scheduled_tests").insert({
        user_id: "00000000-0000-0000-0000-000000000000", // Default public user
        suite_id: suiteId,
        cron_expression: cronExpression,
        is_active: true,
        notification_email: notificationEmail || null,
        next_run_at: calculateNextRun(cronExpression),
      })

      if (error) throw error

      toast({
        title: "Schedule created",
        description: "The platypus will run your tests automatically",
      })

      setSuiteId("")
      setCronExpression("0 9 * * *")
      setNotificationEmail("")
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      console.error("Failed to create schedule:", error)
      toast({
        title: "Creation failed",
        description: "The platypus couldn't create the schedule",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculateNextRun = (cron: string): string => {
    // Simple next run calculation (in production, use a proper cron parser)
    const now = new Date()
    now.setHours(now.getHours() + 1)
    return now.toISOString()
  }

  const cronPresets = [
    { label: "Every hour", value: "0 * * * *" },
    { label: "Every day at 9 AM", value: "0 9 * * *" },
    { label: "Every day at midnight", value: "0 0 * * *" },
    { label: "Every Monday at 9 AM", value: "0 9 * * 1" },
    { label: "Every 15 minutes", value: "*/15 * * * *" },
    { label: "Custom", value: "custom" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Scheduled Test</DialogTitle>
          <DialogDescription>Automate your test suite execution with a cron schedule</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="suite">Test Suite</Label>
            <Select value={suiteId} onValueChange={setSuiteId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a test suite" />
              </SelectTrigger>
              <SelectContent>
                {suites.map((suite) => (
                  <SelectItem key={suite.id} value={suite.id}>
                    {suite.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="schedule">Schedule</Label>
            <Select
              value={cronPresets.find((p) => p.value === cronExpression)?.value || "custom"}
              onValueChange={(value) => {
                if (value === "custom") {
                  setIsCustomCron(true)
                } else {
                  setCronExpression(value)
                  setIsCustomCron(false)
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cronPresets.map((preset) => (
                  <SelectItem key={preset.value} value={preset.value}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {isCustomCron && (
            <div className="space-y-2">
              <Label htmlFor="custom-cron">Custom Cron Expression</Label>
              <Input
                id="custom-cron"
                placeholder="0 9 * * *"
                value={cronExpression}
                onChange={(e) => setCronExpression(e.target.value)}
                className="font-mono"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Notification Email (optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="tester@example.com"
              value={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Get notified when tests fail</p>
          </div>
          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="font-medium mb-1">The platypus says:</p>
            <p className="text-xs italic">
              Scheduled tests will run automatically. Make sure your APIs are ready for the platypus inspection.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
