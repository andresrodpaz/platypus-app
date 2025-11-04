import type { Bug } from "@/lib/types"

export const mockBugs = {
  criticalBug: {
    id: "bug-1",
    title: "API returns 500 on concurrent requests",
    description:
      "When multiple requests hit the API simultaneously, it returns 500 errors instead of handling them gracefully.",
    severity: "critical",
    status: "open",
    endpoint: "/api/data/process",
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 3600000,
    assignedTo: "user-2",
    reportedBy: "user-1",
    comments: [
      {
        id: "comment-1",
        bugId: "bug-1",
        userId: "user-2",
        userName: "Alice Dev",
        comment: "Confirmed in production. Working on a fix.",
        createdAt: Date.now() - 7200000,
      },
      {
        id: "comment-2",
        bugId: "bug-1",
        userId: "user-1",
        userName: "Bob QA",
        comment: "This is blocking the release!",
        createdAt: Date.now() - 3600000,
      },
    ],
  } as Bug,

  highSeverityBug: {
    id: "bug-2",
    title: "Response time degradation in /users endpoint",
    description:
      "Response time increased from 100ms to 2000ms after the last deployment. Appears to be a database query issue.",
    severity: "high",
    status: "in-progress",
    endpoint: "/api/users",
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 1800000,
    assignedTo: "user-3",
    reportedBy: "user-1",
    comments: [
      {
        id: "comment-3",
        bugId: "bug-2",
        userId: "user-3",
        userName: "Charlie Dev",
        comment: "Found the issue: missing database index on user_id.",
        createdAt: Date.now() - 1800000,
      },
    ],
  } as Bug,

  mediumSeverityBug: {
    id: "bug-3",
    title: "Incorrect error message for invalid tokens",
    description:
      "When an expired JWT token is sent, the API returns a generic 401 instead of specifying token expiration.",
    severity: "medium",
    status: "open",
    endpoint: "/api/auth/verify",
    createdAt: Date.now() - 259200000,
    updatedAt: Date.now() - 259200000,
    reportedBy: "user-2",
  } as Bug,

  lowSeverityBug: {
    id: "bug-4",
    title: "Typo in CORS error message",
    description: "Error message says 'Orgin' instead of 'Origin' in CORS validation error.",
    severity: "low",
    status: "wont-fix",
    endpoint: "/api/cors",
    createdAt: Date.now() - 345600000,
    updatedAt: Date.now() - 172800000,
    reportedBy: "user-3",
  } as Bug,

  fixedBug: {
    id: "bug-5",
    title: "Memory leak in WebSocket handler",
    description: "WebSocket connections not properly cleaned up, causing memory to grow unbounded.",
    severity: "critical",
    status: "fixed",
    endpoint: "/ws/live-data",
    createdAt: Date.now() - 432000000,
    updatedAt: Date.now() - 86400000,
    assignedTo: "user-2",
    reportedBy: "user-1",
    comments: [
      {
        id: "comment-4",
        bugId: "bug-5",
        userId: "user-2",
        userName: "Alice Dev",
        comment: "Fixed in v2.1.0 - added proper cleanup in disconnect handler.",
        createdAt: Date.now() - 86400000,
      },
    ],
  } as Bug,
}

export const createBug = (overrides?: Partial<Bug>): Bug => ({
  id: `bug-${Math.random().toString(36).substr(2, 9)}`,
  title: "New Bug Report",
  description: "Bug description",
  severity: "medium",
  status: "open",
  endpoint: "/api/test",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  ...overrides,
})
