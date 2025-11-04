"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, AlertCircle, CheckCircle2, Clock, XCircle, MessageSquare, User } from "lucide-react"
import { BugReportDialog } from "@/components/bug-report-dialog"
import { BugDetailsDialog } from "@/components/bug-details-dialog"
import { useToast } from "@/hooks/use-toast"

interface Bug {
  id: string
  title: string
  description: string
  severity: string
  status: string
  endpoint: string
  created_at: string
  user_profiles: {
    full_name: string
    email: string
  }
  assigned_to_profile?: {
    full_name: string
    email: string
  }
  bug_comments?: Array<{ id: string }>
}

export default function BugsPage() {
  const [bugs, setBugs] = useState<Bug[]>([])
  const [filteredBugs, setFilteredBugs] = useState<Bug[]>([])
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    loadBugs()
  }, [])

  useEffect(() => {
    filterBugs()
  }, [bugs, severityFilter, statusFilter])

  const loadBugs = async () => {
    try {
      const { data, error } = await supabase
        .from("bugs")
        .select(`
          *,
          user_profiles!bugs_user_id_fkey(full_name, email),
          assigned_to_profile:user_profiles!bugs_assigned_to_fkey(full_name, email),
          bug_comments(id)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setBugs(data || [])
    } catch (error) {
      console.error("Failed to load bugs:", error)
      toast({
        title: "Error loading bugs",
        description: "The platypus couldn't fetch your bugs",
        variant: "destructive",
      })
    }
  }

  const filterBugs = () => {
    let filtered = [...bugs]

    if (severityFilter !== "all") {
      filtered = filtered.filter((bug) => bug.severity === severityFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((bug) => bug.status === statusFilter)
    }

    setFilteredBugs(filtered)
  }

  const handleStatusChange = async (bugId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("bugs").update({ status: newStatus }).eq("id", bugId)

      if (error) throw error

      loadBugs()
      toast({
        title: "Status updated",
        description: "The platypus noted the status change",
      })
    } catch (error) {
      console.error("Failed to update status:", error)
      toast({
        title: "Update failed",
        description: "The platypus couldn't update the status",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (bugId: string) => {
    if (!confirm("Are you sure you want to delete this bug? The platypus will be disappointed.")) return

    try {
      const { error } = await supabase.from("bugs").delete().eq("id", bugId)

      if (error) throw error

      loadBugs()
      toast({
        title: "Bug deleted",
        description: "The platypus removed the bug",
      })
    } catch (error) {
      console.error("Failed to delete bug:", error)
      toast({
        title: "Delete failed",
        description: "The platypus couldn't delete the bug",
        variant: "destructive",
      })
    }
  }

  const openBugDetails = (bug: Bug) => {
    setSelectedBug(bug)
    setDetailsOpen(true)
  }

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: "bg-red-500 hover:bg-red-600",
      high: "bg-orange-500 hover:bg-orange-600",
      medium: "bg-yellow-500 hover:bg-yellow-600",
      low: "bg-blue-500 hover:bg-blue-600",
    }
    return colors[severity as keyof typeof colors]
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      open: <AlertCircle className="h-4 w-4" />,
      in_progress: <Clock className="h-4 w-4" />,
      resolved: <CheckCircle2 className="h-4 w-4" />,
      closed: <XCircle className="h-4 w-4" />,
    }
    return icons[status as keyof typeof icons]
  }

  const getStatusColor = (status: string) => {
    const colors = {
      open: "text-red-600 dark:text-red-400",
      in_progress: "text-yellow-600 dark:text-yellow-400",
      resolved: "text-green-600 dark:text-green-400",
      closed: "text-gray-600 dark:text-gray-400",
    }
    return colors[status as keyof typeof colors]
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bug Dashboard</h1>
          <p className="text-muted-foreground">Track and manage your bug reports. The platypus is watching.</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Report Bug
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Bugs</CardDescription>
            <CardTitle className="text-3xl">{bugs.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Open</CardDescription>
            <CardTitle className="text-3xl text-red-600 dark:text-red-400">
              {bugs.filter((b) => b.status === "open").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-3xl text-yellow-600 dark:text-yellow-400">
              {bugs.filter((b) => b.status === "in_progress").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Resolved</CardDescription>
            <CardTitle className="text-3xl text-green-600 dark:text-green-400">
              {bugs.filter((b) => b.status === "resolved").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bug Reports</CardTitle>
          <CardDescription>
            {filteredBugs.length === 0
              ? "No bugs found. Either you're amazing or not testing hard enough."
              : `Showing ${filteredBugs.length} bug${filteredBugs.length === 1 ? "" : "s"}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBugs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🦦</div>
              <p className="text-muted-foreground">No bugs match your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBugs.map((bug) => (
                    <TableRow key={bug.id} className="cursor-pointer" onClick={() => openBugDetails(bug)}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{bug.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">{bug.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(bug.severity)}>{bug.severity}</Badge>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Select value={bug.status} onValueChange={(value) => handleStatusChange(bug.id, value)}>
                          <SelectTrigger className="w-36">
                            <div className={`flex items-center gap-2 ${getStatusColor(bug.status)}`}>
                              {getStatusIcon(bug.status)}
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {bug.assigned_to_profile ? (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{bug.assigned_to_profile.full_name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{bug.bug_comments?.length || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(bug.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(bug.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <BugReportDialog open={dialogOpen} onOpenChange={setDialogOpen} onSuccess={loadBugs} />
      {selectedBug && (
        <BugDetailsDialog bug={selectedBug} open={detailsOpen} onOpenChange={setDetailsOpen} onUpdate={loadBugs} />
      )}
    </div>
  )
}
