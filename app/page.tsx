import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FlaskConical, Bug, BarChart3, Zap, FolderKanban, Server, Clock, Users, FileText, BookOpen } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-6xl">🦦</div>
            <h1 className="text-5xl font-bold tracking-tight">Platypus QA Lab</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Welcome to the most curious QA lab on the internet. We break APIs, but with style.
          </p>
          <Badge variant="secondary" className="text-sm">
            Serious testing. Hilarious results.
          </Badge>
        </div>

        {/* Core Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <FlaskConical className="h-10 w-10 mb-2 text-chart-1" />
              <CardTitle>API Playground</CardTitle>
              <CardDescription>Test real public APIs and get sarcastic feedback on their performance</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Bug className="h-10 w-10 mb-2 text-chart-2" />
              <CardTitle>Bug Reporter</CardTitle>
              <CardDescription>Document bugs with style. The platypus will judge your severity ratings</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="h-10 w-10 mb-2 text-chart-3" />
              <CardTitle>QA Analytics</CardTitle>
              <CardDescription>Visualize your testing prowess with charts that actually make sense</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Zap className="h-10 w-10 mb-2 text-chart-4" />
              <CardTitle>AI Analysis</CardTitle>
              <CardDescription>Get witty, AI-powered commentary on every API response you test</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-6">Advanced Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <FolderKanban className="h-8 w-8 mb-2 text-chart-1" />
                <CardTitle className="text-lg">Test Suites</CardTitle>
                <CardDescription>Group requests and run collections with one click</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Server className="h-8 w-8 mb-2 text-chart-2" />
                <CardTitle className="text-lg">API Mocking</CardTitle>
                <CardDescription>Create mock endpoints to simulate any API response</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Clock className="h-8 w-8 mb-2 text-chart-3" />
                <CardTitle className="text-lg">Scheduled Tests</CardTitle>
                <CardDescription>Automate testing with cron jobs and monitoring</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-8 w-8 mb-2 text-chart-4" />
                <CardTitle className="text-lg">Team Collaboration</CardTitle>
                <CardDescription>Assign bugs, comment, and track team activity</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-8 w-8 mb-2 text-chart-1" />
                <CardTitle className="text-lg">Enhanced Reports</CardTitle>
                <CardDescription>Export detailed QA reports and sprint comparisons</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="h-8 w-8 mb-2 text-chart-2" />
                <CardTitle className="text-lg">API Documentation</CardTitle>
                <CardDescription>Auto-generate OpenAPI specs and code examples</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6">
          <Card className="max-w-2xl mx-auto bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-3">Ready to break some APIs?</h2>
              <p className="text-muted-foreground mb-6">
                Start testing public APIs, report bugs, and get hilariously accurate feedback from our AI-powered
                platypus
              </p>
              <Link href="/playground">
                <Button size="lg" className="text-lg px-8">
                  Start Testing
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div>
              <div className="text-2xl font-bold text-foreground">10+</div>
              <div>Features</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">100%</div>
              <div>Sarcasm Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">∞</div>
              <div>Bugs Found</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
