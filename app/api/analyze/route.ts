import { NextResponse } from "next/server"

interface AnalyzeRequest {
  statusCode: number
  responseTime: number
  url: string
  method: string
  responseBody?: any
}

export async function POST(request: Request) {
  try {
    const body: AnalyzeRequest = await request.json()
    
    // Validate required fields
    if (!body.statusCode || !body.responseTime || !body.url || !body.method) {
      return NextResponse.json(
        { error: "Missing required fields: statusCode, responseTime, url, method" },
        { status: 400 }
      )
    }
    
    const { statusCode, responseTime, url, method, responseBody } = body

    const apiKey = process.env.GROK_XAI_API_KEY

    console.log("API Key check - GROK_XAI_API_KEY exists:", !!apiKey)

    if (!apiKey) {
      console.log("No Grok API key found, using fallback responses")
      return NextResponse.json({
        comment: getFallbackComment(statusCode, responseTime),
        emoji: getEmojiForStatus(statusCode),
        personality: getPersonalityForStatus(statusCode),
        technicalNote: getTechnicalNote(statusCode, responseTime),
        statusCode,
        responseTime,
        timestamp: Date.now(),
        usingFallback: true,
        reason: "No Grok API key configured - add GROK_XAI_API_KEY to environment variables",
      })
    }

    try {
      console.log("Using direct Grok API for analysis")

      const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-3",
          messages: [
            {
              role: "system",
              content:
                "You are a sarcastic but helpful QA platypus analyzing API responses. Be witty, funny, and technically accurate.",
            },
            {
              role: "user",
              content: `API Request Details:
- URL: ${url}
- Method: ${method}
- Status Code: ${statusCode}
- Response Time: ${responseTime}ms
- Response Body: ${responseBody ? JSON.stringify(responseBody).substring(0, 500) : "No response body"}

Provide a humorous but insightful analysis of this API response. Include:
1. A witty comment about the status code
2. Performance assessment based on response time
3. Any technical insights or recommendations
4. Keep it under 100 words and entertaining

Format: Just the analysis text, no labels or sections.`,
            },
          ],
          temperature: 0.8,
          max_tokens: 200,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Grok API error: ${response.status} - ${error}`)
      }

      const data = await response.json()
      const text = data.choices?.[0]?.message?.content

      if (!text || text.trim().length === 0) {
        throw new Error("Empty response from Grok API")
      }

      console.log("Grok AI analysis successful")
      return NextResponse.json({
        comment: text,
        emoji: getEmojiForStatus(statusCode),
        personality: getPersonalityForStatus(statusCode),
        technicalNote: `Response time: ${responseTime}ms, Status: ${statusCode}`,
        statusCode,
        responseTime,
        timestamp: Date.now(),
        usingFallback: false,
        aiModel: "grok-3",
      })
    } catch (aiError) {
      console.error("Grok AI generation failed:", aiError)
      return NextResponse.json({
        comment: getFallbackComment(statusCode, responseTime),
        emoji: getEmojiForStatus(statusCode),
        personality: getPersonalityForStatus(statusCode),
        technicalNote: getTechnicalNote(statusCode, responseTime),
        statusCode,
        responseTime,
        timestamp: Date.now(),
        usingFallback: true,
        reason: "Grok AI generation failed, using fallback",
      })
    }
  } catch (error) {
    console.error("Request processing error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    return NextResponse.json({
      comment: getFallbackComment(200, 0),
      emoji: "🦦",
      personality: "helpful",
      statusCode: 200,
      responseTime: 0,
      timestamp: Date.now(),
      usingFallback: true,
      error: errorMessage,
    })
  }
}

function getEmojiForStatus(statusCode: number): string {
  if (statusCode >= 200 && statusCode < 300) return "✨"
  if (statusCode === 404) return "👻"
  if (statusCode === 401 || statusCode === 403) return "🔒"
  if (statusCode === 429) return "🚦"
  if (statusCode >= 500) return "💥"
  if (statusCode >= 400) return "🤔"
  return "🦦"
}

function getPersonalityForStatus(statusCode: number): string {
  if (statusCode >= 200 && statusCode < 300) return "optimistic"
  if (statusCode === 404) return "sarcastic"
  if (statusCode === 401 || statusCode === 403) return "strict"
  if (statusCode === 429) return "exhausted"
  if (statusCode >= 500) return "dramatic"
  if (statusCode >= 400) return "confused"
  return "neutral"
}

function getFallbackComment(statusCode: number, responseTime: number): string {
  let comment = ""

  if (statusCode >= 200 && statusCode < 300) {
    comment = "Smooth as butter. The platypus approves! ✨"
  } else if (statusCode === 404) {
    comment = "Not found. Did you look under the couch? 🔍"
  } else if (statusCode === 401 || statusCode === 403) {
    comment = "Unauthorized. Did you forget your hall pass? 🚫"
  } else if (statusCode === 429) {
    comment = "Too many requests. The API needs a break 😤"
  } else if (statusCode >= 500) {
    comment = "Internal server error. It's not you, it's them 💥"
  } else if (statusCode >= 400) {
    comment = "Bad request. Did you type that with your elbows? 🤦"
  } else {
    comment = "The platypus has never seen this status code before 🤔"
  }

  if (responseTime < 100) {
    comment += " Lightning fast! ⚡"
  } else if (responseTime > 3000) {
    comment += " Took its sweet time though... 🐢"
  }

  return comment
}

function getTechnicalNote(statusCode: number, responseTime: number): string {
  if (statusCode === 404) {
    return `Status ${statusCode}: Resource not found. Response time: ${responseTime}ms`
  } else if (statusCode >= 500) {
    return `Status ${statusCode}: Server error. Response time: ${responseTime}ms`
  } else if (statusCode >= 400) {
    return `Status ${statusCode}: Client error. Response time: ${responseTime}ms`
  } else if (statusCode >= 200 && statusCode < 300) {
    return `Status ${statusCode}: Success. Response time: ${responseTime}ms`
  }
  return `Status ${statusCode}: Response time: ${responseTime}ms`
}
