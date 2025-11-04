import {
  generateCurlCommand,
  generateJavaScriptCode,
  generatePythonCode,
  generateGoCode,
  generateNodeCode,
} from "@/lib/code-generator"

describe("Code Generator", () => {
  const sampleRequest = {
    url: "https://api.example.com/users",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer token123",
    },
  }

  const postRequest = {
    url: "https://api.example.com/users",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: '{"name": "John Doe"}',
  }

  describe("generateCurlCommand", () => {
    it("should generate curl command for GET request", () => {
      const result = generateCurlCommand(sampleRequest)
      expect(result).toContain('curl -X GET "https://api.example.com/users"')
      expect(result).toContain('-H "Content-Type: application/json"')
      expect(result).toContain('-H "Authorization: Bearer token123"')
      console.log("✅ Curl GET command generated successfully")
    })

    it("should generate curl command for POST request with body", () => {
      const result = generateCurlCommand(postRequest)
      expect(result).toContain("curl -X POST")
      expect(result).toContain('-d \'{"name": "John Doe"}\'')
      console.log("✅ Curl POST command with body generated successfully")
    })
  })

  describe("generateJavaScriptCode", () => {
    it("should generate JavaScript fetch code", () => {
      const result = generateJavaScriptCode(sampleRequest)
      expect(result).toContain("fetch(")
      expect(result).toContain("https://api.example.com/users")
      expect(result).toContain('"method"')
      console.log("✅ JavaScript code generated successfully")
    })

    it("should include body for POST requests", () => {
      const result = generateJavaScriptCode(postRequest)
      expect(result).toContain('"body"')
      console.log("✅ JavaScript POST code with body generated")
    })
  })

  describe("generatePythonCode", () => {
    it("should generate Python requests code", () => {
      const result = generatePythonCode(sampleRequest)
      expect(result).toContain("import requests")
      expect(result).toContain("requests.get(")
      expect(result).toContain("https://api.example.com/users")
      console.log("✅ Python code generated successfully")
    })

    it("should handle POST requests with data", () => {
      const result = generatePythonCode(postRequest)
      expect(result).toContain("requests.post(")
      expect(result).toContain("json=data")
      console.log("✅ Python POST code with data generated")
    })
  })

  describe("generateGoCode", () => {
    it("should generate Go code", () => {
      const result = generateGoCode(sampleRequest)
      expect(result).toContain("package main")
      expect(result).toContain("http.NewRequest")
      expect(result).toContain("GET")
      console.log("✅ Go code generated successfully")
    })
  })

  describe("generateNodeCode", () => {
    it("should generate Node.js code", () => {
      const result = generateNodeCode(sampleRequest)
      expect(result).toContain("require('node-fetch')")
      expect(result).toContain("fetch(")
      console.log("✅ Node.js code generated successfully")
    })
  })
})
