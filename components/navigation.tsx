"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  FlaskConical,
  Bug,
  BarChart3,
  Home,
  FolderKanban,
  Server,
  Clock,
  Users,
  FileText,
  BookOpen,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/playground", label: "Playground", icon: FlaskConical },
    { href: "/suites", label: "Suites", icon: FolderKanban },
    { href: "/mocks", label: "Mocks", icon: Server },
    { href: "/monitoring", label: "Monitoring", icon: Clock },
    { href: "/bugs", label: "Bugs", icon: Bug },
    { href: "/team", label: "Team", icon: Users },
    { href: "/reports", label: "Reports", icon: FileText },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/docs", label: "API Docs", icon: BookOpen }, // Added API Docs link to navigation
  ]

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="text-2xl">🦦</span>
              <span className="hidden sm:inline">Platypus</span>
            </Link>
            <div className="hidden lg:flex gap-1">
              {links.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
                return (
                  <Link key={link.href} href={link.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className={cn("gap-2", isActive && "bg-secondary")}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </div>
    </nav>
  )
}
