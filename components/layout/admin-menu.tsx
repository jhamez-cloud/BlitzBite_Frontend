"use client"

import { useRouter } from "next/navigation"
import { DropdownMenu } from "radix-ui"
import { LogOut, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAdminAuth } from "@/hooks/use-admin-auth"

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function AdminMenu() {
  const router = useRouter()
  const { admin, status, logout } = useAdminAuth()

  // Avoid a hydration flash before localStorage is read.
  if (status !== "authenticated" || !admin) {
    return <div className="size-9" aria-hidden />
  }

  const handleLogout = () => {
    logout()
    router.replace("/login?role=admin")
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Admin account menu"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {initials(admin.name)}
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
            <p className="truncate text-sm font-semibold">{admin.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {admin.email}
            </p>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-border" />

          <div className="flex items-center gap-2.5 px-2 py-2 text-sm">
            <Store className="size-4 text-muted-foreground" />
            <span className="truncate">{admin.restaurantName}</span>
          </div>

          <DropdownMenu.Separator className="my-1 h-px bg-border" />
          <DropdownMenu.Item
            onSelect={handleLogout}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-destructive transition-colors outline-none focus:bg-destructive/10 data-[highlighted]:bg-destructive/10"
          >
            <LogOut className="size-4" />
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
