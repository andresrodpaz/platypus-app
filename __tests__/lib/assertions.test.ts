import { AssertionEngine } from "@/lib/assertions"

describe("AssertionEngine", () => {
  describe("validate - Status Code Assertions", () => {
    it("should validate status code equals", () => {
      const assertion = {
        type: "status_code" as const,
        expected_value: "200",
        operator: "equals" as const,
      }
      const result = AssertionEngine.validate(assertion, {}, 200, 100)
      expect(result.passed).toBe(true)
      expect(result.actual_value).toBe(200)
    })

    it("should fail status code equals when not equal", () => {
      const assertion = {
        type: "status_code" as const,
        expected_value: "200",
        operator: "equals" as const,
      }
      const result = AssertionEngine.validate(assertion, {}, 404, 100)
      expect(result.passed).toBe(false)
      expect(result.error_message).toContain("Expected status")
    })

    it("should validate status code not_equals", () => {
      const assertion = {
        type: "status_code" as const,
        expected_value: "500",
        operator: "not_equals" as const,
      }
      const result = AssertionEngine.validate(assertion, {}, 200, 100)
      expect(result.passed).toBe(true)
    })

    it("should validate status code greater_than", () => {
      const assertion = {
        type: "status_code" as const,
        expected_value: "200",
        operator: "greater_than" as const,
      }
      const result = AssertionEngine.validate(assertion, {}, 404, 100)
      expect(result.passed).toBe(true)
    })

    it("should validate status code less_than", () => {
      const assertion = {
        type: "status_code" as const,
        expected_value: "400",
        operator: "less_than" as const,
      }
      const result = AssertionEngine.validate(assertion, {}, 200, 100)
      expect(result.passed).toBe(true)
    })
  })

  describe("validate - Response Time Assertions", () => {
    it("should validate response time less_than", () => {
      const assertion = {
        type: "response_time" as const,
        expected_value: "200",
        operator: "less_than" as const,
      }
      const result = AssertionEngine.validate(assertion, {}, 200, 100)
      expect(result.passed).toBe(true)
      expect(result.actual_value).toBe(100)
    })

    it("should fail response time less_than when exceeded", () => {
      const assertion = {
        type: "response_time" as const,
        expected_value: "100",
        operator: "less_than" as const,
      }
      const result = AssertionEngine.validate(assertion, {}, 200, 200)
      expect(result.passed).toBe(false)
    })

    it("should validate response time greater_than", () => {
      const assertion = {
        type: "response_time" as const,
        expected_value: "50",
        operator: "greater_than" as const,
      }
      const result = AssertionEngine.validate(assertion, {}, 200, 100)
      expect(result.passed).toBe(true)
    })

    it("should validate response time equals with tolerance", () => {
      const assertion = {
        type: "response_time" as const,
        expected_value: "100",
        operator: "equals" as const,
      }
      const result = AssertionEngine.validate(assertion, {}, 200, 105)
      expect(result.passed).toBe(true)
    })
  })

  describe("validate - JSON Schema Assertions", () => {
    it("should validate JSON schema", () => {
      const assertion = {
        type: "json_schema" as const,
        expected_value: '{"name": "string", "age": "number"}',
        operator: "equals" as const,
      }
      const response = { name: "John", age: 30 }
      // Note: The schema matcher checks for type strings, not actual types
      // So "string" means the property should be a string, "number" means number
      const result = AssertionEngine.validate(assertion, response, 200, 100)
      // The schema validation checks if properties exist and match types
      expect(result.passed).toBe(true)
    })

    it("should fail invalid JSON schema", () => {
      const assertion = {
        type: "json_schema" as const,
        expected_value: '{"name": "string"}',
        operator: "equals" as const,
      }
      const response = { age: 30 }
      const result = AssertionEngine.validate(assertion, response, 200, 100)
      expect(result.passed).toBe(false)
    })
  })

  describe("validate - Regex Assertions", () => {
    it("should validate regex pattern in response", () => {
      const assertion = {
        type: "regex" as const,
        expected_value: "^[0-9]+$",
        operator: "matches" as const,
        field_path: "id", // Need to specify the field to check
      }
      const response = { id: "12345" }
      const result = AssertionEngine.validate(assertion, response, 200, 100)
      expect(result.passed).toBe(true)
    })

    it("should fail regex pattern when not matching", () => {
      const assertion = {
        type: "regex" as const,
        expected_value: "^[0-9]+$",
        operator: "matches" as const,
      }
      const response = { id: "abc" }
      const result = AssertionEngine.validate(assertion, response, 200, 100)
      expect(result.passed).toBe(false)
    })

    it("should validate regex with field path", () => {
      const assertion = {
        type: "regex" as const,
        expected_value: "@example.com$",
        operator: "matches" as const,
        field_path: "user.email",
      }
      const response = { user: { email: "test@example.com" } }
      const result = AssertionEngine.validate(assertion, response, 200, 100)
      expect(result.passed).toBe(true)
    })
  })

  describe("validate - Contains Assertions", () => {
    it("should validate contains in response", () => {
      const assertion = {
        type: "contains" as const,
        expected_value: "success",
        operator: "contains" as const,
      }
      const response = { message: "Operation was successful" }
      const result = AssertionEngine.validate(assertion, response, 200, 100)
      expect(result.passed).toBe(true)
    })

    it("should fail contains when not found", () => {
      const assertion = {
        type: "contains" as const,
        expected_value: "error",
        operator: "contains" as const,
      }
      const response = { message: "Operation was successful" }
      const result = AssertionEngine.validate(assertion, response, 200, 100)
      expect(result.passed).toBe(false)
    })
  })

  describe("Error Handling", () => {
    it("should handle invalid assertion type", () => {
      const assertion = {
        type: "invalid" as any,
        expected_value: "test",
        operator: "equals" as const,
      }
      const result = AssertionEngine.validate(assertion, {}, 200, 100)
      expect(result.passed).toBe(false)
      expect(result.error_message).toContain("Unknown assertion type")
    })

    it("should handle malformed JSON schema", () => {
      const assertion = {
        type: "json_schema" as const,
        expected_value: "invalid json",
        operator: "equals" as const,
      }
      const result = AssertionEngine.validate(assertion, {}, 200, 100)
      expect(result.passed).toBe(false)
      expect(result.error_message).toContain("Invalid JSON schema")
    })

    it("should handle invalid regex pattern", () => {
      const assertion = {
        type: "regex" as const,
        expected_value: "[invalid(regex",
        operator: "matches" as const,
      }
      const result = AssertionEngine.validate(assertion, {}, 200, 100)
      expect(result.passed).toBe(false)
    })
  })

  describe("getHumorousMessage", () => {
    it("should return positive message for passed assertion", () => {
      const result = AssertionEngine.getHumorousMessage({
        assertion: {
          type: "status_code" as const,
          expected_value: "200",
          operator: "equals" as const,
        },
        passed: true,
      })
      expect(result).toContain("platypus")
      expect(result.toLowerCase()).toMatch(/impressed|nailed|approves|high-five/)
    })

    it("should return negative message for failed assertion", () => {
      const result = AssertionEngine.getHumorousMessage({
        assertion: {
          type: "status_code" as const,
          expected_value: "200",
          operator: "equals" as const,
        },
        passed: false,
      })
      expect(result).toContain("platypus")
      expect(result.toLowerCase()).toMatch(/discrepancy|disappointed|detected|double-check/)
    })
  })
})
