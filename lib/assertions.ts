export type AssertionType = "status_code" | "response_time" | "json_schema" | "regex" | "contains"
export type AssertionOperator = "equals" | "not_equals" | "greater_than" | "less_than" | "contains" | "matches"

export interface Assertion {
  id?: string
  type: AssertionType
  expected_value: string
  operator: AssertionOperator
  field_path?: string
}

export interface AssertionResult {
  assertion: Assertion
  passed: boolean
  actual_value?: any
  error_message?: string
}

export class AssertionEngine {
  static validate(assertion: Assertion, response: any, statusCode: number, responseTime: number): AssertionResult {
    try {
      switch (assertion.type) {
        case "status_code":
          return this.validateStatusCode(assertion, statusCode)
        case "response_time":
          return this.validateResponseTime(assertion, responseTime)
        case "json_schema":
          return this.validateJsonSchema(assertion, response)
        case "regex":
          return this.validateRegex(assertion, response)
        case "contains":
          return this.validateContains(assertion, response)
        default:
          return {
            assertion,
            passed: false,
            error_message: "Unknown assertion type",
          }
      }
    } catch (error) {
      return {
        assertion,
        passed: false,
        error_message: error instanceof Error ? error.message : "Assertion validation failed",
      }
    }
  }

  private static validateStatusCode(assertion: Assertion, statusCode: number): AssertionResult {
    const expected = Number.parseInt(assertion.expected_value)
    let passed = false

    switch (assertion.operator) {
      case "equals":
        passed = statusCode === expected
        break
      case "not_equals":
        passed = statusCode !== expected
        break
      case "greater_than":
        passed = statusCode > expected
        break
      case "less_than":
        passed = statusCode < expected
        break
      default:
        return {
          assertion,
          passed: false,
          error_message: `Invalid operator for status_code: ${assertion.operator}`,
        }
    }

    return {
      assertion,
      passed,
      actual_value: statusCode,
      error_message: passed ? undefined : `Expected status ${assertion.operator} ${expected}, got ${statusCode}`,
    }
  }

  private static validateResponseTime(assertion: Assertion, responseTime: number): AssertionResult {
    const expected = Number.parseFloat(assertion.expected_value)
    let passed = false

    switch (assertion.operator) {
      case "less_than":
        passed = responseTime < expected
        break
      case "greater_than":
        passed = responseTime > expected
        break
      case "equals":
        passed = Math.abs(responseTime - expected) < 10 // 10ms tolerance
        break
      default:
        return {
          assertion,
          passed: false,
          error_message: `Invalid operator for response_time: ${assertion.operator}`,
        }
    }

    return {
      assertion,
      passed,
      actual_value: responseTime,
      error_message: passed
        ? undefined
        : `Expected response time ${assertion.operator} ${expected}ms, got ${responseTime}ms`,
    }
  }

  private static validateJsonSchema(assertion: Assertion, response: any): AssertionResult {
    try {
      const expectedSchema = JSON.parse(assertion.expected_value)
      const passed = this.matchesSchema(response, expectedSchema)

      return {
        assertion,
        passed,
        actual_value: response,
        error_message: passed ? undefined : "Response does not match expected schema",
      }
    } catch (error) {
      return {
        assertion,
        passed: false,
        error_message: "Invalid JSON schema format",
      }
    }
  }

  private static validateRegex(assertion: Assertion, response: any): AssertionResult {
    try {
      const regex = new RegExp(assertion.expected_value)
      const value = assertion.field_path
        ? this.getNestedValue(response, assertion.field_path)
        : JSON.stringify(response)

      const passed = regex.test(String(value))

      return {
        assertion,
        passed,
        actual_value: value,
        error_message: passed ? undefined : `Value does not match regex pattern: ${assertion.expected_value}`,
      }
    } catch (error) {
      return {
        assertion,
        passed: false,
        error_message: "Invalid regex pattern",
      }
    }
  }

  private static validateContains(assertion: Assertion, response: any): AssertionResult {
    const value = assertion.field_path ? this.getNestedValue(response, assertion.field_path) : JSON.stringify(response)

    const stringValue = String(value)
    const passed = stringValue.includes(assertion.expected_value)

    return {
      assertion,
      passed,
      actual_value: value,
      error_message: passed ? undefined : `Value does not contain: ${assertion.expected_value}`,
    }
  }

  private static matchesSchema(data: any, schema: any): boolean {
    if (typeof schema !== "object" || schema === null) {
      return typeof data === typeof schema
    }

    if (Array.isArray(schema)) {
      return Array.isArray(data)
    }

    for (const key in schema) {
      if (!(key in data)) {
        return false
      }
      // Handle type string indicators like "string", "number", etc.
      if (schema[key] === "string" && typeof data[key] !== "string") {
        return false
      } else if (schema[key] === "number" && typeof data[key] !== "number") {
        return false
      } else if (schema[key] === "boolean" && typeof data[key] !== "boolean") {
        return false
      } else if (typeof schema[key] === "object" && schema[key] !== null) {
        if (!this.matchesSchema(data[key], schema[key])) {
          return false
        }
      } else if (typeof schema[key] !== "string" && typeof data[key] !== typeof schema[key]) {
        return false
      }
    }

    return true
  }

  private static getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => current?.[key], obj)
  }

  static getHumorousMessage(result: AssertionResult): string {
    if (result.passed) {
      const messages = [
        "The platypus is impressed with this assertion",
        "Nailed it! Even the platypus couldn't break this one",
        "Assertion passed. The platypus approves",
        "Perfect match. The platypus gives you a high-five",
      ]
      return messages[Math.floor(Math.random() * messages.length)]
    }

    const messages = [
      "The platypus found a discrepancy. Time to investigate",
      "Assertion failed. The platypus is disappointed but not surprised",
      "Oops! The platypus detected an unexpected value",
      "This assertion didn't pass. The platypus suggests double-checking",
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }
}
