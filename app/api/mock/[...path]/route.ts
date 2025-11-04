import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleMockRequest(request, params, "GET")
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleMockRequest(request, params, "POST")
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleMockRequest(request, params, "PUT")
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleMockRequest(request, params, "DELETE")
}

export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleMockRequest(request, params, "PATCH")
}

async function handleMockRequest(request: NextRequest, params: { path: string[] }, method: string) {
  try {
    const supabase = await createClient()
    const path = "/" + params.path.join("/")

    console.log(`Mock request received: ${method} ${path}`)

    // Find matching mock
    const { data: mock, error } = await supabase
      .from("api_mocks")
      .select("*")
      .eq("path", path)
      .eq("method", method)
      .eq("is_active", true)
      .single()

    if (error || !mock) {
      console.log("No active mock found for this endpoint")
      return NextResponse.json(
        {
          error: "Mock not found",
          message: "The platypus couldn't find an active mock for this endpoint",
          path,
          method,
        },
        { status: 404 },
      )
    }

    // Simulate latency
    if (mock.latency_ms > 0) {
      await new Promise((resolve) => setTimeout(resolve, mock.latency_ms))
    }

    console.log(`Returning mock response with status ${mock.status_code}`)

    // Parse and return response
    let responseBody
    try {
      responseBody = JSON.parse(mock.response_body)
    } catch {
      responseBody = { data: mock.response_body }
    }

    return NextResponse.json(responseBody, {
      status: mock.status_code,
      headers: {
        "X-Mock-Server": "Platypus-QA-Lab",
        "X-Mock-Name": mock.name,
        "X-Mock-Latency": mock.latency_ms.toString(),
      },
    })
  } catch (error) {
    console.error("Mock server error:", error)
    return NextResponse.json(
      {
        error: "Mock server error",
        message: "The platypus encountered an error processing your mock request",
      },
      { status: 500 },
    )
  }
}
