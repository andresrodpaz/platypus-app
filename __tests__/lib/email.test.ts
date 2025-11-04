import { sendTestFailureNotification } from "@/lib/email"

// Mock Resend
const mockSend = jest.fn()
jest.mock("resend", () => ({
  Resend: jest.fn(() => ({
    emails: {
      send: mockSend,
    },
  })),
}))

// Mock environment variable
process.env.RESEND_API_KEY = "test-key"
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000"

describe("Email Service", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSend.mockClear()
  })

  describe("sendTestFailureNotification", () => {
    it("should send email with correct parameters", async () => {
      mockSend.mockResolvedValue({ data: { id: "email-123" }, error: null })

      const result = await sendTestFailureNotification({
        to: "user@example.com",
        suiteName: "API Tests",
        failedCount: 3,
        passedCount: 7,
        totalCount: 10,
        executionId: "exec-123",
      })

      expect(result.success).toBe(true)
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: expect.stringContaining("platypus"),
          to: ["user@example.com"],
          subject: expect.stringContaining("API Tests"),
        }),
      )
    })

    it("should include test results in email", async () => {
      mockSend.mockResolvedValue({ data: { id: "email-123" }, error: null })

      await sendTestFailureNotification({
        to: "user@example.com",
        suiteName: "API Tests",
        failedCount: 3,
        passedCount: 7,
        totalCount: 10,
        executionId: "exec-123",
      })

      const callArgs = mockSend.mock.calls[0][0]
      expect(callArgs.html).toContain("3")
      expect(callArgs.html).toContain("7")
      expect(callArgs.html).toContain("10")
    })

    it("should handle email sending errors", async () => {
      mockSend.mockResolvedValue({
        data: null,
        error: { message: "Invalid email" },
      })

      const result = await sendTestFailureNotification({
        to: "invalid-email",
        suiteName: "API Tests",
        failedCount: 1,
        passedCount: 9,
        totalCount: 10,
        executionId: "exec-123",
      })

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it("should handle service exceptions", async () => {
      mockSend.mockRejectedValue(new Error("Service error"))

      const result = await sendTestFailureNotification({
        to: "user@example.com",
        suiteName: "API Tests",
        failedCount: 1,
        passedCount: 9,
        totalCount: 10,
        executionId: "exec-123",
      })

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })
})
