# API Documentation - Platypus QA Lab

## Overview

Platypus QA Lab provides internal API endpoints for analyzing API responses and generating humorous, contextual feedback.

## Base URL

\`\`\`
http://localhost:3000/api
\`\`\`

## Endpoints

### POST /api/analyze

Analyzes an API response and returns humorous, contextual commentary with technical insights.

#### Request

**Headers**:
\`\`\`
Content-Type: application/json
\`\`\`

**Body**:
\`\`\`json
{
  "url": "string",
  "method": "string",
  "status": number,
  "responseTime": number,
  "responseBody": any
}
\`\`\`

**Parameters**:
- `url` (required): The API endpoint that was tested
- `method` (required): HTTP method used (GET, POST, PUT, DELETE, etc.)
- `status` (required): HTTP status code received
- `responseTime` (required): Response time in milliseconds
- `responseBody` (optional): The response body from the API

#### Response

**Success (200)**:
\`\`\`json
{
  "analysis": {
    "message": "string",
    "personality": "string",
    "technicalNote": "string"
  }
}
\`\`\`

**Response Fields**:
- `message`: Humorous, contextual commentary about the API response
- `personality`: The platypus's mood/personality for this response
- `technicalNote`: Technical insight or recommendation

**Error (400)**:
\`\`\`json
{
  "error": "Missing required fields: url, method, status, responseTime"
}
\`\`\`

**Error (500)**:
\`\`\`json
{
  "error": "Analysis failed",
  "details": "string"
}
\`\`\`

#### Examples

**Example 1: Successful API Call**

Request:
\`\`\`bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://api.github.com/users/octocat",
    "method": "GET",
    "status": 200,
    "responseTime": 145,
    "responseBody": {"login": "octocat", "id": 1}
  }'
\`\`\`

Response:
\`\`\`json
{
  "analysis": {
    "message": "Smooth as butter! This API is having a great day. GitHub's servers must have had their morning coffee.",
    "personality": "cheerful",
    "technicalNote": "Response time of 145ms is excellent. Well within acceptable range."
  }
}
\`\`\`

**Example 2: Slow Response**

Request:
\`\`\`bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://api.example.com/slow",
    "method": "GET",
    "status": 200,
    "responseTime": 3500
  }'
\`\`\`

Response:
\`\`\`json
{
  "analysis": {
    "message": "Whoa there, slowpoke! This API took its sweet time. Did it stop for a coffee break?",
    "personality": "impatient",
    "technicalNote": "Response time of 3500ms exceeds recommended threshold. Consider caching or optimization."
  }
}
\`\`\`

**Example 3: Not Found Error**

Request:
\`\`\`bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://api.example.com/missing",
    "method": "GET",
    "status": 404,
    "responseTime": 89
  }'
\`\`\`

Response:
\`\`\`json
{
  "analysis": {
    "message": "404: Not Found. This endpoint is playing hide and seek... and winning. Maybe check the URL?",
    "personality": "confused",
    "technicalNote": "Verify the endpoint exists and the URL is correct. Check API documentation."
  }
}
\`\`\`

**Example 4: Server Error**

Request:
\`\`\`bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://api.example.com/broken",
    "method": "POST",
    "status": 500,
    "responseTime": 234
  }'
\`\`\`

Response:
\`\`\`json
{
  "analysis": {
    "message": "500 Internal Server Error! The server just had a meltdown. Someone's getting paged right now.",
    "personality": "dramatic",
    "technicalNote": "Server-side error. Check server logs and contact API maintainers if issue persists."
  }
}
\`\`\`

## Analysis Logic

The analysis endpoint uses a sophisticated algorithm to generate contextual feedback based on:

1. **Status Code**: Different messages for 2xx, 3xx, 4xx, 5xx ranges
2. **Response Time**: Performance-based commentary
3. **URL Patterns**: Recognizes popular APIs (GitHub, Pokemon, NASA, etc.)
4. **Response Body**: Analyzes content for additional context
5. **HTTP Method**: Considers the type of operation

## Rate Limiting

Currently, there are no rate limits on the analysis endpoint. However, it's recommended to:
- Batch requests when possible
- Implement client-side caching
- Avoid excessive polling

## Error Handling

All errors return appropriate HTTP status codes:
- `400`: Bad request (missing or invalid parameters)
- `500`: Internal server error (analysis failed)

Error responses include descriptive messages to help debug issues.

## Best Practices

1. **Always include all required fields** in the request body
2. **Handle errors gracefully** on the client side
3. **Cache results** when testing the same endpoint repeatedly
4. **Respect response times** and implement timeouts
5. **Log requests** for debugging purposes

## Future Enhancements

Planned improvements to the API:
- Machine learning-based analysis
- Historical trend analysis
- Custom humor profiles
- Webhook support for async analysis
- Batch analysis endpoint

---

**API Version**: 1.0  
**Last Updated**: 2025-01-25  

*The platypus guarantees this API will make you smile while you test. Probably.*
