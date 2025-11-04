import { generateHumorousComment, getBugSeverityComment } from "@/lib/humor-engine"

describe("Humor Engine", () => {
  describe("generateHumorousComment", () => {
    it("should generate positive comment for 200 status", () => {
      const result = generateHumorousComment(200, 150)
      expect(result.comment).toBeTruthy()
      expect(result.emoji).toBeTruthy()
      expect(result.comment.length).toBeGreaterThan(0)
      expect(typeof result.comment).toBe("string")
      expect(typeof result.emoji).toBe("string")
    })

    it("should generate 404 comment", () => {
      const result = generateHumorousComment(404, 200)
      expect(result.comment).toBeTruthy()
      expect(result.comment.toLowerCase()).toMatch(/not|found|lost|ghost|vacation|oops|searching|never|existed/)
    })

    it("should generate 500 error comment", () => {
      const result = generateHumorousComment(500, 300)
      expect(result.comment).toBeTruthy()
      expect(result.emoji).toBeTruthy()
      expect(result.comment.toLowerCase()).toMatch(/error|broke|crisis|bad/)
    })

    it("should add fast response time comment", () => {
      const result = generateHumorousComment(200, 50)
      expect(result.comment.toLowerCase()).toMatch(/fast|lightning|⚡/)
    })

    it("should add slow response time comment", () => {
      const result = generateHumorousComment(200, 3500)
      expect(result.comment.toLowerCase()).toMatch(/slow|time|sweet|🐢/)
    })

    it("should handle unknown status codes", () => {
      const result = generateHumorousComment(999, 100)
      expect(result.comment).toBeTruthy()
      expect(result.emoji).toBeTruthy()
      expect(result.comment.toLowerCase()).toMatch(/platypus|never|seen/)
    })
  })

  describe("getBugSeverityComment", () => {
    it("should return comment for critical severity", () => {
      const comment = getBugSeverityComment("critical")
      expect(comment.toLowerCase()).toMatch(/exploded|json|critical/)
    })

    it("should return comment for high severity", () => {
      const comment = getBugSeverityComment("high")
      expect(comment.toLowerCase()).toMatch(/bad|engineer|wake/)
    })

    it("should return comment for medium severity", () => {
      const comment = getBugSeverityComment("medium")
      expect(comment.toLowerCase()).toMatch(/annoying|mosquito|survivable/)
    })

    it("should return comment for low severity", () => {
      const comment = getBugSeverityComment("low")
      expect(comment.toLowerCase()).toMatch(/barely|feature|commitment/)
    })

    it("should handle unknown severity", () => {
      const comment = getBugSeverityComment("unknown")
      expect(comment.toLowerCase()).toMatch(/platypus|confused/)
    })
  })
})
