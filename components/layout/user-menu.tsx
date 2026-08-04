"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { DropdownMenu } from "radix-ui"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { profileMenuLinks } from "@/constants/navigation"
import { useAuth } from "@/hooks/use-auth"

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function UserMenu() {
  const pathname = usePathname()
  const { user, status, logout } = useAuth()

  // Avoid a hydration flash before localStorage is read.
  if (status === "loading") {
    return <div className="size-9" aria-hidden />
  }

  if (status !== "authenticated" || !user) {
    return (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/login?next=${encodeURIComponent(pathname)}`}>
            Sign in
          </Link>
        </Button>
        <Button size="sm" className="hidden sm:inline-flex" asChild>
          <Link href={`/signup?next=${encodeURIComponent(pathname)}`}>
            Get Started
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Account menu"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {initials(user.name)}
          </span>
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-56 rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-lg data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <div className="px-2 py-1.5">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-border" />

          {profileMenuLinks.map((link) => {
            const Icon = link.icon
            return (
              <DropdownMenu.Item key={link.id} asChild>
                <Link
                  href={link.href}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors outline-none",
                    "focus:bg-muted data-highlighted:bg-muted"
                  )}
                >
                  <Icon className="size-4 text-muted-foreground" />
                  {link.label}
                </Link>
              </DropdownMenu.Item>
            )
          })}

          <DropdownMenu.Separator className="my-1 h-px bg-border" />
          <DropdownMenu.Item
            onSelect={() => logout()}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-destructive transition-colors outline-none focus:bg-destructive/10 data-highlighted:bg-destructive/10"
          >
            <LogOut className="size-4" />
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
