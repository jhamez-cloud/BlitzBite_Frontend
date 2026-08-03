"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { dashboardNavLinks } from "@/constants/navigation"
import { SITE_NAME } from "@/constants/site"
import { ThemeToggle } from "@/components/theme-toggle"
import { AdminGuard } from "@/components/auth/admin-guard"
import { AdminMenu } from "@/components/layout/admin-menu"
import { DashboardProvider } from "@/features/dashboard/dashboard-store"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <AdminGuard>
      <DashboardProvider>
        <div className="flex min-h-svh">
          <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:block">
            <div className="flex h-16 items-center px-6">
              <Link href="/dashboard" className="text-lg font-bold">
                {SITE_NAME}
                <span className="ml-1 text-xs font-medium text-muted-foreground">
                  Admin
                </span>
              </Link>
            </div>
            <nav className="space-y-1 px-3">
              {dashboardNavLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="size-4" />
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="flex h-16 items-center justify-between border-b border-border px-6">
              <h2 className="text-lg font-semibold lg:hidden">
                {SITE_NAME} Admin
              </h2>
              <div className="ml-auto flex items-center gap-2">
                <ThemeToggle />
                <AdminMenu />
              </div>
            </header>

            {/* Mobile navigation */}
            <nav className="flex scrollbar-none gap-1 overflow-x-auto border-b border-border px-4 py-2 lg:hidden">
              {dashboardNavLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    )}
                  >
                    <Icon className="size-3.5" />
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
              {children}
            </main>
          </div>
        </div>
      </DashboardProvider>
    </AdminGuard>
  )
}
