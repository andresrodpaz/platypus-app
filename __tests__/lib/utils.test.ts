import { cn } from "@/lib/utils"

describe("Utils", () => {
  describe("cn - Class Name Merger", () => {
    it("should merge basic class names", () => {
      const result = cn("px-2", "py-1")
      expect(result).toContain("px-2")
      expect(result).toContain("py-1")
    })

    it("should handle conditional classes", () => {
      const result = cn("px-2", true && "py-1", false && "hidden")
      expect(result).toContain("px-2")
      expect(result).toContain("py-1")
      expect(result).not.toContain("hidden")
    })

    it("should remove duplicates", () => {
      const result = cn("px-2", "px-4")
      expect(result).not.toContain("px-2")
      expect(result).toContain("px-4")
    })

    it("should handle undefined and null values", () => {
      const result = cn("px-2", undefined, null, "py-1")
      expect(result).toContain("px-2")
      expect(result).toContain("py-1")
    })

    it("should handle empty strings", () => {
      const result = cn("px-2", "", "py-1")
      expect(result).toContain("px-2")
      expect(result).toContain("py-1")
    })

    it("should handle objects", () => {
      const result = cn({
        "px-2": true,
        "py-1": true,
        hidden: false,
      })
      expect(result).toContain("px-2")
      expect(result).toContain("py-1")
      expect(result).not.toContain("hidden")
    })

    it("should handle arrays", () => {
      const result = cn(["px-2", "py-1"], "hidden")
      expect(result).toContain("px-2")
      expect(result).toContain("py-1")
      expect(result).toContain("hidden")
    })
  })
})
