import { AssertionEngine } from "@/lib/assertions"

describe("Assertion Integration Tests", () => {
  describe("Complete Assertion Workflow", () => {
    it("should validate multiple assertions on same response", () => {
      const assertions = [
        {
          type: "status_code" as const,
          expected_value: "200",
          operator: "equals" as const,
        },
        {
          type: "response_time" as const,
          expected_value: "500",
          operator: "less_than" as const,
        },
        {
          type: "contains" as const,
          expected_value: "success",
          operator: "contains" as const,
        },
      ]

      const response = { status: "success", data: { users: [] } }
      const statusCode = 200
      const responseTime = 150

      const results = assertions.map((assertion) =>
        AssertionEngine.validate(assertion, response, statusCode, responseTime),
      )

      expect(results).toHaveLength(3)
      expect(results.every((r) => r.passed)).toBe(true)
    })

    it("should handle mixed pass/fail assertions", () => {
      const assertions = [
        {
          type: "status_code" as const,
          expected_value: "200",
          operator: "equals" as const,
        },
        {
          type: "status_code" as const,
          expected_value: "400",
          operator: "equals" as const,
        },
      ]

      const results = assertions.map((assertion) => AssertionEngine.validate(assertion, {}, 200, 100))

      expect(results[0].passed).toBe(true)
      expect(results[1].passed).toBe(false)
      expect(results.filter((r) => r.passed)).toHaveLength(1)
    })

    it("should generate appropriate humor for all assertion types", () => {
      const assertionTypes = [
        { type: "status_code" as const, expected_value: "200", operator: "equals" as const },
        { type: "response_time" as const, expected_value: "500", operator: "less_than" as const },
        { type: "contains" as const, expected_value: "test", operator: "contains" as const },
      ]

      assertionTypes.forEach((assertion) => {
        const result = AssertionEngine.validate(assertion, { test: "data" }, 200, 100)
        const humor = AssertionEngine.getHumorousMessage(result)
        expect(humor).toBeTruthy()
        expect(humor.length).toBeGreaterThan(0)
      })
    })
  })

  describe("Performance Assertions", () => {
    it("should handle fast API responses", () => {
      const assertion = {
        type: "response_time" as const,
        expected_value: "100",
        operator: "less_than" as const,
      }

      const result = AssertionEngine.validate(assertion, {}, 200, 50)
      expect(result.passed).toBe(true)
    })

    it("should detect slow API responses", () => {
      const assertion = {
        type: "response_time" as const,
        expected_value: "100",
        operator: "less_than" as const,
      }

      const result = AssertionEngine.validate(assertion, {}, 200, 500)
      expect(result.passed).toBe(false)
      expect(result.error_message).toContain("response time")
    })
  })

  describe("Complex Schema Validation", () => {
    it("should validate nested JSON schema", () => {
      const assertion = {
        type: "json_schema" as const,
        expected_value: JSON.stringify({
          user: { name: "string", email: "string" },
          posts: ["array"],
        }),
        operator: "equals" as const,
      }

      const response = {
        user: { name: "John", email: "john@example.com" },
        posts: [{ id: 1, title: "Post 1" }],
      }

      const result = AssertionEngine.validate(assertion, response, 200, 100)
      expect(result.passed).toBe(true)
    })
  })
})
