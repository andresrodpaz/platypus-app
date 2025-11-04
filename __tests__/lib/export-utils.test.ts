import { exportToPostman, exportToOpenAPI, exportSuiteToJSON } from "@/lib/export-utils"
import type { TestSuite } from "@/lib/types"

describe("Export Utils", () => {
  const mockSuite: TestSuite = {
    id: "suite-1",
    name: "Test Suite",
    description: "A test suite for API testing",
    requests: [
      {
        id: "req-1",
        url: "https://api.example.com/users",
        method: "GET",
        headers: { "Content-Type": "application/json" },
        order: 0,
      },
      {
        id: "req-2",
        url: "https://api.example.com/users",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: '{"name": "Test User"}',
        order: 1,
      },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    userId: "user-1",
    isPublic: false,
  }

  describe("exportToPostman", () => {
    it("should export suite to Postman collection format", () => {
      const result = exportToPostman(mockSuite)
      const collection = JSON.parse(result)

      expect(collection.info.name).toBe("Test Suite")
      expect(collection.item).toHaveLength(2)
      expect(collection.item[0].request.method).toBe("GET")
      console.log("✅ Postman collection exported successfully")
    })

    it("should include headers in Postman format", () => {
      const result = exportToPostman(mockSuite)
      const collection = JSON.parse(result)

      expect(collection.item[0].request.header).toEqual([{ key: "Content-Type", value: "application/json" }])
      console.log("✅ Headers included in Postman export")
    })
  })

  describe("exportToOpenAPI", () => {
    it("should export suite to OpenAPI specification", () => {
      const result = exportToOpenAPI(mockSuite)
      const spec = JSON.parse(result)

      expect(spec.openapi).toBe("3.0.0")
      expect(spec.info.title).toBe("Test Suite")
      expect(spec.paths).toBeDefined()
      console.log("✅ OpenAPI spec exported successfully")
    })

    it("should include paths and methods", () => {
      const result = exportToOpenAPI(mockSuite)
      const spec = JSON.parse(result)

      expect(spec.paths["/users"]).toBeDefined()
      expect(spec.paths["/users"].get).toBeDefined()
      expect(spec.paths["/users"].post).toBeDefined()
      console.log("✅ Paths and methods included in OpenAPI spec")
    })
  })

  describe("exportSuiteToJSON", () => {
    it("should export suite as JSON", () => {
      const result = exportSuiteToJSON(mockSuite)
      const parsed = JSON.parse(result)

      expect(parsed.id).toBe("suite-1")
      expect(parsed.name).toBe("Test Suite")
      expect(parsed.requests).toHaveLength(2)
      console.log("✅ Suite exported as JSON successfully")
    })
  })
})
