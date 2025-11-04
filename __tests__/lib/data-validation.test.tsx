/**
 * Data Validation Tests
 * Tests for validating API response data integrity and format
 *
 * Covers:
 * - Type validation
 * - Schema validation
 * - Data consistency checks
 * - Sanitization and normalization
 */

describe("Data Validation", () => {
  describe("Type Validation", () => {
    it("should validate response has expected types", () => {
      // Arrange
      const response = {
        id: 123,
        name: "Test API",
        active: true,
        tags: ["api", "test"],
        metadata: { version: "1.0" },
      }

      // Act & Assert
      expect(typeof response.id).toBe("number")
      expect(typeof response.name).toBe("string")
      expect(typeof response.active).toBe("boolean")
      expect(Array.isArray(response.tags)).toBe(true)
      expect(typeof response.metadata).toBe("object")
    })

    it("should reject response with incorrect types", () => {
      // Arrange
      const invalidResponse = {
        id: "not-a-number", // Should be number
        name: 123, // Should be string
        active: "yes", // Should be boolean
      }

      // Act & Assert
      expect(typeof invalidResponse.id).not.toBe("number")
      expect(typeof invalidResponse.name).not.toBe("string")
      expect(typeof invalidResponse.active).not.toBe("boolean")
    })

    it("should validate nested object structures", () => {
      // Arrange
      const complexResponse = {
        user: {
          id: 1,
          profile: {
            firstName: "John",
            lastName: "Doe",
            settings: {
              notifications: true,
              theme: "dark",
            },
          },
        },
      }

      // Act & Assert
      expect(complexResponse.user.profile.firstName).toBe("John")
      expect(complexResponse.user.profile.settings.notifications).toBe(true)
      expect(typeof complexResponse.user.profile.settings.theme).toBe("string")
    })
  })

  describe("Schema Validation", () => {
    it("should validate required fields are present", () => {
      // Arrange
      const requiredFields = ["id", "name", "email"]
      const user = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "555-1234", // Optional
      }

      // Act
      const hasAllRequired = requiredFields.every((field) => field in user)

      // Assert
      expect(hasAllRequired).toBe(true)
    })

    it("should detect missing required fields", () => {
      // Arrange
      const requiredFields = ["id", "name", "email"]
      const incompleteUser = {
        id: 1,
        name: "John Doe",
        // Missing email
      }

      // Act
      const missingFields = requiredFields.filter((field) => !(field in incompleteUser))

      // Assert
      expect(missingFields).toContain("email")
      expect(missingFields.length).toBe(1)
    })

    it("should validate email format", () => {
      // Arrange
      const validEmails = ["user@example.com", "test.user@domain.co.uk", "name+tag@example.org"]
      const invalidEmails = ["invalid.email", "@example.com", "user@", "user space@example.com"]

      // Act & Assert
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      validEmails.forEach((email) => {
        expect(email).toMatch(emailRegex)
      })

      invalidEmails.forEach((email) => {
        expect(email).not.toMatch(emailRegex)
      })
    })
  })

  describe("Data Consistency", () => {
    it("should validate data consistency across related fields", () => {
      // Arrange
      const user = {
        firstName: "John",
        lastName: "Doe",
        fullName: "John Doe",
      }

      // Act
      const expectedFullName = `${user.firstName} ${user.lastName}`

      // Assert
      expect(user.fullName).toBe(expectedFullName)
    })

    it("should detect inconsistent status values", () => {
      // Arrange
      const validStatuses = ["active", "inactive", "pending", "archived"]
      const record = {
        id: 1,
        status: "unknown", // Invalid status
      }

      // Act
      const isValidStatus = validStatuses.includes(record.status)

      // Assert
      expect(isValidStatus).toBe(false)
    })

    it("should validate numeric range constraints", () => {
      // Arrange
      const constraints = {
        minScore: 0,
        maxScore: 100,
      }
      const scores = [0, 50, 100, -5, 150]

      // Act & Assert
      expect(scores[0]).toBeGreaterThanOrEqual(constraints.minScore)
      expect(scores[1]).toBeLessThanOrEqual(constraints.maxScore)
      expect(scores[2]).toBeLessThanOrEqual(constraints.maxScore)
      expect(scores[3]).toBeLessThan(constraints.minScore)
      expect(scores[4]).toBeGreaterThan(constraints.maxScore)
    })
  })

  describe("Data Sanitization", () => {
    it("should remove XSS attempts from strings", () => {
      // Arrange
      const xssAttempt = "<script>alert('xss')</script>"
      const sanitized = xssAttempt.replace(/<[^>]*>/g, "")

      // Act & Assert
      expect(sanitized).not.toContain("<script>")
      expect(sanitized).not.toContain("</script>")
    })

    it("should trim whitespace from strings", () => {
      // Arrange
      const rawString = "  hello world  "

      // Act
      const trimmed = rawString.trim()

      // Assert
      expect(trimmed).toBe("hello world")
      expect(trimmed).not.toMatch(/^\s/)
      expect(trimmed).not.toMatch(/\s$/)
    })
  })
})
