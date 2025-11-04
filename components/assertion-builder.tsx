"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import type { Assertion } from "@/lib/assertions"

interface AssertionBuilderProps {
  assertions: Assertion[]
  onChange: (assertions: Assertion[]) => void
}

export function AssertionBuilder({ assertions, onChange }: AssertionBuilderProps) {
  const addAssertion = () => {
    onChange([
      ...assertions,
      {
        type: "status_code",
        expected_value: "200",
        operator: "equals",
      },
    ])
  }

  const updateAssertion = (index: number, field: keyof Assertion, value: any) => {
    const updated = [...assertions]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const removeAssertion = (index: number) => {
    onChange(assertions.filter((_, i) => i !== index))
  }

  const getOperatorsForType = (type: string) => {
    switch (type) {
      case "status_code":
        return ["equals", "not_equals", "greater_than", "less_than"]
      case "response_time":
        return ["less_than", "greater_than", "equals"]
      case "json_schema":
        return ["equals"]
      case "regex":
        return ["matches"]
      case "contains":
        return ["contains"]
      default:
        return ["equals"]
    }
  }

  const getPlaceholderForType = (type: string) => {
    switch (type) {
      case "status_code":
        return "200"
      case "response_time":
        return "1000"
      case "json_schema":
        return '{"id": 0, "name": ""}'
      case "regex":
        return "^[A-Z].*"
      case "contains":
        return "success"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Assertions</h3>
        <Button size="sm" variant="outline" onClick={addAssertion}>
          <Plus className="mr-2 h-4 w-4" />
          Add Assertion
        </Button>
      </div>

      {assertions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-sm text-muted-foreground mb-4">No assertions yet. Add one to validate responses.</p>
            <Button size="sm" onClick={addAssertion}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Assertion
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {assertions.map((assertion, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Assertion {index + 1}</CardTitle>
                  <Button size="icon" variant="ghost" onClick={() => removeAssertion(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Type</Label>
                    <Select
                      value={assertion.type}
                      onValueChange={(value) => {
                        updateAssertion(index, "type", value)
                        updateAssertion(index, "operator", getOperatorsForType(value)[0])
                      }}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="status_code">Status Code</SelectItem>
                        <SelectItem value="response_time">Response Time</SelectItem>
                        <SelectItem value="json_schema">JSON Schema</SelectItem>
                        <SelectItem value="regex">Regex Match</SelectItem>
                        <SelectItem value="contains">Contains Text</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Operator</Label>
                    <Select
                      value={assertion.operator}
                      onValueChange={(value) => updateAssertion(index, "operator", value)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getOperatorsForType(assertion.type).map((op) => (
                          <SelectItem key={op} value={op}>
                            {op.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(assertion.type === "regex" || assertion.type === "contains") && (
                  <div className="space-y-1">
                    <Label className="text-xs">Field Path (optional)</Label>
                    <Input
                      className="h-9"
                      placeholder="data.user.name"
                      value={assertion.field_path || ""}
                      onChange={(e) => updateAssertion(index, "field_path", e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <Label className="text-xs">Expected Value</Label>
                  {assertion.type === "json_schema" ? (
                    <Textarea
                      className="font-mono text-xs"
                      placeholder={getPlaceholderForType(assertion.type)}
                      value={assertion.expected_value}
                      onChange={(e) => updateAssertion(index, "expected_value", e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <Input
                      className="h-9 font-mono text-xs"
                      placeholder={getPlaceholderForType(assertion.type)}
                      value={assertion.expected_value}
                      onChange={(e) => updateAssertion(index, "expected_value", e.target.value)}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
