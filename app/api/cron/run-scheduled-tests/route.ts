import { createClient } from "@/lib/supabase/server"
import { sendTestFailureNotification } from "@/lib/email"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    console.log("Cron job: Checking for scheduled tests to run")

    // Get all active schedules that are due
    const { data: schedules, error } = await supabase
      .from("scheduled_tests")
      .select("*, test_suites(*, test_requests(*))")
      .eq("is_active", true)
      .lte("next_run_at", new Date().toISOString())

    if (error) throw error

    if (!schedules || schedules.length === 0) {
      console.log("[No scheduled tests due to run")
      return NextResponse.json({ message: "No tests to run", count: 0 })
    }

    console.log(`Found ${schedules.length} scheduled tests to run`)

    for (const schedule of schedules) {
      try {
        // Create execution record
        const { data: execution, error: execError } = await supabase
          .from("test_executions")
          .insert({
            suite_id: schedule.suite_id,
            user_id: schedule.user_id,
            status: "running",
            total_requests: schedule.test_suites.test_requests?.length || 0,
          })
          .select()
          .single()

        if (execError) throw execError

        // Run each request in the suite
        let passedCount = 0
        let failedCount = 0

        for (const request of schedule.test_suites.test_requests || []) {
          try {
            const startTime = Date.now()
            const response = await fetch(request.url, {
              method: request.method,
              headers: request.headers || {},
              body: request.body || undefined,
            })
            const endTime = Date.now()

            const passed = response.ok
            if (passed) passedCount++
            else failedCount++

            // Store result
            await supabase.from("test_results").insert({
              execution_id: execution.id,
              request_id: request.id,
              status_code: response.status,
              response_time: endTime - startTime,
              passed,
            })
          } catch (error) {
            failedCount++
            console.error(`Request failed:`, error)
          }
        }

        // Update execution
        await supabase
          .from("test_executions")
          .update({
            status: "completed",
            passed_requests: passedCount,
            failed_requests: failedCount,
            completed_at: new Date().toISOString(),
          })
          .eq("id", execution.id)

        // Update schedule
        const nextRun = calculateNextRun(schedule.cron_expression)
        await supabase
          .from("scheduled_tests")
          .update({
            last_run_at: new Date().toISOString(),
            next_run_at: nextRun,
          })
          .eq("id", schedule.id)

        if (failedCount > 0 && schedule.notification_email && process.env.RESEND_API_KEY) {
          console.log(`Sending notification to ${schedule.notification_email}`)

          await sendTestFailureNotification({
            to: schedule.notification_email,
            suiteName: schedule.test_suites.name,
            failedCount,
            passedCount,
            totalCount: passedCount + failedCount,
            executionId: execution.id,
          })
        } else if (failedCount > 0 && schedule.notification_email) {
          console.log(`Email notifications not configured (missing RESEND_API_KEY)`)
        }

        console.log(`Completed schedule ${schedule.id}: ${passedCount} passed, ${failedCount} failed`)
      } catch (error) {
        console.error(`Failed to run schedule ${schedule.id}:`, error)
      }
    }

    return NextResponse.json({
      message: "Scheduled tests executed",
      count: schedules.length,
    })
  } catch (error) {
    console.error("Cron job error:", error)
    return NextResponse.json({ error: "Failed to run scheduled tests" }, { status: 500 })
  }
}

function calculateNextRun(cronExpression: string): string {
  try {
    const parts = cronExpression.split(" ")
    if (parts.length !== 5) {
      throw new Error("Invalid cron format")
    }

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts

    const now = new Date()
    const next = new Date(now)

    // Simple implementation for common patterns
    if (hour !== "*" && minute !== "*") {
      const [h, m] = [Number.parseInt(hour), Number.parseInt(minute)]
      next.setHours(h, m, 0, 0)
      if (next <= now) {
        next.setDate(next.getDate() + 1)
      }
    } else if (minute !== "*") {
      next.setMinutes(Number.parseInt(minute), 0, 0)
      if (next <= now) {
        next.setHours(next.getHours() + 1)
      }
    } else {
      // Default: next hour
      next.setHours(next.getHours() + 1, 0, 0, 0)
    }

    return next.toISOString()
  } catch (error) {
    // Fallback: next hour
    const next = new Date()
    next.setHours(next.getHours() + 1)
    return next.toISOString()
  }
}
