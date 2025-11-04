/**
 * @jest-environment jsdom
 */

import { storage } from "@/lib/storage"
import type { ApiRequest, Bug } from "@/lib/types"

describe("Storage", () => {
  beforeEach(() => {
    localStorage.clear()
    console.log("LocalStorage cleared before test")
  })

  describe("Request Storage", () => {
    it("should save and retrieve API requests", () => {
      const request: ApiRequest = {
        id: "test-1",
        url: "https://api.test.com",
        method: "GET",
        status: 200,
        responseTime: 150,
        timestamp: Date.now(),
        response: { data: "test" },
        humorousComment: "Test comment",
      }

      storage.saveRequest(request)
      const requests = storage.getRequests()

      expect(requests).toHaveLength(1)
      expect(requests[0]).toEqual(request)
      console.log("Request saved and retrieved successfully")
    })

    it("should maintain request order (newest first)", () => {
      const request1: ApiRequest = {
        id: "test-1",
        url: "https://api.test.com/1",
        method: "GET",
        status: 200,
        responseTime: 100,
        timestamp: Date.now(),
        response: {},
      }

      const request2: ApiRequest = {
        id: "test-2",
        url: "https://api.test.com/2",
        method: "GET",
        status: 200,
        responseTime: 200,
        timestamp: Date.now() + 1000,
        response: {},
      }

      storage.saveRequest(request1)
      storage.saveRequest(request2)

      const requests = storage.getRequests()
      expect(requests[0].id).toBe("test-2")
      expect(requests[1].id).toBe("test-1")
      console.log("Request order maintained correctly")
    })

    it("should limit requests to 100", () => {
      for (let i = 0; i < 105; i++) {
        const request: ApiRequest = {
          id: `test-${i}`,
          url: `https://api.test.com/${i}`,
          method: "GET",
          status: 200,
          responseTime: 100,
          timestamp: Date.now() + i,
          response: {},
        }
        storage.saveRequest(request)
      }

      const requests = storage.getRequests()
      expect(requests).toHaveLength(100)
      expect(requests[0].id).toBe("test-104")
      console.log("Request limit enforced at 100")
    })

    it("should clear all requests", () => {
      const request: ApiRequest = {
        id: "test-1",
        url: "https://api.test.com",
        method: "GET",
        status: 200,
        responseTime: 100,
        timestamp: Date.now(),
        response: {},
      }

      storage.saveRequest(request)
      storage.clearRequests()

      const requests = storage.getRequests()
      expect(requests).toHaveLength(0)
      console.log("All requests cleared successfully")
    })
  })

  describe("Bug Storage", () => {
    it("should save and retrieve bugs", () => {
      const bug: Bug = {
        id: "bug-1",
        title: "Test Bug",
        description: "This is a test bug",
        severity: "high",
        status: "open",
        endpoint: "https://api.test.com",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      storage.saveBug(bug)
      const bugs = storage.getBugs()

      expect(bugs).toHaveLength(1)
      expect(bugs[0]).toEqual(bug)
      console.log("Bug saved and retrieved successfully")
    })

    it("should update existing bug", () => {
      const bug: Bug = {
        id: "bug-1",
        title: "Test Bug",
        description: "Original description",
        severity: "high",
        status: "open",
        endpoint: "https://api.test.com",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      storage.saveBug(bug)

      const updatedBug = { ...bug, description: "Updated description" }
      storage.saveBug(updatedBug)

      const bugs = storage.getBugs()
      expect(bugs).toHaveLength(1)
      expect(bugs[0].description).toBe("Updated description")
      console.log("Bug updated successfully")
    })

    it("should delete bug", () => {
      const bug: Bug = {
        id: "bug-1",
        title: "Test Bug",
        description: "Test",
        severity: "low",
        status: "open",
        endpoint: "https://api.test.com",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      storage.saveBug(bug)
      storage.deleteBug("bug-1")

      const bugs = storage.getBugs()
      expect(bugs).toHaveLength(0)
      console.log("Bug deleted successfully")
    })

    it("should update bug status", async () => {
      const bug: Bug = {
        id: "bug-1",
        title: "Test Bug",
        description: "Test",
        severity: "medium",
        status: "open",
        endpoint: "https://api.test.com",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      storage.saveBug(bug)
      const originalUpdatedAt = bug.updatedAt
      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10))
      storage.updateBugStatus("bug-1", "fixed")

      const bugs = storage.getBugs()
      expect(bugs[0].status).toBe("fixed")
      expect(bugs[0].updatedAt).toBeGreaterThanOrEqual(originalUpdatedAt)
      console.log("Bug status updated successfully")
    })
  })
})
