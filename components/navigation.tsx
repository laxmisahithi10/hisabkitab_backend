"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Calculator, Home, PieChart, Settings, Menu, Target, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Overview and quick actions",
  },
  {
    title: "Categories",
    href: "/categories",
    icon: Target,
    description: "Manage expense categories",
  },
  {
    title: "Reports",
    href: "/reports",
    icon: PieChart,
    description: "Analytics and insights",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Account and preferences",
  },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    // Clear user data and redirect to login
    localStorage.removeItem("hisabkitab-data")
    window.location.href = "/"
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50 lg:bg-card lg:border-r">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Calculator className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-primary">HisabKitab</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-2xl text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <div className="flex-1">
                      <div>{item.title}</div>
                      <div className="text-xs opacity-70">{item.description}</div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 p-3 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Rahul Sharma</p>
                <p className="text-xs text-muted-foreground truncate">Student</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-2 justify-start rounded-xl" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50 rounded-2xl bg-card/80 backdrop-blur-sm"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 rounded-r-2xl">
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center h-16 px-6 border-b">
                <Link href="/dashboard" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                  <Calculator className="h-8 w-8 text-primary" />
                  <span className="text-xl font-bold text-primary">HisabKitab</span>
                </Link>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                      <div
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 rounded-2xl text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <div className="flex-1">
                          <div>{item.title}</div>
                          <div className="text-xs opacity-70">{item.description}</div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </nav>

              {/* User Profile Section */}
              <div className="p-4 border-t">
                <div className="flex items-center space-x-3 p-3 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Rahul Sharma</p>
                    <p className="text-xs text-muted-foreground truncate">Student</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 justify-start rounded-xl"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Bottom Navigation for Mobile - Made more responsive */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-sm border-t rounded-t-2xl">
        <nav className="flex items-center justify-around py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex flex-col items-center space-y-1 px-2 py-2 rounded-2xl text-xs font-medium transition-colors",
                    isActive ? "text-primary bg-primary/10" : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-[10px]">{item.title}</span>
                </div>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
