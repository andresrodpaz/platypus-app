"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Activity, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TeamMember {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
}

interface ActivityItem {
  id: string
  user_id: string
  action_type: string
  description: string
  created_at: string
  user_profiles: {
    full_name: string
    email: string
  }
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    loadTeamData()

    const membersChannel = supabase
      .channel("user_profiles_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_profiles",
        },
        (payload) => {
          console.log("Team member change:", payload)

          if (payload.eventType === "INSERT") {
            setMembers((prev) => [payload.new as TeamMember, ...prev])
            toast({
              title: "New team member",
              description: `${(payload.new as TeamMember).full_name || (payload.new as TeamMember).email} joined the team`,
            })
          } else if (payload.eventType === "UPDATE") {
            setMembers((prev) => prev.map((m) => (m.id === payload.new.id ? (payload.new as TeamMember) : m)))
          } else if (payload.eventType === "DELETE") {
            setMembers((prev) => prev.filter((m) => m.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    const activityChannel = supabase
      .channel("activity_feed_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activity_feed",
        },
        (payload) => {
          console.log("New activity:", payload)
          // Fetch the full activity with user profile data
          loadSingleActivity(payload.new.id)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(membersChannel)
      supabase.removeChannel(activityChannel)
    }
  }, [])

  const loadSingleActivity = async (activityId: string) => {
    try {
      const { data, error } = await supabase
        .from("activity_feed")
        .select("*, user_profiles(full_name, email)")
        .eq("id", activityId)
        .single()

      if (error) throw error
      if (data) {
        setActivities((prev) => [data as ActivityItem, ...prev.slice(0, 19)])
      }
    } catch (error) {
      console.error("Failed to load activity:", error)
    }
  }

  const loadTeamData = async () => {
    try {
      // Load team members
      const { data: membersData, error: membersError } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false })

      if (membersError) throw membersError
      setMembers(membersData || [])

      // Load activity feed
      const { data: activityData, error: activityError } = await supabase
        .from("activity_feed")
        .select("*, user_profiles(full_name, email)")
        .order("created_at", { ascending: false })
        .limit(20)

      if (activityError) throw activityError
      setActivities(activityData || [])
    } catch (error) {
      console.error("Failed to load team data:", error)
      toast({
        title: "Error loading team data",
        description: "The platypus couldn't fetch team information",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-500"
      case "lead_qa":
        return "bg-blue-500"
      default:
        return "bg-green-500"
    }
  }

  const getRoleEmoji = (role: string) => {
    switch (role) {
      case "admin":
        return "🦦"
      case "lead_qa":
        return "👑"
      default:
        return "🧪"
    }
  }

  const getActivityIcon = (actionType: string) => {
    switch (actionType) {
      case "test_run":
        return "🚀"
      case "bug_created":
        return "🐛"
      case "bug_updated":
        return "🔧"
      case "suite_created":
        return "📦"
      case "comment_added":
        return "💬"
      default:
        return "📝"
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading team data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team Collaboration</h1>
        <p className="text-muted-foreground">Work together with your QA team • Real-time updates enabled 🔴</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}</div>
            <p className="text-xs text-muted-foreground">Active QA engineers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activities.length}</div>
            <p className="text-xs text-muted-foreground">Team actions today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collaboration</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">Team is online</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="activity">Activity Feed</TabsTrigger>
        </TabsList>
        <TabsContent value="members" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <Card key={member.id}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className={getRoleColor(member.role)}>
                        {member.full_name
                          ? member.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : member.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-base">
                        {getRoleEmoji(member.role)} {member.full_name || "QA Tester"}
                      </CardTitle>
                      <CardDescription className="text-xs">{member.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="capitalize">
                      {member.role.replace("_", " ")}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Joined {new Date(member.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {members.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-6xl mb-4">🦦</div>
                <h3 className="text-lg font-semibold mb-2">No team members yet</h3>
                <p className="text-sm text-muted-foreground">The platypus is waiting for your team to join</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="activity" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>What your team has been working on</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-6xl mb-4">🦦</div>
                  <h3 className="text-lg font-semibold mb-2">No activity yet</h3>
                  <p className="text-sm text-muted-foreground">The platypus is waiting for team actions</p>
                </div>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                    <div className="text-2xl">{getActivityIcon(activity.action_type)}</div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">
                          {activity.user_profiles.full_name || activity.user_profiles.email}
                        </span>{" "}
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="text-6xl">🦦</div>
            <p className="text-lg font-medium">The platypus approves of teamwork</p>
            <p className="text-sm text-muted-foreground">
              Collaboration makes testing better. Share suites, assign bugs, and work together.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
