"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BugDetailsDialogProps {
  bug: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
}

interface Comment {
  id: string
  comment: string
  created_at: string
  user_profiles: {
    full_name: string
    email: string
  }
}

export function BugDetailsDialog({ bug, open, onOpenChange, onUpdate }: BugDetailsDialogProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [assignedTo, setAssignedTo] = useState(bug.assigned_to || "unassigned")
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      loadComments()
      loadTeamMembers()
    }
  }, [open, bug.id])

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from("bug_comments")
        .select("*, user_profiles(full_name, email)")
        .eq("bug_id", bug.id)
        .order("created_at", { ascending: true })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error("[v0] Failed to load comments:", error)
    }
  }

  const loadTeamMembers = async () => {
    try {
      const { data, error } = await supabase.from("user_profiles").select("id, full_name, email")

      if (error) throw error
      setTeamMembers(data || [])
    } catch (error) {
      console.error("[v0] Failed to load team members:", error)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("bug_comments").insert({
        bug_id: bug.id,
        user_id: user.id,
        comment: newComment.trim(),
      })

      if (error) throw error

      // Log activity
      await supabase.from("activity_feed").insert({
        user_id: user.id,
        action_type: "comment_added",
        entity_type: "bug",
        entity_id: bug.id,
        description: `commented on bug "${bug.title}"`,
      })

      setNewComment("")
      loadComments()
      toast({
        title: "Comment added",
        description: "The platypus recorded your comment",
      })
    } catch (error) {
      console.error("[v0] Failed to add comment:", error)
      toast({
        title: "Comment failed",
        description: "The platypus couldn't save your comment",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssignmentChange = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("bugs")
        .update({ assigned_to: userId || null })
        .eq("id", bug.id)

      if (error) throw error

      setAssignedTo(userId)
      onUpdate()
      toast({
        title: "Assignment updated",
        description: "The platypus assigned the bug",
      })
    } catch (error) {
      console.error("[v0] Failed to update assignment:", error)
      toast({
        title: "Assignment failed",
        description: "The platypus couldn't assign the bug",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{bug.title}</DialogTitle>
          <DialogDescription>Bug details and team collaboration</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Severity</Label>
              <div className="mt-1">
                <Badge className="capitalize">{bug.severity}</Badge>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Status</Label>
              <div className="mt-1">
                <Badge variant="outline" className="capitalize">
                  {bug.status.replace("_", " ")}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Description</Label>
            <p className="mt-1 text-sm">{bug.description}</p>
          </div>

          {bug.endpoint && (
            <div>
              <Label className="text-xs text-muted-foreground">Endpoint</Label>
              <p className="mt-1 text-sm font-mono bg-muted p-2 rounded">{bug.endpoint}</p>
            </div>
          )}

          <div>
            <Label className="text-xs text-muted-foreground">Assign To</Label>
            <Select value={assignedTo} onValueChange={handleAssignmentChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.full_name || member.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-4">Comments ({comments.length})</h3>
            <div className="space-y-4 mb-4">
              {comments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No comments yet. The platypus is waiting for your input.
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {comment.user_profiles.full_name?.[0] || comment.user_profiles.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {comment.user_profiles.full_name || comment.user_profiles.email}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{comment.comment}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <Textarea
                placeholder="Add a comment... The platypus is listening."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <Button onClick={handleAddComment} disabled={isLoading || !newComment.trim()} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
