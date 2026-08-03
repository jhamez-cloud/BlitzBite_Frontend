"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAdminAuth } from "@/hooks/use-admin-auth"

// Client-side gate: redirects to the login (admin mode) when no admin
// session exists. UX only (localStorage is client-only) — real enforcement
// arrives with Firebase Auth.
export function AdminGuard({
  next = "/dashboard",
  children,
}: {
  next?: string
  children: React.ReactNode
}) {
  const router = useRouter()
  const { status } = useAdminAuth()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/login?role=admin&next=${encodeURIComponent(next)}`)
    }
  }, [status, next, router])

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <>{children}</>
}
