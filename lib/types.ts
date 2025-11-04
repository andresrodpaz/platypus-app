// Centralized type definitions

export interface ApiRequest {
  id: string
  url: string
  method: string
  status: number
  responseTime: number
  timestamp: number
  response: any
  humorousComment?: string
  headers?: Record<string, string>
  body?: string
}

export interface Bug {
  id: string
  title: string
  description: string
  severity: "critical" | "high" | "medium" | "low"
  status: "open" | "in-progress" | "fixed" | "wont-fix"
  endpoint: string
  createdAt: number
  updatedAt: number
  assignedTo?: string
  comments?: BugComment[]
  reportedBy?: string
}

export interface BugComment {
  id: string
  bugId: string
  userId: string
  userName: string
  comment: string
  createdAt: number
}

export interface TestSuite {
  id: string
  name: string
  description: string
  requests: SuiteRequest[]
  createdAt: number
  updatedAt: number
  userId: string
  isPublic: boolean
  tags?: string[]
}

export interface SuiteRequest {
  id: string
  url: string
  method: string
  headers?: Record<string, string>
  body?: string
  assertions?: Assertion[]
  order: number
}

export interface Assertion {
  id: string
  type: "status" | "response_time" | "json_schema" | "regex" | "contains"
  field?: string
  operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains" | "matches"
  value: string | number
  enabled: boolean
}

export interface SuiteExecution {
  id: string
  suiteId: string
  suiteName: string
  startTime: number
  endTime: number
  results: ExecutionResult[]
  totalRequests: number
  passedRequests: number
  failedRequests: number
  userId: string
}

export interface ExecutionResult {
  requestId: string
  url: string
  method: string
  status: number
  responseTime: number
  passed: boolean
  assertionResults: AssertionResult[]
  response: any
  error?: string
}

export interface AssertionResult {
  assertionId: string
  type: string
  passed: boolean
  expected: any
  actual: any
  message: string
}

export interface MockEndpoint {
  id: string
  path: string
  method: string
  statusCode: number
  responseBody: string
  delay: number
  isActive: boolean
  createdAt: number
  userId: string
  description?: string
}

export interface Schedule {
  id: string
  suiteId: string
  suiteName: string
  cronExpression: string
  isActive: boolean
  lastRun?: number
  nextRun?: number
  notifyOnFailure: boolean
  notificationEmail?: string
  createdAt: number
  userId: string
}

export interface UserProfile {
  id: string
  email: string
  fullName?: string
  role: "tester" | "lead_qa" | "admin"
  avatarUrl?: string
  createdAt: number
}

export interface TeamActivity {
  id: string
  userId: string
  userName: string
  action: string
  targetType: "bug" | "suite" | "test" | "mock"
  targetId: string
  targetName: string
  timestamp: number
  details?: string
}

export interface Notification {
  id: string
  userId: string
  type: "bug_assigned" | "comment_added" | "test_failed" | "suite_completed"
  title: string
  message: string
  read: boolean
  createdAt: number
  relatedId?: string
}
