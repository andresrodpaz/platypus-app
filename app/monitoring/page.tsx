"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Play, Pause, Trash2, Clock, AlertCircle, CheckCircle2 } from "lucide-react"
import { CreateScheduleDialog } from "@/components/create-schedule-dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface ScheduledTest {
  id: string
  suite_id: string
  cron_expression: string
  is_active: boolean
  last_run_at: string | null
  next_run_at: string | null
  notification_email: string | null
  test_suites: {
    name: string
  }
}

export default function MonitoringPage() {
  const [schedules, setSchedules] = useState<ScheduledTest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    loadSchedules()
  }, [])

  const loadSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from("scheduled_tests")
        .select("*, test_suites(name)")
        .order("created_at", { ascending: false })

      if (error) throw error
      setSchedules(data || [])
    } catch (error) {
      console.error("Failed to load schedules:", error)
      toast({
        title: "Error loading schedules",
        description: "The platypus couldn't fetch your scheduled tests",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSchedule = async (scheduleId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("scheduled_tests")
        .update({ is_active: !currentStatus })
        .eq("id", scheduleId)

      if (error) throw error

      setSchedules(schedules.map((s) => (s.id === scheduleId ? { ...s, is_active: !currentStatus } : s)))

      toast({
        title: currentStatus ? "Schedule paused" : "Schedule activated",
        description: currentStatus
          ? "The platypus stopped the scheduled tests"
          : "The platypus will run tests automatically",
      })
    } catch (error) {
      console.error("Failed to toggle schedule:", error)
      toast({
        title: "Toggle failed",
        description: "The platypus couldn't change the schedule status",
        variant: "destructive",
      })
    }
  }

  const deleteSchedule = async (scheduleId: string) => {
    if (!confirm("Delete this schedule? The platypus will stop monitoring.")) return

    try {
      const { error } = await supabase.from("scheduled_tests").delete().eq("id", scheduleId)

      if (error) throw error

      setSchedules(schedules.filter((s) => s.id !== scheduleId))
      toast({
        title: "Schedule deleted",
        description: "The platypus removed the scheduled test",
      })
    } catch (error) {
      console.error("Failed to delete schedule:", error)
      toast({
        title: "Delete failed",
        description: "The platypus couldn't delete the schedule",
        variant: "destructive",
      })
    }
  }

  const runNow = async (scheduleId: string, suiteId: string) => {
    try {
      const { data: suite } = await supabase
        .from("test_suites")
        .select("*, test_requests(*)")
        .eq("id", suiteId)
        .single()

      if (!suite) {
        toast({
          title: "Suite not found",
          description: "The platypus couldn't find the test suite",
          variant: "destructive",
        })
        return
      }

      const { data: execution, error: execError } = await supabase
        .from("test_executions")
        .insert({
          suite_id: suiteId,
          user_id: "00000000-0000-0000-0000-000000000000",
          status: "running",
          total_requests: suite.test_requests?.length || 0,
          started_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (execError) throw execError

      toast({
        title: "Suite running",
        description: "The platypus is executing your tests now",
      })

      // Execute requests in background
      if (suite.test_requests && suite.test_requests.length > 0) {
        let passedCount = 0
        let failedCount = 0
        let totalResponseTime = 0

        for (const request of suite.test_requests) {
          try {
            const startTime = Date.now()
            const response = await fetch(request.url, {
              method: request.method || "GET",
              headers: request.headers || {},
              body: request.body || undefined,
            })
            const endTime = Date.now()
            const responseTime = endTime - startTime

            const passed = response.ok
            if (passed) passedCount++
            else failedCount++
            totalResponseTime += responseTime

            // Store result
            await supabase.from("test_results").insert({
              execution_id: execution.id,
              request_id: request.id,
              status_code: response.status,
              response_time: responseTime,
              passed,
            })
          } catch (error) {
            failedCount++
            console.error("Request failed:", error)
          }
        }

        // Update execution
        await supabase
          .from("test_executions")
          .update({
            status: "completed",
            passed_requests: passedCount,
            failed_requests: failedCount,
            avg_response_time: Math.round(totalResponseTime / (passedCount + failedCount)),
            completed_at: new Date().toISOString(),
          })
          .eq("id", execution.id)

        toast({
          title: "Suite completed",
          description: `${passedCount} passed, ${failedCount} failed`,
        })
      }
    } catch (error) {
      console.error("Failed to run suite:", error)
      toast({
        title: "Execution failed",
        description: "The platypus couldn't run the suite",
        variant: "destructive",
      })
    }
  }

  const activeSchedules = schedules.filter((s) => s.is_active).length

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading schedules...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Scheduled Tests & Monitoring</h1>
          <p className="text-muted-foreground">Automate your API testing with cron schedules</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Schedule
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schedules</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schedules.length}</div>
            <p className="text-xs text-muted-foreground">Automated test schedules</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Monitors</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{activeSchedules}</div>
            <p className="text-xs text-muted-foreground">Currently monitoring</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paused</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{schedules.length - activeSchedules}</div>
            <p className="text-xs text-muted-foreground">Inactive schedules</p>
          </CardContent>
        </Card>
      </div>

      {schedules.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">🦦</div>
            <h3 className="text-lg font-semibold mb-2">No scheduled tests yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The platypus can run your tests automatically on a schedule
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Schedule
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <Card key={schedule.id} className={schedule.is_active ? "border-green-500/50" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{schedule.test_suites.name}</CardTitle>
                      {schedule.is_active ? (
                        <Badge variant="default" className="bg-green-500">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Paused</Badge>
                      )}
                    </div>
                    <CardDescription className="font-mono text-sm">{schedule.cron_expression}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => toggleSchedule(schedule.id, schedule.is_active)}
                      title={schedule.is_active ? "Pause schedule" : "Activate schedule"}
                    >
                      {schedule.is_active ? (
                        <Pause className="h-4 w-4 text-orange-500" />
                      ) : (
                        <Play className="h-4 w-4 text-green-500" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => runNow(schedule.id, schedule.suite_id)}
                      title="Run now"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteSchedule(schedule.id)}
                      title="Delete schedule"
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
                    <span className="text-muted-foreground">Last Run:</span>
                    <span className="ml-2 font-medium">
                      {schedule.last_run_at ? new Date(schedule.last_run_at).toLocaleString() : "Never"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Next Run:</span>
                    <span className="ml-2 font-medium">
                      {schedule.next_run_at ? new Date(schedule.next_run_at).toLocaleString() : "Not scheduled"}
                    </span>
                  </div>
                </div>
                {schedule.notification_email && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Notifications:</span>
                    <span className="ml-2 font-medium">{schedule.notification_email}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateScheduleDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onSuccess={loadSchedules} />
    </div>
  )
}
