"use client"

import { useState } from "react"
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
  Menu,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    { href: "/docs", label: "API Docs", icon: BookOpen },
  ]

  const handleLinkClick = () => {
    setMobileMenuOpen(false)
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="text-2xl">🦦</span>
              <span className="hidden sm:inline">Platypus</span>
            </Link>
            {/* Desktop Navigation - oculto en pantallas < lg (1024px) */}
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
            {/* Mobile Menu Button - visible solo en pantallas < lg (1024px) */}
            <div className="mobile-menu-button">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-10 w-10"
                    aria-label="Toggle menu"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <span className="text-2xl">🦦</span>
                      <span>Platypus QA Lab</span>
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-4 mt-6">
                    {links.map((link) => {
                      const Icon = link.icon
                      const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={handleLinkClick}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-secondary text-secondary-foreground"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          )}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          {link.label}
                        </Link>
                      )
                    })}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
            {/* Actions - Theme toggle and User nav siempre visibles */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserNav />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}