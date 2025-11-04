// Export utilities for test suites and reports

import type { TestSuite, SuiteExecution } from "./types"

export function exportToPostman(suite: TestSuite) {
  const collection = {
    info: {
      name: suite.name,
      description: suite.description,
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    },
    item: suite.requests.map((req) => ({
      name: `${req.method} ${req.url}`,
      request: {
        method: req.method,
        header: req.headers
          ? Object.entries(req.headers).map(([key, value]) => ({
              key,
              value,
            }))
          : [],
        url: {
          raw: req.url,
          protocol: req.url.startsWith("https") ? "https" : "http",
          host: [new URL(req.url).hostname],
          path: new URL(req.url).pathname.split("/").filter(Boolean),
        },
        body: req.body
          ? {
              mode: "raw",
              raw: req.body,
              options: {
                raw: {
                  language: "json",
                },
              },
            }
          : undefined,
      },
    })),
  }

  return JSON.stringify(collection, null, 2)
}

export function exportToOpenAPI(suite: TestSuite) {
  const paths: any = {}

  suite.requests.forEach((req) => {
    try {
      const url = new URL(req.url)
      const path = url.pathname

      if (!paths[path]) {
        paths[path] = {}
      }

      paths[path][req.method.toLowerCase()] = {
        summary: `${req.method} ${path}`,
        parameters: [],
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                },
              },
            },
          },
        },
      }

      if (req.body) {
        paths[path][req.method.toLowerCase()].requestBody = {
          content: {
            "application/json": {
              schema: {
                type: "object",
              },
            },
          },
        }
      }
    } catch (e) {
      console.error("Invalid URL:", req.url)
    }
  })

  const spec = {
    openapi: "3.0.0",
    info: {
      title: suite.name,
      description: suite.description,
      version: "1.0.0",
    },
    paths,
  }

  return JSON.stringify(spec, null, 2)
}

export function exportSuiteToJSON(suite: TestSuite) {
  return JSON.stringify(suite, null, 2)
}

export function exportExecutionToHTML(execution: SuiteExecution): string {
  const passRate = ((execution.passedRequests / execution.totalRequests) * 100).toFixed(1)
  const duration = execution.endTime - execution.startTime

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Execution Report - ${execution.suiteName}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
    .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .stat-value { font-size: 2em; font-weight: bold; color: #667eea; }
    .stat-label { color: #666; margin-top: 5px; }
    .result { background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .result.passed { border-left: 4px solid #10b981; }
    .result.failed { border-left: 4px solid #ef4444; }
    .method { display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 0.85em; }
    .method.GET { background: #dbeafe; color: #1e40af; }
    .method.POST { background: #dcfce7; color: #166534; }
    .method.PUT { background: #fef3c7; color: #92400e; }
    .method.DELETE { background: #fee2e2; color: #991b1b; }
    .assertion { padding: 10px; margin: 5px 0; border-radius: 4px; font-size: 0.9em; }
    .assertion.passed { background: #d1fae5; color: #065f46; }
    .assertion.failed { background: #fee2e2; color: #991b1b; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🦦 Platypus QA Lab - Test Execution Report</h1>
    <h2>${execution.suiteName}</h2>
    <p>Executed on ${new Date(execution.startTime).toLocaleString()}</p>
  </div>

  <div class="stats">
    <div class="stat-card">
      <div class="stat-value">${execution.totalRequests}</div>
      <div class="stat-label">Total Requests</div>
    </div>
    <div class="stat-card">
      <div class="stat-value" style="color: #10b981;">${execution.passedRequests}</div>
      <div class="stat-label">Passed</div>
    </div>
    <div class="stat-card">
      <div class="stat-value" style="color: #ef4444;">${execution.failedRequests}</div>
      <div class="stat-label">Failed</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${passRate}%</div>
      <div class="stat-label">Pass Rate</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${(duration / 1000).toFixed(2)}s</div>
      <div class="stat-label">Duration</div>
    </div>
  </div>

  <h3>Test Results</h3>
`

  execution.results.forEach((result, index) => {
    html += `
  <div class="result ${result.passed ? "passed" : "failed"}">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <div>
        <span class="method ${result.method}">${result.method}</span>
        <strong style="margin-left: 10px;">${result.url}</strong>
      </div>
      <div>
        <span style="color: ${result.status >= 200 && result.status < 300 ? "#10b981" : "#ef4444"}; font-weight: bold;">
          ${result.status}
        </span>
        <span style="color: #666; margin-left: 10px;">${result.responseTime}ms</span>
      </div>
    </div>
`

    if (result.assertionResults && result.assertionResults.length > 0) {
      html += `<div style="margin-top: 10px;"><strong>Assertions:</strong>`
      result.assertionResults.forEach((assertion) => {
        html += `
        <div class="assertion ${assertion.passed ? "passed" : "failed"}">
          ${assertion.passed ? "✓" : "✗"} ${assertion.message}
        </div>`
      })
      html += `</div>`
    }

    if (result.error) {
      html += `<div style="color: #ef4444; margin-top: 10px;"><strong>Error:</strong> ${result.error}</div>`
    }

    html += `</div>`
  })

  html += `
  <div style="text-align: center; margin-top: 40px; padding: 20px; color: #666;">
    <p>Generated by Platypus QA Lab 🦦</p>
    <p style="font-size: 0.9em; font-style: italic;">"Serious testing, funny results."</p>
  </div>
</body>
</html>`

  return html
}
