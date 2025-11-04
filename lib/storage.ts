// Local storage utilities for managing test history and bugs
// This can be easily upgraded to Supabase later

import type { ApiRequest, Bug } from "./types"

export type { ApiRequest, Bug }

const REQUESTS_KEY = "platypus_requests"
const BUGS_KEY = "platypus_bugs"

export const storage = {
  // Request History
  getRequests: (): ApiRequest[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(REQUESTS_KEY)
    return data ? JSON.parse(data) : []
  },

  saveRequest: (request: ApiRequest) => {
    if (typeof window === "undefined") return
    const requests = storage.getRequests()
    requests.unshift(request)
    // Keep only last 100 requests
    if (requests.length > 100) requests.pop()
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests))
  },

  clearRequests: () => {
    if (typeof window === "undefined") return
    localStorage.removeItem(REQUESTS_KEY)
  },

  // Bug Management
  getBugs: (): Bug[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(BUGS_KEY)
    return data ? JSON.parse(data) : []
  },

  saveBug: (bug: Bug) => {
    if (typeof window === "undefined") return
    const bugs = storage.getBugs()
    const existingIndex = bugs.findIndex((b) => b.id === bug.id)
    if (existingIndex >= 0) {
      bugs[existingIndex] = bug
    } else {
      bugs.unshift(bug)
    }
    localStorage.setItem(BUGS_KEY, JSON.stringify(bugs))
  },

  deleteBug: (id: string) => {
    if (typeof window === "undefined") return
    const bugs = storage.getBugs().filter((b) => b.id !== id)
    localStorage.setItem(BUGS_KEY, JSON.stringify(bugs))
  },

  updateBugStatus: (id: string, status: Bug["status"]) => {
    if (typeof window === "undefined") return
    const bugs = storage.getBugs()
    const bug = bugs.find((b) => b.id === id)
    if (bug) {
      bug.status = status
      bug.updatedAt = Date.now()
      localStorage.setItem(BUGS_KEY, JSON.stringify(bugs))
    }
  },
}

export const getRequests = storage.getRequests
export const saveRequest = storage.saveRequest
export const clearRequests = storage.clearRequests
export const getBugs = storage.getBugs
export const saveBug = storage.saveBug
export const deleteBug = storage.deleteBug
export const updateBugStatus = storage.updateBugStatus
