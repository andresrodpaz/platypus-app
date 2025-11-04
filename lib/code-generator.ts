// Code generation utilities for API documentation

export function generateCurlCommand(request: {
  url: string
  method: string
  headers?: Record<string, string>
  body?: string
}): string {
  let command = `curl -X ${request.method} "${request.url}"`

  if (request.headers) {
    Object.entries(request.headers).forEach(([key, value]) => {
      command += ` \\\n  -H "${key}: ${value}"`
    })
  }

  if (request.body && ["POST", "PUT", "PATCH"].includes(request.method)) {
    command += ` \\\n  -d '${request.body}'`
  }

  return command
}

export function generateJavaScriptCode(request: {
  url: string
  method: string
  headers?: Record<string, string>
  body?: string
}): string {
  const options: any = {
    method: request.method,
  }

  if (request.headers) {
    options.headers = request.headers
  }

  if (request.body && ["POST", "PUT", "PATCH"].includes(request.method)) {
    options.body = request.body
  }

  return `fetch("${request.url}", ${JSON.stringify(options, null, 2)})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`
}

export function generatePythonCode(request: {
  url: string
  method: string
  headers?: Record<string, string>
  body?: string
}): string {
  let code = `import requests\n\n`
  code += `url = "${request.url}"\n`

  if (request.headers) {
    code += `headers = ${JSON.stringify(request.headers, null, 2).replace(/"/g, "'")}\n`
  }

  if (request.body && ["POST", "PUT", "PATCH"].includes(request.method)) {
    code += `data = ${request.body}\n`
  }

  code += `\nresponse = requests.${request.method.toLowerCase()}(url`

  if (request.headers) {
    code += `, headers=headers`
  }

  if (request.body && ["POST", "PUT", "PATCH"].includes(request.method)) {
    code += `, json=data`
  }

  code += `)\nprint(response.json())`

  return code
}

export function generateGoCode(request: {
  url: string
  method: string
  headers?: Record<string, string>
  body?: string
}): string {
  let code = `package main\n\nimport (\n\t"fmt"\n\t"io"\n\t"net/http"\n`

  if (request.body) {
    code += `\t"strings"\n`
  }

  code += `)\n\nfunc main() {\n`
  code += `\turl := "${request.url}"\n`

  if (request.body && ["POST", "PUT", "PATCH"].includes(request.method)) {
    code += `\tpayload := strings.NewReader(\`${request.body}\`)\n`
    code += `\treq, _ := http.NewRequest("${request.method}", url, payload)\n`
  } else {
    code += `\treq, _ := http.NewRequest("${request.method}", url, nil)\n`
  }

  if (request.headers) {
    Object.entries(request.headers).forEach(([key, value]) => {
      code += `\treq.Header.Add("${key}", "${value}")\n`
    })
  }

  code += `\n\tres, _ := http.DefaultClient.Do(req)\n`
  code += `\tdefer res.Body.Close()\n`
  code += `\tbody, _ := io.ReadAll(res.Body)\n`
  code += `\tfmt.Println(string(body))\n}`

  return code
}

export function generateNodeCode(request: {
  url: string
  method: string
  headers?: Record<string, string>
  body?: string
}): string {
  const options: any = {
    method: request.method,
    headers: request.headers || {},
  }

  if (request.body && ["POST", "PUT", "PATCH"].includes(request.method)) {
    options.body = request.body
  }

  return `const fetch = require('node-fetch');

const url = '${request.url}';
const options = ${JSON.stringify(options, null, 2)};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error('error:' + err));`
}
