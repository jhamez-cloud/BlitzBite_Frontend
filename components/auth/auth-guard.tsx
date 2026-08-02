"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

// Client-side gate: redirects to /login when unauthenticated.
// This is UX only (localStorage is client-only) — real enforcement
// arrives with Firebase Auth.
export function AuthGuard({
  next,
  children,
}: {
  next: string
  children: React.ReactNode
}) {
  const router = useRouter()
  const { status } = useAuth()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/login?next=${encodeURIComponent(next)}`)
    }
  }, [status, next, router])

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <>{children}</>
}
